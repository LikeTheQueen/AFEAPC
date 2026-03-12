import EditOperator from 'src/routes/createEditOperators/routes/editOperator';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserRachelGreen, loggedInUserRachelGreenNoRole2 } from './test-utils/rachelGreenuser'
import { operatorRecordNullValues } from './test-utils/operatorRecordsFormatted'

describe('Edit Operators',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    })

    test('It should show No Operator Message when the Operator to Edit is null', async () => {
        renderWithProviders(<EditOperator token='test-token' operatorToEdit={operatorRecordNullValues} />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
                        loading: false,
                        isSuperUser: false,
                        session: {
                        access_token: 'test-token',
                        refresh_token: 'test-refresh-token',
                        expires_in: 3600,
                        token_type: 'bearer',
                        user: {
                          id: 'test-user-id',
                          email: 'test@example.com',
                          aud: 'authenticated',
                          role: 'authenticated',
                          created_at: '2024-01-01T00:00:00Z',
                          app_metadata:[],
                          user_metadata:{}
                        }
                      },
                    }
        });

        expect(screen.getByText('No Operator Selected')).toBeInTheDocument();
    });
});