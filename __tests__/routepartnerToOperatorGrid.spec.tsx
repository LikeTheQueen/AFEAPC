import CreateOperator from 'src/routes/createEditOperators/routes/createOperator';
import PartnerToOperatorGrid from 'src/routes/partnerToOperatorGrid';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { 
  partnersLinkedOrUnlinked, 
  partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed,
  partnersLinkedOrUnlinkedNoUnclaimed,
  partnersLinkedOrUnlinkedOneClaimedFourUnclaimedTwoWithNullNames,
  partnersLinkedOrUnlinkedOneClaimedFourUnclaimedOneWithNullNames,
  partnersLinkedOrUnlinkedOneClaimedFourUnclaimedOneWithNullName,
  claimProofResult,
  claimProofResultNoID
} from './test-utils/operatorRecords';

import { 
    loggedInUserSuperUser
 } from './test-utils/superUserAndSourceList';

 vi.mock('../provider/fetch', () => ({
  fetchPartnersLinkedOrUnlinkedToOperator: vi.fn(),
  fetchClaimProofPrompt: vi.fn(),
  verifyClaimProof: vi.fn(),
}));

vi.mock('../provider/write', () => ({
  updatePartnerWithOpID: vi.fn(),
  
}));

describe('Link Partner Addresses to Operator',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
        expect(vi.mocked(fetchProvider.verifyClaimProof).mock.calls).toHaveLength(0);
    })

test('Displays a message that there are no unclaimed addresses when the return has zero unclaimed addresses', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedNoUnclaimed
        });
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={null} token='test-token'/>, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).toBeVisible();
    const fetchErrorMessage = screen.getByText(/Error retrieving unclaimed addresses: /i);
    expect(fetchErrorMessage).not.toBeVisible();
});

test('Displays a list of unclaimed partner addresses', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={null} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeEnabled();
});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim (but not saved yet).  Save diabled without an OpID', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={null} token='test-token'/>, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeEnabled();
});
//BELOW GETS CLAIM PROMPT
test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();
});
//OME BACK TO THIS TEST
test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and an error that there is not an AFE record to test against', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: false, data: null, message: 'No Records to Verify'});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();
});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and an error that the claim proof id was not returned', async () => {
  const user = userEvent.setup();  
  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResultNoID, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntries = screen.getByText(/Error:/i);
    expect(validEntries).toHaveAttribute('hidden');

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).not.toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).not.toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        null, 
        'test-token')
    });

    expect(validEntries).not.toHaveAttribute('hidden');

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters non UUID', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '678999');
    await user.type(allTextboxes[1], '678999');
    expect(validEntryWarningsAFE).not.toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('6789**');
    expect(allTextboxes[1]).toHaveValue('678999');

    expect(submitButtons).toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('6789**');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Verification Required/i })).toBeInTheDocument();
    });

    expect(validEntryWarningsPartner).not.toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).not.toHaveAttribute('hidden');

    expect(submitButtons).toBeDisabled();

    await user.click(cancelButtons);
    await waitFor(() => {
    expect(screen.queryByRole('dialog', { name: /Verification Required/i })).not.toBeInTheDocument();
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
      
    });
    const newVerificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    const newValidEntryWarningsPartner = within(newVerificationDialog).getByText('Not a valid Partner Document ID');
    const newValidEntryWarningsAFE = within(newVerificationDialog).getByText('Not a valid AFE Document ID');

    expect(newValidEntryWarningsPartner).toHaveAttribute('hidden');
    expect(newValidEntryWarningsAFE).toHaveAttribute('hidden');

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters correct info', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
    vi.mocked(fetchProvider.verifyClaimProof).mockResolvedValue({ok: true, data: true});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).not.toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        3, 
        'test-token')
    });

    await waitFor(() => {
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        }
      ]);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Verification Required/i })).not.toBeInTheDocument();
    });

    

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters non UUID for AFE and UUID for Partner', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).not.toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('xxxx********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).not.toHaveBeenCalledWith(
        '678999', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        3, 
        'test-token')
    });

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters UUID for AFE and non UUID for Partner', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[1], '678999');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsPartner).not.toHaveAttribute('hidden');    

    expect(allTextboxes[1]).toHaveValue('6789**');
    expect(allTextboxes[0]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).not.toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '678999', 
        null, 
        'test-token')
    });

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters incorrect info VERIFIED', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
    vi.mocked(fetchProvider.verifyClaimProof).mockResolvedValue({ok: true, data: true});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntries = screen.getByText(/Error:/i);
    expect(validEntries).toHaveAttribute('hidden');

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).not.toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        3, 
        'test-token')
    });

    expect(validEntries).toHaveAttribute('hidden');

    await waitFor(() => {
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        }
      ]);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Verification Required/i })).not.toBeInTheDocument();
    });

});

test('Displays a list of unclaimed partner addresses and the user clicks an address to claim and is presented with a verification prompt and enters incorrect info NO VERIFICATION', async () => {
  const user = userEvent.setup();

  const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
    vi.mocked(fetchProvider.verifyClaimProof).mockResolvedValue({ok: false, message: 'Verification Failed'});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(currentOpID);
    });
  
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntries = screen.getByText(/Error:/i);
    expect(validEntries).toHaveAttribute('hidden');

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).not.toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');

    await waitFor(() => {
  expect(vi.mocked(fetchProvider.verifyClaimProof)).toHaveBeenCalled();
});
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        3, 
        'test-token')
    });

    expect(validEntries).not.toHaveAttribute('hidden');

    await waitFor(() => {
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).not.toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        }
      ]);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Verification Required/i })).toBeInTheDocument();
    });

});

test('Displays a list of unclaimed partner addresses and the user clicks an TWO addresses to claim and save with opID', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token'/>, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(
        currentOpID
      ); {/* 
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        },
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4e47b',
          apc_op_id: currentOpID
        }
      ]);
      */}
    });
    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();
});

test('Displays a list of unclaimed partner addresses and the user clicks an TWO addresses then unchecks first address to claim and save second with opID', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedTwoUnclaimed
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
    vi.mocked(fetchProvider.verifyClaimProof).mockResolvedValue({ok: true, data: true});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(2);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(
        currentOpID
      ); {/* 
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4e47b',
          apc_op_id: currentOpID
        }
      ]);*/}
    });
});

test('Displays a list of unclaimed partner addresses and the user clicks an TWO addresses to claim and save with opID', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedFourUnclaimedTwoWithNullNames
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(4);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(
        currentOpID
      ); {/* 
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4e488',
          apc_op_id: currentOpID
        },
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af46599',
          apc_op_id: currentOpID
        }
      ]);*/}
    });
});

test('Displays a list of unclaimed partner addresses and the user clicks an TWO addresses to claim and save with opID', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedFourUnclaimedOneWithNullNames
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
        const currentOpID = '1234567';
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(4);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(
        currentOpID
      ); {/* 
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af46599',
          apc_op_id: currentOpID
        },
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        }
      ]);*/}
    });
});

test('Displays a list of unclaimed partner addresses and the user clicks an TWO addresses to claim and save with opID', async () => {
  const user = userEvent.setup();
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: true,
          data: partnersLinkedOrUnlinkedOneClaimedFourUnclaimedOneWithNullName
        });

    vi.mocked(writeProvider.updatePartnerWithOpID).mockResolvedValue({ok: true});
        const currentOpID = '1234567';
    vi.mocked(fetchProvider.fetchClaimProofPrompt).mockResolvedValue({ok: true, data: claimProofResult, message: undefined});
    vi.mocked(fetchProvider.verifyClaimProof).mockResolvedValue({ok: true, data: true});
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={currentOpID} token='test-token' />, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).not.toBeVisible();
    
    const unlinkedPartnerList = screen.getAllByRole("listitem");
    expect(unlinkedPartnerList).toHaveLength(4);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(vi.mocked(fetchProvider.fetchClaimProofPrompt)).toHaveBeenCalledWith(
        currentOpID
      ); 
    });

    const verificationDialog = await screen.findByRole('dialog', { name: /Verification Required/i });
    expect(verificationDialog).toBeInTheDocument();

    const submitButtons = screen.getByRole('button', { name: /submit/i });
    const cancelButtons = screen.getByRole('button', { name: /cancel/i });

    const validEntries = screen.getByText(/Error:/i);
    expect(validEntries).toHaveAttribute('hidden');

    const validEntryWarningsAFE = screen.getByText('Not a valid AFE Document ID');
    const validEntryWarningsPartner = screen.getByText('Not a valid Partner Document ID');
    expect(validEntryWarningsPartner).toHaveAttribute('hidden');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');

    expect(submitButtons).toBeInTheDocument();
    expect(submitButtons).toBeDisabled();

    expect(cancelButtons).toBeInTheDocument();
    expect(cancelButtons).not.toBeDisabled();

    const allTextboxes = within(verificationDialog).getAllByPlaceholderText('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await user.type(allTextboxes[0], '13e69340-d14c-45a9-96a8-142795925487');
    await user.type(allTextboxes[1], '13e69340-d14c-45a9-96a8-142795925487');
    expect(validEntryWarningsAFE).toHaveAttribute('hidden');    

    expect(allTextboxes[0]).toHaveValue('13e6********************************');
    expect(allTextboxes[1]).toHaveValue('13e69340-d14c-45a9-96a8-142795925487');

    expect(submitButtons).not.toBeDisabled();

    await user.click(submitButtons);

    expect(allTextboxes[1]).toHaveValue('13e6********************************');
    await waitFor(() => {
      expect(vi.mocked(fetchProvider.verifyClaimProof)).toHaveBeenCalledWith(
        '13e69340-d14c-45a9-96a8-142795925487', 
        '13e69340-d14c-45a9-96a8-142795925487', 
        3, 
        'test-token')
    });

    expect(validEntries).toHaveAttribute('hidden');

    await waitFor(() => {
      expect(vi.mocked(writeProvider.updatePartnerWithOpID)).toHaveBeenCalledWith([
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4e488',
          apc_op_id: currentOpID
        },
        {
          id: 'ecb2c585-9225-4957-98ce-d4315af4654e',
          apc_op_id: currentOpID
        }
      ]);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Verification Required/i })).not.toBeInTheDocument();
    });
});
//ERROR GET UNCLAIMED PARTNERS
test('Displays a message that there are no unclaimed addresses when there is an error with the return', async () => {
    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
          ok: false,
          data: [],
          message: 'Row Level Security'
        });
    
    renderWithProviders(<PartnerToOperatorGrid currentOpID={null} token='test-token'/>, {
          supabaseOverrides: {
            loggedInUser: loggedInUserSuperUser,
            loading: false,
            isSuperUser: true,
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
    
    await waitFor(() => {
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const noUnclaimedAddresses = screen.getByText(/There are no unclaimed addresses to show/i);
    expect(noUnclaimedAddresses).toBeVisible();
    const fetchErrorMessage = screen.getByText(/Error retrieving unclaimed addresses: /i);
    expect(fetchErrorMessage).toBeVisible();
});

});