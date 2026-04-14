import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import NotificationsGrid from 'src/routes/afeDashboard/routes/notifications';
import { NotificationsGridPreFiltered } from 'src/routes/afeDashboard/routes/notifications';

import { firstNotifcationLoad, secodNotificationLoad, filteredNotificationLoad, filteredNotificationLoadSecondLoad } from './test-utils/notificationHistoryAFE';

import { RachelGreen_AllPermissions_CW_NonOpCW
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   fetchAFEHistoryCount: vi.fn(),
   fetchAFENotificationCount: vi.fn(),
   fetchNotifications: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     updateGLCodeMapping: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<NotificationsGrid />, {
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

   await waitFor(() => {
         expect(fetchProvider.fetchNotifications).toHaveBeenLastCalledWith(0, 3, false);
         expect(fetchProvider.fetchAFENotificationCount).toHaveBeenCalled();
        });
 };

 const setupWithSelectionsPreFiltered = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<NotificationsGridPreFiltered apc_afe_id='e5676564-f4f2-40ec-b115-52635ec0593b'/>, {
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

   await waitFor(() => {
         expect(fetchProvider.fetchNotifications).toHaveBeenLastCalledWith(0, 10, true, 'e5676564-f4f2-40ec-b115-52635ec0593b');
         expect(fetchProvider.fetchAFEHistoryCount).toHaveBeenCalled();
        });
 };

 describe('AFE Notifications history',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Loads the srceen for the user', async () => {
 
         renderWithProviders(<NotificationsGrid />, {
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
 
         expect(screen.getByText('AFE Histories')).toBeInTheDocument();
         expect(screen.getByText('Cumlative history of actions taken on all AFEs.')).toBeInTheDocument();

         await waitFor(() => {
        expect(fetchProvider.fetchNotifications).toHaveBeenCalled();
    });
 
     });

     test('Fetches AFE Notifications for the user and allows them to filter and load more', async () => {
         (fetchProvider.fetchNotifications as Mock)
             .mockResolvedValueOnce(firstNotifcationLoad)
             .mockResolvedValueOnce(secodNotificationLoad);
         (fetchProvider.fetchAFENotificationCount as Mock)
             .mockResolvedValue(20);
         await setupWithSelections(user);

        

         await waitFor(() => {
             const statusChange = screen.getAllByText(/The Partner Status on the AFE changed from New to Viewed/i)
             expect(statusChange).toHaveLength(6)
             expect(statusChange[0]).toBeInTheDocument();
             const afeDescChange = screen.getAllByText(/The Operator Un-Archived the AFE/i)
             expect(afeDescChange).toHaveLength(2);
             expect(afeDescChange[0]).toBeInTheDocument();
         });

         const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });

         expect(loadMoreButton[0]).not.toBeDisabled();

         const filterOnUser = screen.getByRole('combobox', { name: /filter on user/i });
         expect(filterOnUser).toBeInTheDocument();
         const optionsUser = within(filterOnUser).getAllByRole('option');
         expect(optionsUser).toHaveLength(2);

         expect(within(filterOnUser).getByRole('option', { name: /queen elizabeth/i })).toBeInTheDocument();

         const filterOnAFENumber = screen.getByRole('textbox', { name: /Search on the AFE Number/i });
         expect(filterOnAFENumber).toHaveValue('');

         const filterOnAFEVer = screen.getByRole('textbox', { name: /Search on the AFE Version/i });
         expect(filterOnAFEVer).toHaveValue('');

         const filterOnAFEDesc = screen.getByRole('textbox', { name: /Search the Description/i });
         expect(filterOnAFEDesc).toHaveValue('');
         
         await user.type(filterOnAFEDesc, 'The Oper');
         expect(filterOnAFEDesc).toHaveValue('The Oper');

         const rows = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rows.length).toBeGreaterThan(1);

         const dataRows = rows.slice(1);

         expect(dataRows.length).toBe(1);

         await user.clear(filterOnAFEDesc);
         await user.type(filterOnAFENumber, '25D001');

         const rowsSecondFilter = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rowsSecondFilter.length).toBeGreaterThan(1);

         const dataRowsSecondFilter = rowsSecondFilter.slice(1);

         expect(dataRowsSecondFilter.length).toBe(1);

         await user.click(loadMoreButton[0]);
         await waitFor(() => {
         const rowFilteredLoadMore = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rowFilteredLoadMore.length).toBeGreaterThan(1);

         const dataRowsFilterLoadMore = rowFilteredLoadMore.slice(1);
         
         expect(dataRowsFilterLoadMore.length).toBe(6);
         });

         await user.clear(filterOnAFENumber);
         await user.type(filterOnAFEVer, 'S3');

         await waitFor(() => {
         const rowFilteredLoadMoreOnVer = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rowFilteredLoadMoreOnVer.length).toBeGreaterThan(1);

         const dataRowsFilterLoadMoreOnVer = rowFilteredLoadMoreOnVer.slice(1);
         
         expect(dataRowsFilterLoadMoreOnVer.length).toBe(2);
         });





     });
    });
describe('AFE Notifications History PreFiltered',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Loads the srceen for the user', async () => {
 
         renderWithProviders(<NotificationsGridPreFiltered apc_afe_id='e5676564-f4f2-40ec-b115-52635ec0593b' />, {
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
 
         expect(screen.getByText('AFE History')).toBeInTheDocument();
         expect(screen.getByText('Complete AFE History including comments, actions attachment views and downloads.')).toBeInTheDocument();

         await waitFor(() => {
        expect(fetchProvider.fetchNotifications).toHaveBeenCalled();
    });
 
     });

     test('Fetches the mapped account codes when a user selects the dropdowns and let user delete one', async () => {
         (fetchProvider.fetchNotifications as Mock)
             .mockResolvedValueOnce(filteredNotificationLoad)
             .mockResolvedValueOnce(filteredNotificationLoadSecondLoad);
         (fetchProvider.fetchAFENotificationCount as Mock)
             .mockResolvedValue(12);
         await setupWithSelectionsPreFiltered(user);

        

         await waitFor(() => {
             const statusChange = screen.getAllByText(/The Partner Status on the AFE changed from New to Viewed/i)
             expect(statusChange).toHaveLength(2)
             expect(statusChange[0]).toBeInTheDocument();
             const afeDescChange = screen.getAllByText(/The signed AFE has been uploaded by Queen Elizabeth for John Ross Exploration Inc/i)
             expect(afeDescChange).toHaveLength(8);
             expect(afeDescChange[0]).toBeInTheDocument();
         });

         const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });

         expect(loadMoreButton[0]).not.toBeDisabled();

         const filterOnUser = screen.getByRole('combobox', { name: /filter on user/i });
         expect(filterOnUser).toBeInTheDocument();
         const optionsUser = within(filterOnUser).getAllByRole('option');
         expect(optionsUser).toHaveLength(3);

         expect(within(filterOnUser).getByRole('option', { name: /queen elizabeth/i })).toBeInTheDocument();
         expect(within(filterOnUser).getByRole('option', { name: /rachel green/i })).toBeInTheDocument();

         const filterOnAction = screen.getByRole('combobox', { name: /Filter on the AFE Action/i });
         expect(filterOnAction).toBeInTheDocument();
         const optionsAction = within(filterOnAction).getAllByRole('option');
         expect(optionsAction).toHaveLength(4);

         expect(within(filterOnAction).getByRole('option', { name: /approved/i })).toBeInTheDocument();
         expect(within(filterOnAction).getByRole('option', { name: /viewed/i })).toBeInTheDocument();

         
         const filterOnAFEDesc = screen.getByRole('textbox', { name: /Search the Description/i });
         expect(filterOnAFEDesc).toHaveValue('');
         
         await user.type(filterOnAFEDesc, 'approved');
         expect(filterOnAFEDesc).toHaveValue('approved');

         const rows = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rows.length).toBeGreaterThan(1);

         const dataRows = rows.slice(1);

         expect(dataRows.length).toBe(1);

         await user.clear(filterOnAFEDesc);
         await user.selectOptions(filterOnUser, 'Rachel Green');

         expect(filterOnUser).toHaveValue('Rachel Green');

         const rowsSecondFilter = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rowsSecondFilter.length).toBeGreaterThan(1);

         const dataRowsSecondFilter = rowsSecondFilter.slice(1);

         expect(dataRowsSecondFilter.length).toBe(1);

         await user.click(loadMoreButton[0]);
         await waitFor(() => {
         const rowFilteredLoadMore = screen.getAllByRole('row');
         // Subtract 1 for the header row
         expect(rowFilteredLoadMore.length).toBeGreaterThan(1);

         const dataRowsFilterLoadMore = rowFilteredLoadMore.slice(1);
         
         expect(dataRowsFilterLoadMore.length).toBe(1);
         });

     });
    });

