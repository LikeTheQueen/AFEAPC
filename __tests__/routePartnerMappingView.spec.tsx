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
    operatorMappedLibrary
} from './test-utils/mapPatnerRecords';

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

vi.mock('provider/fetch', () => ({
    fetchPartnersLinkedOrUnlinkedToOperator: vi.fn(),
    fetchPartnersFromSourceSystemInSupabase: vi.fn(),
    fetchPartnersFromPartnersCrosswalk: vi.fn()
}));

vi.mock('provider/write', () => ({
    updatePartnerMapping: vi.fn(),
    updatePartnerProcessedMapping: vi.fn(),
}));

// At the top of your describe block, create a helper
const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = 'op-1'
) => {
  renderWithProviders(<PartnerMappingView />, {
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
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue(operatorMappedLibrary);
        
        renderWithProviders(<PartnerMappingView />, {
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

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(0);
        
    });

    test('Shows a list of mapped Partners to the user', async () => {
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue(operatorMappedLibrary);
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getAllByText('John Ross Exploration Inc')[0]).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getAllByText('Energy Oil Company')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Denver 3')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Athena Minerals Inc.')[0]).toBeInTheDocument();
        });
        
    });

    test('Shows a message if there are no mapped partners', async () => {
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue([]);
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText(/This Operator has not mapped thier Partners to the AFE Partner Connection Library./i)).toBeInTheDocument();
        });
        
    });

    test('Shows a message if response is undefined', async () => {
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue(undefined);
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText(/This Operator has not mapped thier Partners to the AFE Partner Connection Library./i)).toBeInTheDocument();
        });
        
    });

    test('User deletes a partner mapping', async () => {
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue(operatorMappedLibrary);
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getAllByText('John Ross Exploration Inc')[0]).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getAllByText('Energy Oil Company')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Denver 3')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Athena Minerals Inc.')[0]).toBeInTheDocument();
        });

        const row = screen.getByRole('row', { name: /Archipelago Energy Inc./i });

        expect(row).toBeInTheDocument();
        const deleteButton = within(row!).getAllByRole('button', { name: /delete mapping/i });

        await user.click(deleteButton[0]);

        await waitFor(() => {
            expect(writeProvider.updatePartnerMapping).toHaveBeenCalledWith([24], false);
        });
        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapping).toHaveBeenCalledWith(['91f3ebe5-d5f6-4211-959f-1121b666804b'], false);
        });
        
    });

    test('User deletes a partner mapping', async () => {
        (fetchProvider.fetchPartnersFromPartnersCrosswalk as Mock)
                    .mockResolvedValue(operatorMappedLibrary);
        
        await setupWithSelections(user);

        expect(screen.getByText('View and Manage your Partner Mappings')).toBeInTheDocument();
        expect(screen.getByText('Select an Operator to View Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchPartnersFromPartnersCrosswalk).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getAllByText('John Ross Exploration Inc')[0]).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getAllByText('Energy Oil Company')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Denver 3')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Athena Minerals Inc.')[0]).toBeInTheDocument();
        });

        const row = screen.getByRole('row', { name: /Archipelago Energy Inc./i });

        expect(row).toBeInTheDocument();
        const deleteButton = within(row!).getAllByRole('button', { name: /delete mapping/i });

        await user.click(deleteButton[1]);

        await waitFor(() => {
            expect(writeProvider.updatePartnerMapping).toHaveBeenCalledWith([24], false);
        });
        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapping).toHaveBeenCalledWith(['91f3ebe5-d5f6-4211-959f-1121b666804b'], false);
        });
        
    });

});