import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLLibrary from 'src/routes/libraries/routes/glLibrary';

import { RachelGreen_AllPermissions_CW_NonOpCW,
 } from './test-utils/afeRecords';


import { WhitAndCorrOilAccountCodes, WhitAndCorrOilAccountCodesNonOP } from './test-utils/accountCodeGls';
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';

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
    fetchAccountCodes: vi.fn(),
}));

vi.mock('provider/write', () => ({
    updateGLAccountStatus: vi.fn(),
}));

vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
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

describe('View and edit the GL Code Library',() => {
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
        (fetchProvider.fetchAccountCodes as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodes
          });
        (writeProvider.updateGLAccountStatus as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodes[0]
          });
        await setupWithSelections(user);
        await waitFor(() => {
          expect(fetchProvider.fetchAccountCodes).toHaveBeenCalled();
        });
        
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
        });
        
    
      const accountRow = screen.getAllByText('9210.201')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));

      await waitFor(() => {
        expect(writeProvider.updateGLAccountStatus).toHaveBeenCalledWith(WhitAndCorrOilAccountCodes[0].id, !WhitAndCorrOilAccountCodes[0].active, 'test-token')
      });

      expect(notifyStandard).toHaveBeenCalledWith(`GL Account Code saved. Books are balanced and the wellhead’s pressure-tight.\n\n(TLDR: GL Account Codes changes SAVED)`)
    
      });
    
    test('Fetches account codes and allows users to delete one Op account codes but returns an error in response', async () => {
        (fetchProvider.fetchAccountCodes as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodes
          });
        (writeProvider.updateGLAccountStatus as Mock)
          .mockResolvedValue({
            ok: false,
            message: 'RLS ISSUE'
          });
        await setupWithSelections(user);
        await waitFor(() => {
          expect(fetchProvider.fetchAccountCodes).toHaveBeenCalled();
        });
        
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
        });
        
    
      const accountRow = screen.getAllByText('9210.201')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));

      await waitFor(() => {
        expect(writeProvider.updateGLAccountStatus).toHaveBeenCalledWith(WhitAndCorrOilAccountCodes[0].id, !WhitAndCorrOilAccountCodes[0].active, 'test-token')
      });

      expect(notifyFailure).toHaveBeenCalledWith(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR changing the account code: RLS ISSUE)`)
    
      });

    test('Fetches account codes and allows users to delete one Non Op', async () => {
        (fetchProvider.fetchAccountCodes as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodesNonOP
          });
        (writeProvider.updateGLAccountStatus as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodesNonOP[0]
          });

        await setupWithSelectionsNonOpAccount(user);
        expect(fetchProvider.fetchAccountCodes).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('303.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('303.202')[0]).toBeInTheDocument();
        });
        
    
      const accountRow = screen.getAllByText('303.201')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));
    
    
      });
    
    test('Select Op Account Codes after Non Op Call', async () => {
        (fetchProvider.fetchAccountCodes as Mock)
          .mockResolvedValueOnce({
            ok: true,
            data: WhitAndCorrOilAccountCodes
          })
          .mockResolvedValueOnce({
            ok: true,
            data: WhitAndCorrOilAccountCodesNonOP
          });

        await setupWithSelections(user);
        expect(fetchProvider.fetchAccountCodes).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
        });
        
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select a partner/i }),
            'op-2'
        );
        
        await waitFor(() => {
          expect(screen.getAllByText('303.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('303.202')[0]).toBeInTheDocument();
        });
    
      });

    test('Fetches account codes and allows users to bring one back from the dead', async () => {
        (fetchProvider.fetchAccountCodes as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodes
          });
        (writeProvider.updateGLAccountStatus as Mock)
          .mockResolvedValue({
            ok: true,
            data: WhitAndCorrOilAccountCodes[0]
          });

        await setupWithSelections(user);
        expect(fetchProvider.fetchAccountCodes).toHaveBeenCalledTimes(1);
        await waitFor(() => {
          expect(screen.getAllByText('9210.201')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.203')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.203')[0]).not.toBeVisible();
        });
        
        const showDeleted = screen.getByRole('checkbox', { name: /Hide Deleted Account Codes/i});
        await user.click(showDeleted);

        await waitFor(() => {
          expect(screen.getAllByText('9210.203')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.202')[0]).toBeInTheDocument();
          expect(screen.getAllByText('9210.203')[0]).toBeVisible();
        });

        const accountRow = screen.getAllByText('9210.203')[0].closest('tr')!;
      await user.click(within(accountRow).getByRole('button'));


    
      });
});