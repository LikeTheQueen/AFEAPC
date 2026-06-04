import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import PartnerMappingView from 'src/routes/partnerConfigurations/routes/partnerMappingView';

import { RachelGreen_AllPermissions_CW_NonOpCW,
 } from './test-utils/afeRecords';
import {
    operatorPartnerLibrary,
    partnerListInAPC,
    savedMapOnePartner,
    savedMapOnePartnerSelectDeselectSelectNew,
    twoMappedPartnerRecords,
    savedMapOnePartnerAddressUndefined,
    mappedRecords
} from './test-utils/mapPatnerRecords';

 vi.mock('src/routes/sharedComponents/operatorDropdown', () => ({
  OperatorDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select an Operator"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="3b34a78a-13ad-40b5-aecd-268d56dd5e0d">Operator One</option>
      <option value="op-2">Operator Two</option>
    </select>
  )
}));

vi.mock('provider/fetch', () => ({
    fetchPartnersLinkedOrUnlinkedToOperator: vi.fn(),
    fetchPartnersFromSourceSystemInSupabase: vi.fn(),
    fetchMappedPartners: vi.fn()
}));

vi.mock('provider/write', () => ({
    updatePartnerMapping: vi.fn(),
    updatePartnerProcessedMapping: vi.fn(),
}));

// At the top of your describe block, create a helper
const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = "3b34a78a-13ad-40b5-aecd-268d56dd5e0d",
) => {
  renderWithProviders(<PartnerMappingView />, {
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
        (fetchProvider.fetchMappedPartners as Mock)
                    .mockResolvedValue(mappedRecords);
        
        renderWithProviders(<PartnerMappingView />, {
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

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(0);
        
    });

    test('Shows a list of mapped Partners to the user', async () => {
        (fetchProvider.fetchMappedPartners as Mock)
        .mockResolvedValue({ok: true, data: mappedRecords});
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        await waitFor(() => {
            expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(1);
        })
        

        await waitFor(() => {
            expect(screen.getAllByText('Mckenzie Oil')[0]).toBeInTheDocument();
            screen.debug();
            //expect(screen.getByText('Mckenzie Oil')).toBeInTheDocument();
            //expect(screen.getAllByText('Mewbourne Oil Company')[0]).toBeInTheDocument();
            //expect(screen.getAllByText('Navigator Corporation')[0]).toBeInTheDocument();
            //expect(screen.getAllByText('Nav Corp Gas and Oil')[0]).toBeInTheDocument();
        });
        
    });

    test('Shows a message if there are no mapped partners', async () => {
        (fetchProvider.fetchMappedPartners as Mock)
                    .mockResolvedValue({ok:true, data:[]});
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText(/This Operator has not mapped thier Partners to the AFE Partner Connection Library./i)).toBeInTheDocument();
        });
        
    });

    test('Shows a message if response is undefined', async () => {
        (fetchProvider.fetchMappedPartners as Mock)
                    .mockResolvedValue({ok:false, data:[]});
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText(/This Operator has not mapped thier Partners to the AFE Partner Connection Library./i)).toBeInTheDocument();
        });
        
    });

    test('User deletes a partner mapping', async () => {
        (fetchProvider.fetchMappedPartners as Mock)
        .mockResolvedValue({ok: true, data: mappedRecords});
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getAllByText('Mckenzie Oil')[0]).toBeInTheDocument();
            expect(screen.getByText('McLane Gas and Oil')).toBeInTheDocument();
            expect(screen.getAllByText('Mewbourne Oil Company')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Navigator Corporation')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Nav Corp Gas and Oil')[0]).toBeInTheDocument();
        });

        const row = screen.getByRole('row', { name: /McLane Gas and Oil/i });

        expect(row).toBeInTheDocument();
        const deleteButton = within(row!).getAllByRole('button', { name: /delete mapping/i });

        await user.click(deleteButton[0]);

        await waitFor(() => {
            expect(writeProvider.updatePartnerMapping).toHaveBeenCalledWith([38], false);
        });
        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapping).toHaveBeenCalledWith(['86d027f1-a2b2-49c2-b5c2-d706b1f8fb5d'], false);
        });
        
    });

    test('User deletes a partner mapping', async () => {
        (fetchProvider.fetchMappedPartners as Mock)
         .mockResolvedValue({ok: true, data: mappedRecords});
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchMappedPartners).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getAllByText('Mckenzie Oil')[0]).toBeInTheDocument();
            expect(screen.getByText('McLane Gas and Oil')).toBeInTheDocument();
            expect(screen.getAllByText('Mewbourne Oil Company')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Navigator Corporation')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Nav Corp Gas and Oil')[0]).toBeInTheDocument();
        });

        const row = screen.getByRole('row', { name: /McLane Gas and Oil/i });

        expect(row).toBeInTheDocument();
        const deleteButton = within(row!).getAllByRole('button', { name: /delete mapping/i });

        await user.click(deleteButton[1]);

        await waitFor(() => {
            expect(writeProvider.updatePartnerMapping).toHaveBeenCalledWith([38], false);
        });
        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapping).toHaveBeenCalledWith(['86d027f1-a2b2-49c2-b5c2-d706b1f8fb5d'], false);
        });
        
    });

});