import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import PartnerMapping from 'src/routes/partnerConfigurations/routes/partnerMapping';

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
      <option value="op-1">Operator One</option>
      <option value="op-2">Operator Two</option>
    </select>
  )
}));

vi.mock('src/routes/sharedComponents/partnerDropdown', () => ({
  PartnerDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select McKenzie Oils"
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
    fetchNonOpList: vi.fn(),
    fetchSourceSystemPartners: vi.fn(),
    fetchMappedPartners: vi.fn(),
}));

vi.mock('provider/write', () => ({
    updatePartnerProcessedMapValue: vi.fn(),
  writePartnerMappingsToDB: vi.fn(),
}));

// At the top of your describe block, create a helper
const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  operatorValue = 'op-1'
) => {
  renderWithProviders(<PartnerMapping />, {
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

    test('Shows a list of Operators and APC Partners to the user for mapping', async () => {
        (fetchProvider.fetchNonOpList as Mock)
        .mockResolvedValue({ok: true, data: partnerListInAPC});

        renderWithProviders(<PartnerMapping />, {
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

        expect(screen.getByText('Map Partners from your AFE System to Partners in AFE Partner Connections')).toBeInTheDocument();
        expect(screen.getByText('Select your company, as the Operator, to Create Mappings For:')).toBeInTheDocument();
        expect(fetchProvider.fetchNonOpList).toHaveBeenCalledTimes(1);
        await waitFor(() => {
        expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        expect(screen.getByText('Corr and Whit Oil')).toBeInTheDocument();
        expect(screen.queryByText('Corr and Cora Oil')).not.toBeInTheDocument();
        });
    });

    test('Fetches the Operators partners and APC Partner List and returns an empty array since no partners are loaded', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue(undefined);

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText(/Partner Library from your source system has not been loaded/i)).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

    });

    test('Error getting the list of APC Partners', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: false, message: 'Connection Error' });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue(undefined);

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText(/Partner Library from your source system has not been loaded/i)).toBeInTheDocument();
            expect(screen.getByText(/Please contact AFE Partner Connections Support./i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, create map, save map', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));


        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const saveButton = screen.getByRole('button', { name: /save mappings/i });
        expect(saveButton).not.toBeDisabled();
        await user.click(saveButton);

        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([86], true);
        });

        await waitFor(() => {
            expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
                expect.objectContaining(savedMapOnePartner),
            ]);
        });

    });

    test('Filters out already mapped Partners for both Operator and APC', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: mappedRecords});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(fetchProvider.fetchMappedPartners).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const hidePartnerMapped = screen.getByRole('checkbox', { name: /Hide Mapped Partners/i});
        const hideAPCMapped = screen.getByRole('checkbox', { name: /Hide AFEPC Partners Already Mapped To/i});

        await user.click(hidePartnerMapped);
        await user.click(hideAPCMapped);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            //expect(screen.getByText('McKenzie Oils')).not.toBeVisible();
            expect(screen.getByText('Energy Oil Company')).toBeVisible();
        });
    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, create map, save map, with address mostly undefined', async () => {
        (fetchProvider.fetchNonOpList as Mock)
        .mockResolvedValue({ok: true, data: partnerListInAPC});
        (fetchProvider.fetchSourceSystemPartners as Mock)
        .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
        .mockResolvedValue({ ok: true, data: []});
        
        
        await setupWithSelections(user);
        
        await waitFor(() => {
      expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
      expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
      expect(screen.getByText('Whit and Corr Oil')).toBeInTheDocument();
    });

     await waitFor(() => {
      expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
    });

    const operatorRow = screen.getByText('Arctic Canada Ltd.').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('Whit and Corr Oil').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const createButton = screen.getByRole('button', { name: /Map Partners/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

  await waitFor(() => {
  expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([46], true);
    });

  await waitFor(() => {
  expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
      expect.objectContaining(savedMapOnePartnerAddressUndefined),
    ]);
    });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, create map, save map: User attempts to create the save map twice', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));

        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

       
        await user.click(within(operatorRow).getByRole('checkbox'));

        
        await user.click(within(partnerRow).getByRole('checkbox'));

        
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const saveButton = screen.getByRole('button', { name: /save mappings/i });
        expect(saveButton).not.toBeDisabled();
        await user.click(saveButton);

        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([86], true);
        });

        await waitFor(() => {
            expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
                expect.objectContaining(savedMapOnePartner),
            ]);
        });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, deselect, select new, create map, save map', async () => {
        (fetchProvider.fetchNonOpList as Mock)
        .mockResolvedValue({ok: true, data: partnerListInAPC});
        (fetchProvider.fetchSourceSystemPartners as Mock)
        .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});
        
        await setupWithSelections(user);
        
        await waitFor(() => {
      expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
      expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
      expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
    });

     await waitFor(() => {
      expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
    });

    const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

 
  await user.click(within(operatorRow).getByRole('checkbox'));
  await user.click(within(partnerRow).getByRole('checkbox'));

  const createButton = screen.getByRole('button', { name: /Map Partners/i });
  expect(createButton).toBeDisabled();

  const operatorRowNewSelect = screen.getByText('McKenzie Oils').closest('tr')!;
  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));
  
  await user.click(within(partnerRow).getByRole('checkbox'));
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

  await waitFor(() => {
  expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([90], true);
    });

  
  await waitFor(() => {
  expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
      expect.objectContaining(savedMapOnePartnerSelectDeselectSelectNew),
    ]);
    });

    


    
    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, deselect, select new, create map, save map of multiples', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));

        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const operatorRowNewSelect = screen.getByText('McKenzie Oils').closest('tr')!;
        await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

        await user.click(within(partnerRow).getByRole('checkbox'));
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const saveButton = screen.getByRole('button', { name: /save mappings/i });
        expect(saveButton).not.toBeDisabled();
        await user.click(saveButton);

        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([86,90], true);
        });


        await waitFor(() => {
            expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith(twoMappedPartnerRecords);
        });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, deselect, select new, create map, delete created mapping MOBILE and save map', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));

        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const operatorRowNewSelect = screen.getByText('McKenzie Oils').closest('tr')!;
        await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

        await user.click(within(partnerRow).getByRole('checkbox'));
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const pendingSection = screen.getByText('Pending Mappings').closest('div')!;
        const pendingRow = within(pendingSection)
            .getByText((content, element) =>
                element?.tagName === 'P' && content.includes('McKenzie Oils')
            )
            .closest('tr')!;

        await user.click(within(pendingRow).getAllByRole('button', { name: /delete mapping/i })[0]);

        const saveButton = screen.getByRole('button', { name: /save mappings/i });
        expect(saveButton).not.toBeDisabled();
        await user.click(saveButton);

        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([86], true);
        });


        await waitFor(() => {
            expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
                expect.objectContaining(savedMapOnePartner),
            ]);
        });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, deselect, select new, create map, delete created mapping DESKTOP and save map', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));

        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const operatorRowNewSelect = screen.getByText('McKenzie Oils').closest('tr')!;
        await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

        await user.click(within(partnerRow).getByRole('checkbox'));
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const pendingSection = screen.getByText('Pending Mappings').closest('div')!;
        const pendingRow = within(pendingSection)
            .getByText((content, element) =>
                element?.tagName === 'P' && content.includes('McKenzie Oils')
            )
            .closest('tr')!;

        await user.click(within(pendingRow).getAllByRole('button', { name: /delete mapping/i })[1]);

        const saveButton = screen.getByRole('button', { name: /save mappings/i });
        expect(saveButton).not.toBeDisabled();
        await user.click(saveButton);

        await waitFor(() => {
            expect(writeProvider.updatePartnerProcessedMapValue).toHaveBeenCalledWith([86], true);
        });


        await waitFor(() => {
            expect(writeProvider.writePartnerMappingsToDB).toHaveBeenCalledWith([
                expect.objectContaining(savedMapOnePartner),
            ]);
        });

    });

    test('Fetches the Operators partners and APC Partner List and lets the user select, deselect, select new, create map, clear all mappings', async () => {
        (fetchProvider.fetchNonOpList as Mock)
            .mockResolvedValue({ ok: true, data: partnerListInAPC });
        (fetchProvider.fetchSourceSystemPartners as Mock)
            .mockResolvedValue({ ok: true, data: operatorPartnerLibrary});
        (fetchProvider.fetchMappedPartners as Mock)
            .mockResolvedValue({ ok: true, data: []});

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText('McKenzie Oils')).toBeInTheDocument();
            expect(screen.getByText('Archipelago Energy Inc.')).toBeInTheDocument();
            expect(screen.getByText('Energy Oil Company')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Map Partners/i })).toBeDisabled();
        });

        const operatorRow = screen.getByText('Archipelago Energy Inc.').closest('tr')!;
        await user.click(within(operatorRow).getByRole('checkbox'));

        const partnerRow = screen.getByText('Energy Oil Company').closest('tr')!;
        await user.click(within(partnerRow).getByRole('checkbox'));

        const createButton = screen.getByRole('button', { name: /Map Partners/i });
        
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const clearMappingButton = screen.getByRole('button', {name: /clear mappings/i });
        expect(clearMappingButton).not.toBeDisabled();

        const operatorRowNewSelect = screen.getByText('McKenzie Oils').closest('tr')!;
        await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

        await user.click(within(partnerRow).getByRole('checkbox'));
        expect(createButton).not.toBeDisabled();
        await user.click(createButton);

        const pendingSection = screen.getByText('Pending Mappings').closest('div')!;
        const pendingRow = within(pendingSection)
            .getByText((content, element) =>
                element?.tagName === 'P' && content.includes('McKenzie Oils')
            )
            .closest('tr')!;

        await user.click(clearMappingButton);
        expect(pendingSection).toHaveAttribute('hidden');

    });

    

});
