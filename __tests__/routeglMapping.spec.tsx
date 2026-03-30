import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLMapping from 'src/routes/glConfigurations/routes/glMapping';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    OperatorDropDown,
    PartnerDropdown,
    partnerAccountCodes,
    operatorAccountCodes
 } from './test-utils/afeRecords';

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
  fetchAccountCodesforOperatorToMap: vi.fn(),
}));

vi.mock('provider/write', () => ({
  updateOperatorNameAndStatus: vi.fn(),
}));

// At the top of your describe block, create a helper
const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = 'op-1',
  partnerValue = 'op-1'
) => {
  renderWithProviders(<GLMapping />, {
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
  await user.selectOptions(
    screen.getByRole('combobox', { name: /select a partner/i }),
    partnerValue
  );
};

describe('View and Edit Operators',() => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
    user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    })

    test('Shows a list of Operators and Partners to the user for mapping', async () => {
        const user = userEvent.setup();
                
            renderWithProviders(<GLMapping />, {
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
                      app_metadata:[],
                      user_metadata:{}
                    }
                  },
                }
              });
            
        expect(screen.getByText('Map GL Account Codes for Non-Op AFEs')).toBeInTheDocument();
        //await setupWithSelections(user);
        //expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    
        });

        test('Fetches account codes when both dropdowns are selected', async () => {
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
  });
});