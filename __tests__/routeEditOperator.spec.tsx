import OperatorViewAndEdit from 'src/routes/createEditOperators/routes/manageOperatorAndPartner';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import {
    operatorListReturnFromSupabase,
    operatorDeactivatedFromSupabase,
    operatorDectivatedSentToSupabase,
    operatorActivatedSentToSupabase,
    operatorActivatedFromSupabase,
    operatorListReturnFromSupabaseWithoutIDs,
    operatorListReturnFromSupabaseWithAddressUndefined,
    operatorListReturnFromSupabaseWithAddressUndefinedSuiteIsText,
    operatorListReturnFromSupabaseWithSuiteNumber,
    operatorListReturnFromSupabaseEmpty,
    partnersLinkedOrUnlinked
    
} from './test-utils/operatorRecords';

import { loggedInUserRachelGreen, loggedInUserRachelGreenNoRole2 } from './test-utils/rachelGreenuser'

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
  Flip: {},
  ToastContainer: () => null,
}));

import { toast } from 'react-toastify';

vi.mock('provider/fetch', () => ({
  fetchOperatorsOrPartnersToEdit: vi.fn(),
  fetchPartnersLinkedOrUnlinkedToOperator: vi.fn(),
}));

vi.mock('provider/write', () => ({
  updateOperatorNameAndStatus: vi.fn(),
}));

describe('View and Edit Operators',() => {
  
    afterEach(() => {
        vi.resetAllMocks()
    })

    test('Shows the list of Operators to the user', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('6789 S Blvd Houston, Texas 90078 United States')).toBeInTheDocument();

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Shows No Operators if the loggedInUser is null', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
              supabaseOverrides: {
                loggedInUser: null,
                loading: false,
                isSuperUser: false,
                session: null,
            }
          });
        
    
        await waitFor(() => {
           expect(mockFetch).not.toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        expect(rows.length).toBe(1);

    });

    test('Shows No Operators if the loggedInUser does not have permissions and displays a message telling them', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabaseEmpty
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
              supabaseOverrides: {
                loggedInUser: loggedInUserRachelGreenNoRole2,
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        expect(rows.length).toBe(1);

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Shows an error if the Operator fetch does not work', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: false,
            message: "No Operators or Partners found"
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        expect(rows.length).toBe(1);

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support Error: No Operators or Partners found/i)
        expect(errorMessage).toBeVisible();

    });

    test('Shows the list of Operators to the user with the address having a suite number', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabaseWithSuiteNumber
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('6789 S Blvd #45 Houston, Texas 90078 United States')).toBeInTheDocument();

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Shows the list of Operators to the user with the address mostly undefined', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabaseWithAddressUndefined
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('6789 S Blvd')).toBeInTheDocument();

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Shows the list of Operators to the user with the address mostly undefined but Suite is text', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabaseWithAddressUndefinedSuiteIsText
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('6789 S Blvd')).toBeInTheDocument();

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Expect the Module to Open when the user clicks Edit', async () => {
        const user = userEvent.setup();
        
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
            ok: true,
            data: partnersLinkedOrUnlinked
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
           expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();

        const editButton = within(dataRows[0]).getByRole('button', { name: /edit/i });

        await user.click(editButton);

        expect(screen.getByText('Edit the Operator Billing Address')).toBeInTheDocument();
        expect(screen.getByText('Operator Name')).toBeInTheDocument();
        expect(screen.getByText('Edit the Operator Addresses for Non-Op AFEs')).toBeInTheDocument();

        const dialog = await screen.findByRole('dialog', { name: /edit the operator billing address/i });
        const allTextboxes = within(dialog).getAllByRole('textbox');

        const nameInputsWithoutLabels = allTextboxes.filter((input, index) => {
        // The ones without labels start after the first 6 (which have labels)
        return index >= 6;
    });

    await waitFor(() => {
        expect(nameInputsWithoutLabels[0]).toHaveValue('Corr and White Oil Company');
    });

    const partnerNameInput = await screen.findByDisplayValue('Corr and White Oil Company');
    expect(partnerNameInput).toBeInTheDocument();

    await waitFor(() => {
        expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const partnerList = screen.getByRole('list');
    expect(partnerList).toBeInTheDocument();
    expect(partnerList).not.toHaveAttribute('hidden');
    
    // Check list items
    const listItems = within(partnerList).getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
    
    // Check first partner details
    expect(screen.getByText(/Whit and Corr Oils Company/i)).toBeInTheDocument();
    expect(screen.getByText(/1875 Lawrence St Denver, CO 80202/i)).toBeInTheDocument();

        
    });

    test('Expect the Operator to claim the address when the box is checked and saved', async () => {
        const user = userEvent.setup();
        
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
        mockPartnersFetch.mockResolvedValue({
            ok: true,
            data: partnersLinkedOrUnlinked
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
           expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();

        const editButton = within(dataRows[0]).getByRole('button', { name: /edit/i });

        await user.click(editButton);

        expect(screen.getByText('Edit the Operator Billing Address')).toBeInTheDocument();
        expect(screen.getByText('Operator Name')).toBeInTheDocument();
        expect(screen.getByText('Edit the Operator Addresses for Non-Op AFEs')).toBeInTheDocument();

        const dialog = await screen.findByRole('dialog', { name: /edit the operator billing address/i });
        const allTextboxes = within(dialog).getAllByRole('textbox');

        const nameInputsWithoutLabels = allTextboxes.filter((input, index) => {
        // The ones without labels start after the first 6 (which have labels)
        return index >= 6;
    });

    await waitFor(() => {
        expect(nameInputsWithoutLabels[0]).toHaveValue('Corr and White Oil Company');
    });

    const partnerNameInput = await screen.findByDisplayValue('Corr and White Oil Company');
    expect(partnerNameInput).toBeInTheDocument();

    await waitFor(() => {
        expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const partnerList = screen.getByRole('list');
    expect(partnerList).toBeInTheDocument();
    expect(partnerList).not.toHaveAttribute('hidden');
    
    // Check list items
    const listItems = within(partnerList).getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
    
    // Check first partner details
    expect(screen.getByText(/Whit and Corr Oils Company/i)).toBeInTheDocument();
    expect(screen.getByText(/1875 Lawrence St Denver, CO 80202/i)).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    expect(saveButtons[2]).toBeDisabled();
    

    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    });
    expect(checkboxes[1]).not.toBeChecked();
    expect(saveButtons[2]).not.toBeDisabled();
        
    });

    test('deactivates an active operator when clicking deactivate button then reacivates it when the button is pushed again', async () => {
        const user = userEvent.setup();
        
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);

        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });

       vi.mocked(writeProvider.updateOperatorNameAndStatus).mockResolvedValueOnce({
            ok: true,
            data: operatorDeactivatedFromSupabase
        });

        vi.mocked(writeProvider.updateOperatorNameAndStatus).mockResolvedValueOnce({
            ok: true,
            data: operatorActivatedFromSupabase
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
          expect(mockFetch).toHaveBeenCalled();
          const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });
        
        const rows = screen.getAllByRole('row');
        const dataRows = rows.slice(1);
        
        // Click the activate/deactivate button
        const toggleButton = within(dataRows[0]).getAllByRole('button', { name: /activate|deactivate/i });
        await user.click(toggleButton[1]);
        
        // Verify the call was made with new values and the Operator was deactivated
        await waitFor(() => {
            expect(writeProvider.updateOperatorNameAndStatus).toHaveBeenCalledWith(
                operatorDectivatedSentToSupabase,
                "test-token"
            );
        });
        
      await waitFor(() => {
    expect(toast).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        data: expect.stringContaining("deactivated")
      })
    );
  });
        // verify UI updated to show they are inactive.  The click the button again.
        expect(within(dataRows[0]).getByText(/inactive/i)).toBeInTheDocument();


        await user.click(toggleButton[0]);

        // Verify the call was made with new values
        await waitFor(() => {
            expect(writeProvider.updateOperatorNameAndStatus).toHaveBeenCalledWith(
                operatorActivatedSentToSupabase,
                "test-token"
            );
        });

        await waitFor(() => {
    expect(toast).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        data: expect.stringContaining("activated")
      })
    );
  });

        
        // verify UI updated to show it is now Active
        expect(within(dataRows[0]).getByText('Active')).toBeInTheDocument();
    });

    test('Shows the list of Operators to the user but with buttons disabled when IDs are missing', async () => {
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabaseWithoutIDs
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
          expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        const activateOrDeactivateButton = within(dataRows[0]).getAllByRole('button', { name: /activate|deactivate/i });
        const editButton = within(dataRows[0]).getAllByRole('button', { name: /edit/i });

        expect(activateOrDeactivateButton[0]).toBeDisabled();
        expect(activateOrDeactivateButton[1]).toBeDisabled();
        expect(editButton[0]).toBeDisabled();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('6789 S Blvd Houston, Texas 90078 United States')).toBeInTheDocument();

        const noOpsToView = screen.getByText('There are no Operators you have access to manage');
        expect(noOpsToView).not.toBeVisible();
        const errorMessage = screen.getByText(/Unable to get Operators\.?\s+Please contact AFE Partners Support/i)
        expect(errorMessage).not.toBeVisible();

    });

    test('Expect the Module to Open when the user clicks Edit and update the Operator Name and Street', async () => {
        const user = userEvent.setup();
        
        const mockFetch = vi.mocked(fetchProvider.fetchOperatorsOrPartnersToEdit);
        
        mockFetch.mockResolvedValue({
            ok: true,
            data: operatorListReturnFromSupabase
        });
        
        renderWithProviders(<OperatorViewAndEdit />, {
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
           expect(mockFetch).toHaveBeenCalled();
           const rows = screen.getAllByRole('row');
           expect(rows.length).toBeGreaterThan(1);
        });

        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const dataRows = rows.slice(1);

        expect(within(dataRows[0]).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(dataRows[0]).getByText('Corr and Whit Oils Company')).toBeInTheDocument();

        const editButton = within(dataRows[0]).getByRole('button', { name: /edit/i });

        await user.click(editButton);

        expect(screen.getByText('Edit the Operator Billing Address')).toBeInTheDocument();
        expect(screen.getByText('Operator Name')).toBeInTheDocument();
        expect(screen.getByText('Edit the Operator Addresses for Non-Op AFEs')).toBeInTheDocument();

        const dialog = await screen.findByRole('dialog', { name: /edit the operator billing address/i });
        const allTextboxes = within(dialog).getAllByRole('textbox');

        const nameInputsWithoutLabels = allTextboxes.filter((input, index) => {
        // The ones without labels start after the first 6 (which have labels)
        return index >= 6;
    });

    await waitFor(() => {
        expect(nameInputsWithoutLabels[0]).toHaveValue('Corr and White Oil Company');
        expect(nameInputsWithoutLabels[1]).toHaveValue('2121 Lane Blvc');
    });

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    const operatorSave = saveButtons[0];
    const partnerSave = saveButtons[1];
    expect (operatorSave).toBeDisabled();
    expect (partnerSave).toBeDisabled();

    const operatorNameInput = await screen.findByDisplayValue('Corr and Whit Oils Company');
    const operatorAddressInput = await screen.findByDisplayValue('6789 S Blvd');
    expect(operatorNameInput).toBeInTheDocument();
    expect(operatorAddressInput).toBeInTheDocument();

    await user.clear(operatorNameInput);
    await user.type(operatorNameInput, 'Corr Mike Oils');
    expect(operatorNameInput).toHaveValue('Corr Mike Oils');
    expect (operatorSave).not.toBeDisabled();

    await user.clear(operatorAddressInput);
    await user.type(operatorAddressInput, '678999 S Blvd');
    expect(operatorAddressInput).toHaveValue('678999 S Blvd');

    const partnerNameInput = await screen.findByDisplayValue('Corr and White Oil Company');
    const partnerAddressInput = await screen.findByDisplayValue('2121 Lane Blvc');
    expect(partnerNameInput).toBeInTheDocument();
    expect(partnerAddressInput).toBeInTheDocument();

    await user.clear(partnerNameInput);
    await user.type(partnerNameInput, 'Corr Oils');
    expect(partnerNameInput).toHaveValue('Corr Oils');
    expect (partnerSave).not.toBeDisabled();

    await user.clear(partnerAddressInput);
    await user.type(partnerAddressInput, '2123 Lane Blvc');
    expect(partnerAddressInput).toHaveValue('2123 Lane Blvc');
        
    });
});