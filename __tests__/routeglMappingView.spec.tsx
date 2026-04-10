import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLMapping from 'src/routes/glConfigurations/routes/glMappingView';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    OperatorDropDown,
    PartnerDropdown,
    partnerAccountCodes
 } from './test-utils/afeRecords';

 import { mappedGLCodes } from './test-utils/accountCodeGls';

 vi.mock('src/routes/sharedComponents/operatorDropdown', () => ({
  OperatorDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select an Operator"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="a4367e56-14bf-4bd1-b0f1-fecc7d97b58c">Operator One</option>
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
      <option value="996917a3-415a-4e9d-a7a9-c04c6050fd3f">Partner One</option>
      <option value="op-2">Partner Two</option>
    </select>
  )
}));

vi.mock('provider/fetch', () => ({
  fetchMappedGLAccountCode: vi.fn(),
}));

vi.mock('provider/write', () => ({
    updateGLCodeMapping: vi.fn(),
}));

const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = 'a4367e56-14bf-4bd1-b0f1-fecc7d97b58c',
  partnerValue = '996917a3-415a-4e9d-a7a9-c04c6050fd3f'
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

    });

    test('Shows a list of Operators and Partners to the user for mapping', async () => {

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

        expect(screen.getByText('View and Manage you GL Account Code Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select both an Operator and Your Company as a Partner from the dropdowns to view the GL Account Code Mappings.')).toBeInTheDocument();

    });

    test('Fetches the mapped account codes when a user selects the dropdowns and let user delete one', async () => {
        (fetchProvider.fetchMappedGLAccountCode as Mock)
            .mockResolvedValue({ ok: true, data: mappedGLCodes });
        await setupWithSelections(user);
        expect(fetchProvider.fetchMappedGLAccountCode).toHaveBeenCalledTimes(1);

       
            const mappedSection = screen.getByText('GL Account Code Mappings').closest('div')!;
            expect(mappedSection).not.toHaveAttribute('hidden');

            const mappedRow = within(mappedSection).getByText(
                (content, element) => !!element && content.includes('9210.240')
            ).closest('tr')!;
            expect(mappedRow).toBeInTheDocument();
        await user.click(within(mappedRow).getAllByRole('button', { name: /delete mapping/i })[0]);
        expect(writeProvider.updateGLCodeMapping).toHaveBeenCalledWith(36, false, 'test-token');
        
        
    });

    
});