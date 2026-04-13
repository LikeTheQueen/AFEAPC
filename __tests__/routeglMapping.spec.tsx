import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLMapping from 'src/routes/glConfigurations/routes/glMapping';

import { RachelGreen_AllPermissions_CW_NonOpCW
 } from './test-utils/afeRecords';

 import { nonOpOperatorAccountCodes, operatorAccountCodes } from './test-utils/accountCodeGls';

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
  writeGLCodeMapping: vi.fn(),
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
        expect(screen.getByText('Select both an Operator and Your Company as a Partner from the dropdowns to show both account lists for mapping.')).toBeInTheDocument();
        
    
        });

  test('Displays warning when the account lists are null', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText(/If they haven't been uploaded you can reach out to the Operator to let them know/i)).toBeInTheDocument();
      expect(screen.getByText(/If they haven't been uploaded head back to the upload screen to get those accounts in the system./i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  
  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.201',
      operator_account_description: 'LICENCE, FEES, TAXES, & PERMITS',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 1,
      partner_account_number: '5310.202',
      partner_account_description: 'SURFACE LEASE ACQUISITION',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 98,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping selecting their GL then Operator GL and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });
  
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.201',
      operator_account_description: 'LICENCE, FEES, TAXES, & PERMITS',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 1,
      partner_account_number: '5310.202',
      partner_account_description: 'SURFACE LEASE ACQUISITION',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 98,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping selecting their GL then Operator GL and clears mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });
  
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);
  
  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();

  const clearButton = screen.getByRole('button', { name: /clear mappings/i });
  expect(clearButton).not.toBeDisabled();
  await user.click(clearButton);

  expect(saveButton).not.toBeInTheDocument

  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping and save mapping if there is not account group or descriptions', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.207').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.207',
      operator_account_description: '',
      operator_account_group: '',
      apc_op_account_id: 4,
      partner_account_number: '5310.202',
      partner_account_description: 'SURFACE LEASE ACQUISITION',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 98,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping and save mapping if there is not account group or descriptions', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.207').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('5310.208').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.207',
      operator_account_description: '',
      operator_account_group: '',
      apc_op_account_id: 4,
      partner_account_number: '5310.208',
      partner_account_description: '',
      partner_account_group: '',
      apc_partner_account_id: 104,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create mapping selecting their GL then Operator GL and save mapping if there is not account group or descriptions', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  
  const partnerRow = screen.getByText('5310.208').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const operatorRow = screen.getByText('9210.207').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));

  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.207',
      operator_account_description: '',
      operator_account_group: '',
      apc_op_account_id: 4,
      partner_account_number: '5310.208',
      partner_account_description: '',
      partner_account_group: '',
      apc_partner_account_id: 104,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to select and unselect accounts, to create mapping and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  await user.click(within(operatorRow).getByRole('checkbox'));
  const operatorRowNewSelect = screen.getByText('9210.202').closest('tr')!;
  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

  
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));
  await user.click(within(partnerRow).getByRole('checkbox'));
  const partnerRowNewSelect = screen.getByText('5310.203').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  
  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

   const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    expect.objectContaining({
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.202',
      operator_account_description: 'SURFACE LEASE ACQUISITION',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 2,
      partner_account_number: '5310.202',
      partner_account_description: 'SURFACE LEASE ACQUISITION',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 98,
    }),
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create multiple mappings and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

  
  const operatorRowNewSelect = screen.getByText('9210.202').closest('tr')!;
  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

  const partnerRowNewSelect = screen.getByText('5310.203').closest('tr')!;
  await user.click(within(partnerRowNewSelect).getByRole('checkbox'));

  await user.click(createButton);

  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));
  await user.click(within(partnerRowNewSelect).getByRole('checkbox'));

  await user.click(createButton);


  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    {
      apc_operator_id: 'op-1',
      apc_op_account_id: 1,
      operator_account_number: '9210.201',
      operator_account_description: 'LICENCE, FEES, TAXES, & PERMITS',
      operator_account_group: '1. DRILLING',
      apc_partner_id: 'op-1',
      partner_account_number: '5310.202',
      partner_account_description: 'SURFACE LEASE ACQUISITION',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 98,
    },
    {
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.202',
      operator_account_description: 'SURFACE LEASE ACQUISITION',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 2,
      partner_account_number: '5310.203',
      partner_account_description: 'SURVEYING',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 100,
    },
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create multiple mappings, delete one and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

  
  const operatorRowNewSelect = screen.getByText('9210.202').closest('tr')!;
  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

  const partnerRowNewSelect = screen.getByText('5310.203').closest('tr')!;
  await user.click(within(partnerRowNewSelect).getByRole('checkbox'));

  await user.click(createButton);

  const pendingSection = screen.getByText('Pending Mappings').closest('div')!;
  const pendingRow = within(pendingSection)
  .getByText((content, element) => 
    element?.tagName === 'P' && content.includes('9210.201')
  )
  .closest('tr')!;

await user.click(within(pendingRow).getAllByRole('button', { name: /delete mapping/i })[0]);

  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    
    {
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.202',
      operator_account_description: 'SURFACE LEASE ACQUISITION',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 2,
      partner_account_number: '5310.203',
      partner_account_description: 'SURVEYING',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 100,
    },
  ]);
  });

  test('Fetches account codes when both dropdowns are selected allows user to create multiple mappings, delete one MOBILE and save mapping', async () => {
    (fetchProvider.fetchAccountCodesforOperatorToMap as Mock)
      .mockResolvedValueOnce(operatorAccountCodes)
      .mockResolvedValueOnce(nonOpOperatorAccountCodes);
    await setupWithSelections(user);
    expect(fetchProvider.fetchAccountCodesforOperatorToMap).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByText('9210.201')).toBeInTheDocument();
      expect(screen.getByText('5310.202')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create mapping/i })).toBeDisabled();
    });

  const operatorRow = screen.getByText('9210.201').closest('tr')!;
  await user.click(within(operatorRow).getByRole('checkbox'));
  const partnerRow = screen.getByText('5310.202').closest('tr')!;
  await user.click(within(partnerRow).getByRole('checkbox'));

  const createButton = screen.getByRole('button', { name: /create mapping/i });
  expect(createButton).not.toBeDisabled();
  await user.click(createButton);

  
  const operatorRowNewSelect = screen.getByText('9210.202').closest('tr')!;
  await user.click(within(operatorRowNewSelect).getByRole('checkbox'));

  const partnerRowNewSelect = screen.getByText('5310.203').closest('tr')!;
  await user.click(within(partnerRowNewSelect).getByRole('checkbox'));

  await user.click(createButton);

  const pendingSection = screen.getByText('Pending Mappings').closest('div')!;
  const pendingRow = within(pendingSection)
  .getByText((content, element) => 
    element?.tagName === 'P' && content.includes('9210.201')
  )
  .closest('tr')!;

await user.click(within(pendingRow).getAllByRole('button', { name: /delete mapping/i })[1]);

  const saveButton = screen.getByRole('button', { name: /save mappings/i });
  expect(saveButton).not.toBeDisabled();
  await user.click(saveButton);

   expect(writeProvider.writeGLCodeMapping).toHaveBeenCalledWith([
    
    {
      apc_operator_id: 'op-1',
      apc_partner_id: 'op-1',
      operator_account_number: '9210.202',
      operator_account_description: 'SURFACE LEASE ACQUISITION',
      operator_account_group: '1. DRILLING',
      apc_op_account_id: 2,
      partner_account_number: '5310.203',
      partner_account_description: 'SURVEYING',
      partner_account_group: '1. DRILLING',
      apc_partner_account_id: 100,
    },
  ]);
  });

    
});