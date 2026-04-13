import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLLibrary from 'src/routes/libraries/routes/glLibrary';

import { RachelGreen_AllPermissions_CW_NonOpCW,
 } from './test-utils/afeRecords';
import {
    operatorPartnerLibrary,
    partnerListInAPC,
    savedMapOnePartner,
    savedMapOnePartnerSelectDeselectSelectNew,
    twoMappedPartnerRecords,
    savedMapOnePartnerAddressUndefined,
    operatorMappedLibrary
} from './test-utils/mapPatnerRecords';

import { WhitAndCorrOilAccountCodes, WhitAndCorrOilAccountCodesNonOP } from './test-utils/accountCodeGls';

 vi.mock('src/routes/sharedComponents/operatorDropdown', () => ({
  OperatorDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select an Operator"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="op-1">Operator One</option>
      <option value="op-2">Operator Two</option>
    </select>
  )
}));

vi.mock('src/routes/sharedComponents/partnerDropdown', () => ({
  PartnerDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select a Partner"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="op-1">Partner One</option>
      <option value="op-2">Partner Two</option>
    </select>
  )
}));

vi.mock('provider/fetch', () => ({
    fetchAccountCodesForOperatorOrPartner: vi.fn(),
}));

vi.mock('provider/write', () => ({
    updateGLAccountCodeStatus: vi.fn(),
}));

// At the top of your describe block, create a helper
const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = 'op-1'
) => {
  renderWithProviders(<GLLibrary />, {
    supabaseOverrides: {
      loggedInUser: RachelGreen_AllPermissions_CW_NonOpCW,
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
          app_metadata: [],
          user_metadata: {}
        }
      },
    }
  });

  await user.selectOptions(
    screen.getByRole('combobox', { name: /select an operator/i }),
    operatorValue
  );
  
};

const setupWithSelectionsNonOpAccount = async (
  user: ReturnType<typeof userEvent.setup>,
  partnerValue = 'op-1'
) => {
  renderWithProviders(<GLLibrary />, {
    supabaseOverrides: {
      loggedInUser: RachelGreen_AllPermissions_CW_NonOpCW,
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
          app_metadata: [],
          user_metadata: {}
        }
      },
    }
  });

  await user.selectOptions(
    screen.getByRole('combobox', { name: /select a partner/i }),
    partnerValue
  );
  
};

describe('View and edit the partner mappings',() => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
    user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    });

    test('Loads screen and waits for user selection', async () => {
        
        renderWithProviders(<GLLibrary />, {
            supabaseOverrides: {
                loggedInUser: RachelGreen_AllPermissions_CW_NonOpCW,
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
                        app_metadata: [],
                        user_metadata: {}
                    }
                },
            }
        });

        expect(screen.getByText('View the GL Account Codes for Operated or Non-Op AFEs')).toBeInTheDocument();
        expect(screen.getByText('Select the Operator for Operated AFEs')).toBeInTheDocument();
        
    });

    test('Fetches account codes and allows users to delete one Op account codes', async () => {
        (fetchProvider.fetchAccountCodesForOperatorOrPartner as Mock)
          .mockResolvedValue(WhitAndCorrOilAccountCodes);

        await setupWithSelections(user);
        expect(fetchProvider.fetchAccountCodesForOperatorOrPartner).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.201')[1]).not.toBeVisible();
          expect(screen.getAllByText('9210.202')[1]).not.toBeVisible();
        });
        
    
      const accountRow = screen.getAllByText('9210.201')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));
    
    
      });

    test('Fetches account codes and allows users to delete one Non Op', async () => {
        (fetchProvider.fetchAccountCodesForOperatorOrPartner as Mock)
          .mockResolvedValue(WhitAndCorrOilAccountCodes);

        await setupWithSelectionsNonOpAccount(user);
        expect(fetchProvider.fetchAccountCodesForOperatorOrPartner).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.201')[1]).not.toBeVisible();
          expect(screen.getAllByText('9210.202')[1]).not.toBeVisible();
        });
        
    
      const accountRow = screen.getAllByText('9210.201')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));
    
    
      });
    
    test('Select Op Account Codes after Non Op Call', async () => {
        (fetchProvider.fetchAccountCodesForOperatorOrPartner as Mock)
          .mockResolvedValueOnce(WhitAndCorrOilAccountCodes)
          .mockResolvedValueOnce(WhitAndCorrOilAccountCodesNonOP);

        await setupWithSelections(user);
        expect(fetchProvider.fetchAccountCodesForOperatorOrPartner).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.201')[1]).not.toBeVisible();
          expect(screen.getAllByText('9210.202')[1]).not.toBeVisible();
        });
        
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select a partner/i }),
            'op-2'
        );
        
        await waitFor(() => {
          expect(screen.getAllByText('5310.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('5310.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('5310.201')[1]).not.toBeVisible();
          expect(screen.getAllByText('5310.202')[1]).not.toBeVisible();
        });
    
      });

    test('Fetches account codes and allows users to bring one back from the dead', async () => {
        (fetchProvider.fetchAccountCodesForOperatorOrPartner as Mock)
          .mockResolvedValue(WhitAndCorrOilAccountCodes);

        await setupWithSelections(user);
        expect(fetchProvider.fetchAccountCodesForOperatorOrPartner).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.201')[1]).not.toBeVisible();
          expect(screen.getAllByText('9210.202')[1]).not.toBeVisible();
        });
        
        const showDeleted = screen.getByRole('checkbox', { name: /Hide Deleted Account Codes/i});
        await user.click(showDeleted);

        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.201')[1]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[1]).toBeInTheDocument();
        });

        const accountRow = screen.getAllByText('9210.201')[1].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));


    
      });
});