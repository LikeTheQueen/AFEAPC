import EditOperator from 'src/routes/createEditOperators/routes/editOperator';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserRachelGreen } from './test-utils/rachelGreenuser'
import { operatorRecordNullValues, CorrWhitOilsOperatorRecord, CorrWhitOilsWithOnePartnerOperatorRecord } from './test-utils/operatorRecordsFormatted'
import { operatorNameChangedFromSupabase } from './test-utils/operatorRecords';

vi.mock('provider/write', () => ({
  updateOperatorNameAndStatus: vi.fn(),
  updateOperatorAddress: vi.fn(),
  updatePartnerNameAndStatus: vi.fn(),
  updatePartnerAddress: vi.fn(),
}));

describe('Edit Operators',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    })
 
    test.skip('It should show No Operator Message when the Operator to Edit is null', async () => {
        renderWithProviders(<EditOperator 
          token='test-token' 
          opToEdit={loggedInUserRachelGreen.operatorRoles[0]}
          NonOpAddress={loggedInUserRachelGreen.partnerRoles} />, {
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
                  data: operatorNameChangedFromSupabase,
                  message: undefined
              });
     

      renderWithProviders(<EditOperator 
        token='test-token' 
        opToEdit={loggedInUserRachelGreen.operatorRoles[0]}
        NonOpAddress={loggedInUserRachelGreen.partnerRoles} />, {
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

        const operatorNameInput = screen.getByRole('textbox', { name: /Operator Name/i });
        const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
        await waitFor(() => {
          expect(operatorNameInput).toHaveValue(loggedInUserRachelGreen.operatorRoles[0].apc_name);
        expect(operatorCityInput[0]).toHaveValue(loggedInUserRachelGreen.operatorRoles[0].apc_address.city);

        })
        
        await user.clear(operatorNameInput);
        await user.type(operatorNameInput, 'Corr Mike Oils');
        expect(operatorNameInput).toHaveValue('Corr Mike Oils');
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
                  data: [{
                    created_at: "2025-04-20T23:05:38+00:00",
                    name: "CMS Co",
                    id: "record-d",
                    active: true,
                    apc_op_id: "3b34a78a-13ad-40b5-aecd-268d56dd5e0d"
                  }],
                  message: undefined
              });
     

      renderWithProviders(<EditOperator 
        token='test-token' 
        opToEdit={loggedInUserRachelGreen.operatorRoles[0]}
        NonOpAddress={loggedInUserRachelGreen.partnerRoles} />, {
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

        const operatorNameInput = screen.getAllByRole('textbox', { name: /Non-Op Name/i });
        const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
       
        expect(operatorNameInput[0]).toHaveValue(loggedInUserRachelGreen.partnerRoles[0].apc_name);
        expect(operatorCityInput[1]).toHaveValue(loggedInUserRachelGreen.partnerRoles[0].apc_address.city);
        await user.clear(operatorNameInput[0]);
        await user.type(operatorNameInput[0], 'CMS Co');
        expect(operatorNameInput[0]).toHaveValue('CMS Co');
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