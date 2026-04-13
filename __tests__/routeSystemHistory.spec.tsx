import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import SystemHistories from 'src/routes/support/routes/systemHistory';

import { RachelGreen_AllPermissions_CW_NonOpCW, loggedInUserIsSuperUser, userNoUserId
 } from './test-utils/afeRecords';

import { systemHistory, systemHistoryLoadMore } from './test-utils/supportHistory';

vi.mock('provider/fetch', () => ({
    fetchSystemHistory: vi.fn(),
    fetchSystemHistoryCount: vi.fn(),
}));

vi.mock('provider/write', () => ({
    createSupportTicket: vi.fn(),
    createSupportTicketThread: vi.fn(),
    updateSupportTicket: vi.fn(),
}));

const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SystemHistories />, {
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
};

const setupWithSelectionsSuperUser = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SystemHistories />, {
    supabaseOverrides: {
      loggedInUser: loggedInUserIsSuperUser,
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
};

const setupWithSelectionsNoUserID = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SystemHistories />, {
    supabaseOverrides: {
      loggedInUser: userNoUserId,
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
};

describe('View System History',() => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
    user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    });

    test('Loads screen and allows user to load more', async () => {
        
        (fetchProvider.fetchSystemHistory as Mock)
                  .mockResolvedValueOnce(systemHistory)
                  .mockResolvedValueOnce(systemHistoryLoadMore);
        (fetchProvider.fetchSystemHistoryCount as Mock)
                  .mockResolvedValue(50);
        
                await setupWithSelections(user);
                expect(fetchProvider.fetchSystemHistory).toHaveBeenCalledWith(0,23);
                expect(fetchProvider.fetchSystemHistoryCount).toHaveBeenCalled();

        expect(screen.getByText('System Changes')).toBeInTheDocument();
        expect(screen.getByText(/Who's doing what and when are they're doing it./)).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getAllByText(/GL Code Mapping created by Queen Elizabeth for Navigator Corporation account number 9210.208 mapped to Corr and Whit Oil Partner account number 9210.208. Updated 0 rows on the AFE Estimates./i)[0]).toBeInTheDocument();
          expect(screen.getAllByText(/GL Code Mapping created by Queen Elizabeth for Navigator Corporation account number 9210.201 mapped to Corr and Whit Oil Partner account number 9210.202. Updated 0 rows on the AFE Estimates./i)[0]).toBeInTheDocument();
          expect(screen.getAllByText(/Apr 6, 2026/i)[0]).toBeInTheDocument();
          expect(screen.getByText(/Showing 1 to 5 of 24 changes/i)).toBeInTheDocument();
        });

        const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });
        
        expect(loadMoreButton[0]).not.toBeDisabled();
        
        await user.click(loadMoreButton[0]);

        expect(fetchProvider.fetchSystemHistory).toHaveBeenCalledWith(0,47);
        await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 5 of 48 changes/i)).toBeInTheDocument();
        });
    });

    test('Loads screen and allows user to load more and then filter', async () => {

        (fetchProvider.fetchSystemHistory as Mock)
            .mockResolvedValueOnce(systemHistory)
            .mockResolvedValueOnce(systemHistoryLoadMore);
        (fetchProvider.fetchSystemHistoryCount as Mock)
            .mockResolvedValue(50);

        await setupWithSelections(user);
        expect(fetchProvider.fetchSystemHistory).toHaveBeenCalledWith(0, 23);
        expect(fetchProvider.fetchSystemHistoryCount).toHaveBeenCalled();

        expect(screen.getByText('System Changes')).toBeInTheDocument();
        expect(screen.getByText(/Who's doing what and when are they're doing it./)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getAllByText(/GL Code Mapping created by Queen Elizabeth for Navigator Corporation account number 9210.208 mapped to Corr and Whit Oil Partner account number 9210.208. Updated 0 rows on the AFE Estimates./i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/GL Code Mapping created by Queen Elizabeth for Navigator Corporation account number 9210.201 mapped to Corr and Whit Oil Partner account number 9210.202. Updated 0 rows on the AFE Estimates./i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Apr 6, 2026/i)[0]).toBeInTheDocument();
            expect(screen.getByText(/Showing 1 to 5 of 24 changes/i)).toBeInTheDocument();
        });

        const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });

        expect(loadMoreButton[0]).not.toBeDisabled();

        const filterOnUser = screen.getByRole('combobox', { name: /filter on user/i });
        expect(filterOnUser).toBeInTheDocument();
        const optionsUser = within(filterOnUser).getAllByRole('option');
        expect(optionsUser).toHaveLength(2);

        expect(within(filterOnUser).getByRole('option', { name: /queen elizabeth/i })).toBeInTheDocument();

        const filterOnActionTyep = screen.getByRole('combobox', { name: /filter on action type/i });
        expect(filterOnActionTyep).toBeInTheDocument();
        const optionsAction = within(filterOnActionTyep).getAllByRole('option');
        expect(optionsAction).toHaveLength(4);
        expect(within(filterOnActionTyep).getByRole('option', { name: /gl mapping updated/i })).toBeInTheDocument();
        expect(within(filterOnActionTyep).getByRole('option', { name: /gl mapping created/i })).toBeInTheDocument();
        expect(within(filterOnActionTyep).getByRole('option', { name: /gl code created/i })).toBeInTheDocument();

        await user.click(loadMoreButton[0]);

        expect(fetchProvider.fetchSystemHistory).toHaveBeenCalledWith(0, 47);
        await waitFor(() => {
            expect(screen.getByText(/Showing 1 to 5 of 48 changes/i)).toBeInTheDocument();
        });

        const optionsActionAfter = within(filterOnActionTyep).getAllByRole('option');
        expect(optionsActionAfter).toHaveLength(7);
        const optionsUserAfter = within(filterOnUser).getAllByRole('option');
        expect(optionsUserAfter).toHaveLength(3);

        expect(within(filterOnUser).getByRole('option', { name: /rachel green/i })).toBeInTheDocument();
        expect(within(filterOnActionTyep).getByRole('option', { name: /secret added/i })).toBeInTheDocument();
        //expect(within(filterOnActionTyep).getByRole('option', { name: /create/i })).toBeInTheDocument();
        expect(within(filterOnActionTyep).getByRole('option', { name: /permission added/i })).toBeInTheDocument();

        await user.selectOptions(filterOnUser, 'Rachel Green');
        expect(filterOnUser).toHaveValue('Rachel Green');

        const rows = screen.getAllByRole('row');
        // Subtract 1 for the header row
        expect(rows.length).toBeGreaterThan(1);

        const dataRows = rows.slice(1);

        expect(dataRows.length).toBe(2);
        
        dataRows.forEach(row => {
            expect(within(row).getByText(/This is a filtered row/i)).toBeInTheDocument();
        });

        await user.selectOptions(filterOnUser, '');
        expect(filterOnUser).toHaveValue('');

        await user.selectOptions(filterOnActionTyep,'Permission Added');
        expect(filterOnActionTyep).toHaveValue('Permission Added');

        const rowsChange1 = screen.getAllByRole('row');
        // Subtract 1 for the header row
        expect(rowsChange1.length).toBeGreaterThan(1);

        const dataRowsChange1 = rowsChange1.slice(1);

        expect(dataRowsChange1.length).toBe(4);

        dataRowsChange1.forEach(row => {
            expect(within(row).getByText(/This is a filtered row/i)).toBeInTheDocument();
        });

        await user.selectOptions(filterOnActionTyep,'Permission Added');
        expect(filterOnActionTyep).toHaveValue('Permission Added');

        const descriptionSearch = screen.getByRole('textbox', { name: /search the description/i });

        expect(descriptionSearch).toBeInTheDocument();

        await user.type(descriptionSearch, 'This is a fil');
        expect(descriptionSearch).toHaveValue('This is a fil');

        const rowsChange2 = screen.getAllByRole('row');
        // Subtract 1 for the header row
        expect(rowsChange2.length).toBeGreaterThan(1);

        const dataRowsChange2 = rowsChange1.slice(1);

        expect(dataRowsChange2.length).toBe(4);

        dataRowsChange2.forEach(row => {
            expect(within(row).getByText(/This is a filtered row/i)).toBeInTheDocument();
        });

    });
});