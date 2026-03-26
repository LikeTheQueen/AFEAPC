import EditOperator from 'src/routes/createEditOperators/routes/editOperator';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserRachelGreen, loggedInUserRachelGreenNoRole2 } from './test-utils/rachelGreenuser'
import { operatorRecordNullValues, CorrWhitOilsOperatorRecord, CorrWhitOilsOperatorRecordUpdated, CorrWhitOilsWithOnePartnerOperatorRecord } from './test-utils/operatorRecordsFormatted'

vi.mock('provider/write', () => ({
  updateOperatorNameAndStatus: vi.fn(),
  updateOperatorAddress: vi.fn(),
  updatePartnerNameAndStatus: vi.fn(),
}));

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

    test('It should show the Operator address and save changes', async () => {
      const user = userEvent.setup();  
      vi.mocked(writeProvider.updateOperatorNameAndStatus).mockResolvedValueOnce({
                  ok: true,
                  data: {id: 'record-d', active: true, name: 'Corr Mike Oils'}
              });
      vi.mocked(writeProvider.updateOperatorAddress).mockResolvedValueOnce({
                  ok: true,
                  data: {id: 'record-d', active: true }
              });

      renderWithProviders(<EditOperator token='test-token' operatorToEdit={CorrWhitOilsOperatorRecord} />, {
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

        const operatorNameInput = screen.getAllByRole('textbox', { name: /name/i });
        const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
        expect(operatorNameInput[0]).toHaveValue('Corr and Whit Oils');
        expect(operatorCityInput[0]).toHaveValue('Houston');
        await user.clear(operatorNameInput[0]);
        await user.type(operatorNameInput[0], 'Corr Mike Oils');
        expect(operatorNameInput[0]).toHaveValue('Corr Mike Oils');
        await user.clear(operatorCityInput[0]);
        await user.type(operatorCityInput[0], 'Austin');
        expect(operatorCityInput[0]).toHaveValue('Austin');

        const saveOpNameAddress = screen.getAllByRole('button', { name: /save/i });
        expect(saveOpNameAddress[0]).toBeInTheDocument();
        await user.click(saveOpNameAddress[0]);

        await waitFor(() => {
          expect(writeProvider.updateOperatorNameAndStatus).toHaveBeenCalled();
        });

    });

    test('It should show the Operator Non Op address and save changes', async () => {
      const user = userEvent.setup();  
      vi.mocked(writeProvider.updatePartnerNameAndStatus).mockResolvedValueOnce({
                  ok: true,
                  data: {id: 'record-d', active: true, name: 'CMS Co'}
              });

      renderWithProviders(<EditOperator token='test-token' operatorToEdit={CorrWhitOilsWithOnePartnerOperatorRecord} />, {
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

        const operatorNameInput = screen.getAllByRole('textbox', { name: /name/i });
        const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
        screen.debug();
        console.log(operatorCityInput[1]);
        expect(operatorNameInput[1]).toHaveValue('Corr Partner Name');
        expect(operatorCityInput[1]).toHaveValue('Dallas');
        await user.clear(operatorNameInput[1]);
        await user.type(operatorNameInput[1], 'CMS Co');
        expect(operatorNameInput[1]).toHaveValue('CMS Co');
        await user.clear(operatorCityInput[1]);
        await user.type(operatorCityInput[1], 'Austin');
        expect(operatorCityInput[1]).toHaveValue('Austin');

        const saveOpNameAddress = screen.getAllByRole('button', { name: /save/i });
        expect(saveOpNameAddress[1]).toBeInTheDocument();
        await user.click(saveOpNameAddress[1]);

        await waitFor(() => {
          expect(writeProvider.updatePartnerNameAndStatus).toHaveBeenCalled();
        });

    });
});