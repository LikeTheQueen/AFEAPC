import EditOperator from 'src/routes/createEditOperators/routes/editOperator';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';

import { loggedInUserRachelGreen } from './test-utils/rachelGreenuser'
import { operatorRecordNullValues, CorrWhitOilsOperatorRecord, CorrWhitOilsWithOnePartnerOperatorRecord } from './test-utils/operatorRecordsFormatted'
import { operatorNameChangedFromSupabase } from './test-utils/operatorRecords';
import { RachelGreen_AllPermissions_CW_NonOpCWAthena } from './test-utils/afeRecords';

vi.mock('provider/write', () => ({
  updateOperatorNameAndStatus: vi.fn(),
  updateOperatorAddress: vi.fn(),
  updatePartnerNameAndStatus: vi.fn(),
  updatePartnerAddress: vi.fn(),
  addPartnerSupabase: vi.fn(),
}));

vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
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

    test('It should show the New Non Op Address and save changes', async () => {
      const user = userEvent.setup();  
      const operatorFaked = RachelGreen_AllPermissions_CW_NonOpCWAthena.operatorRoles[0];
      const nonOperatedAddresses = RachelGreen_AllPermissions_CW_NonOpCWAthena.partnerRoles.filter(nonOp => nonOp.apc_op_id === operatorFaked.apc_id && (nonOp.role === 1 || nonOp.role === 9)) ?? [];
      vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
                  ok: true,
                  data: [{
                    created_at: "2025-04-20T23:05:38+00:00",
                    name: "CMS Co",
                    id: "record-d",
                    active: true,
                    apc_op_id: operatorFaked.apc_id
                  }],
                  message: undefined
              });
     

      renderWithProviders(<EditOperator 
        token='test-token' 
        opToEdit={operatorFaked}
        NonOpAddress={nonOperatedAddresses} />, {
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

        await waitFor(() => {
          expect(screen.getByText(/Add New Addresses for Non-Op AFEs/i)).toBeVisible();
        })

        const operatorNameInput = screen.getAllByRole('textbox', { name: /Non-Op Name/i });
        const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
        
        //The city and name [] is different because of the billing address
        expect(operatorNameInput[2]).toHaveValue('');
        expect(operatorCityInput[3]).toHaveValue('');
        await user.clear(operatorNameInput[2]);
        await user.type(operatorNameInput[2], 'CMS Co');
        expect(operatorNameInput[2]).toHaveValue('CMS Co');
        await user.clear(operatorCityInput[3]);
        await user.type(operatorCityInput[3], 'Austin');
        expect(operatorCityInput[3]).toHaveValue('Austin');
        const saveOpNameAddress = screen.getAllByRole('button', { name: /save/i });
        expect(saveOpNameAddress[3]).toBeInTheDocument();
        expect(saveOpNameAddress[3]).toBeDisabled();
        await user.type(screen.getAllByRole('textbox', { name: /street address/i })[3],'1234 Main');
        await user.type(screen.getAllByRole('textbox', { name: /suite/i })[3],'123');
        await user.type(screen.getAllByRole('textbox', { name: /state/i })[3],'Texas');
        await user.type(screen.getAllByRole('textbox', { name: /zip/i })[3],'12399');
        await user.selectOptions(
            screen.getAllByRole('combobox', { name: /country/i })[3],
            'United States'
        );

        expect(screen.getAllByRole('button', { name: /save/i })[3]).toBeEnabled();
        await user.click(saveOpNameAddress[3]);

        await waitFor(() => {
          expect(writeProvider.addPartnerSupabase).toHaveBeenCalledWith(
            'CMS Co',
            operatorFaked.apc_id,
            {
              id: 0,
              street: '1234 Main',
              suite: '123',
              city: "Austin",
              state: "Texas",
              zip: "12399",
              country:"United States",
              address_active: true,
            }
          )
        });

        expect(notifyStandard).toHaveBeenCalledWith(
             `Non-Operated name and billing address have been saved. Let's call it a clean tie-in.\n\n(TLDR: Operator and billing address ARE saved.)`
            );
        

    });
});