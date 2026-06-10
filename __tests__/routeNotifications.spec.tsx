import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import NotificationsGrid from 'src/routes/afeDashboard/routes/notifications';
import { NotificationsGridPreFiltered } from 'src/routes/afeDashboard/routes/notifications';

import { filteredNotificationLoad, filteredNotificationLoadSecondLoad, firstNotificationLoadOvjectChange, secondNotificationLoadObjectChange } from './test-utils/notificationHistoryAFE';

import {
    RachelGreen_AllPermissions_CW_NonOpCW
} from './test-utils/afeRecords';

vi.mock('provider/fetch', () => ({
    fetchAFEHistoryCount: vi.fn(),
    fetchAFENotificationCount: vi.fn(),
    fetchAFENotifications: vi.fn(),
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
        expect(fetchProvider.fetchAFENotifications).toHaveBeenLastCalledWith(0, 3, false, '', 'test-token');
    });
};

const setupWithSelectionsPreFiltered = async (
    user: ReturnType<typeof userEvent.setup>
) => {
    renderWithProviders(<NotificationsGridPreFiltered apc_afe_id='01105c4f-4090-418f-be35-714f4bfaf06b' token='test-token' />, {
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

    await waitFor(() => {
        expect(fetchProvider.fetchAFENotifications).toHaveBeenLastCalledWith(0, 10, true, '01105c4f-4090-418f-be35-714f4bfaf06b', 'test-token');
    });
};

describe('AFE Notifications history', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    });

    test('Loads the srceen for the user', async () => {
        (fetchProvider.fetchAFENotifications as Mock)
            .mockResolvedValueOnce({ ok: true, data: firstNotificationLoadOvjectChange, count: 20 })
            .mockResolvedValueOnce({ ok: true, data: secondNotificationLoadObjectChange, count: 20 });

        renderWithProviders(<NotificationsGrid />, {
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

        expect(screen.getByText('AFE Histories')).toBeInTheDocument();
        expect(screen.getByText('Cumlative history of actions taken on all AFEs.')).toBeInTheDocument();

        await waitFor(() => {
            expect(fetchProvider.fetchAFENotifications).toHaveBeenCalled();
        });

    });

    test('Fetches AFE Notifications for the user and allows them to filter and load more', async () => {
        (fetchProvider.fetchAFENotifications as Mock)
            .mockResolvedValueOnce({ ok: true, data: firstNotificationLoadOvjectChange, count: 20 })
            .mockResolvedValueOnce({ ok: true, data: secondNotificationLoadObjectChange, count: 20 });

        await setupWithSelections(user);

        await waitFor(() => {
            expect(screen.getByText(/Cumlative history of actions taken on all AFEs./i)).toBeInTheDocument();
        });

        await waitFor(() => {
            const statusChange = screen.getAllByText(/The Partner Status on the AFE changed from New to Viewed/i);
            expect(statusChange).toHaveLength(2)
            expect(statusChange[0]).toBeInTheDocument();
            const afeDescChange = screen.getAllByText(/Attachment Well Plat ASPEN 10-26 added to the AFE via integration/i)
            expect(afeDescChange).toHaveLength(2);
            expect(afeDescChange[0]).toBeInTheDocument();
        }, { timeout: 3000 });

        await waitFor(() => {
            expect(screen.getByText(/26D014/i)).toBeInTheDocument();
            expect(screen.getByText(/26D014/i)).toBeVisible();
        }, { timeout: 3000 });

        const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });

        expect(loadMoreButton[0]).not.toBeDisabled();

        const filterOnUser = screen.getByRole('combobox', { name: /filter on user/i });
        expect(filterOnUser).toBeInTheDocument();
        const optionsUser = within(filterOnUser).getAllByRole('option');
        expect(optionsUser).toHaveLength(3);

        expect(within(filterOnUser).getByRole('option', { name: /service role/i })).toBeInTheDocument();

        const filterOnAFENumber = screen.getByRole('textbox', { name: /Search on the AFE Number/i });
        expect(filterOnAFENumber).toHaveValue('');

        const filterOnAFEVer = screen.getByRole('textbox', { name: /Search on the AFE Version/i });
        expect(filterOnAFEVer).toHaveValue('');

        const filterOnAFEDesc = screen.getByRole('textbox', { name: /Search the Description/i });
        expect(filterOnAFEDesc).toHaveValue('');

        await user.type(filterOnAFEDesc, 'BUENAVISTA');
        expect(filterOnAFEDesc).toHaveValue('BUENAVISTA');

        const rows = screen.getAllByRole('row');

        expect(rows.length).toBeGreaterThan(1);

        const dataRows = rows.slice(1);

        expect(dataRows.length).toBe(1);

        await user.clear(filterOnAFEDesc);
        await user.type(filterOnAFENumber, '26D017');

        const rowsSecondFilter = screen.getAllByRole('row');

        expect(rowsSecondFilter.length).toBeGreaterThan(1);

        const dataRowsSecondFilter = rowsSecondFilter.slice(1);

        expect(dataRowsSecondFilter.length).toBe(2);

        await user.clear(filterOnAFENumber);

        await waitFor(() => {
            expect(screen.getByText(/26D014/i)).toBeInTheDocument();
            expect(screen.getByText(/26D014/i)).toBeVisible();
        }, { timeout: 3000 });

        await user.click(loadMoreButton[0]);

        await waitFor(() => {
            expect(fetchProvider.fetchAFENotifications).toHaveBeenCalled();
        }, { timeout: 3000 });

        await waitFor(() => {
            expect(screen.getByText(/26D015/i)).toBeInTheDocument();
            expect(screen.getByText(/26D015/i)).toBeVisible();
        }, { timeout: 3000 });

        await waitFor(() => {
            const rowFilteredLoadMore = screen.getAllByRole('row');

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

            expect(dataRowsFilterLoadMoreOnVer.length).toBe(1);
        });

    });

});

describe('AFE Notifications History PreFiltered', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    });

    test('Loads the AFE history for the user', async () => {

        (fetchProvider.fetchAFENotifications as Mock)
            .mockResolvedValueOnce({ ok: true, data: filteredNotificationLoad, count: 12 })
            .mockResolvedValueOnce({ ok: true, data: filteredNotificationLoadSecondLoad, count: 12 });

        renderWithProviders(<NotificationsGridPreFiltered apc_afe_id='e5676564-f4f2-40ec-b115-52635ec0593b' token='test-token' />, {
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

        expect(screen.getByText('AFE History')).toBeInTheDocument();
        expect(screen.getByText('Complete AFE History including comments, actions attachment views and downloads.')).toBeInTheDocument();

        await waitFor(() => {
            expect(fetchProvider.fetchAFENotifications).toHaveBeenCalled();
        });

    });

    test('Gets prefiltered AFE history', async () => {
        (fetchProvider.fetchAFENotifications as Mock)
            .mockResolvedValueOnce({ ok: true, data: filteredNotificationLoad, count: 12 })
            .mockResolvedValueOnce({ ok: true, data: filteredNotificationLoadSecondLoad, count: 12 });

        await setupWithSelectionsPreFiltered(user);

        await waitFor(() => {
            const statusChange = screen.getAllByText(/The Partner Status on the AFE changed from New to Viewed/i)
            expect(statusChange).toHaveLength(2)
            expect(statusChange[0]).toBeInTheDocument();
            const afeDescChange = screen.getAllByText(/The signed AFE has been uploaded by Queen Elizabeth for John Ross Exploration Inc/i)
            expect(afeDescChange).toHaveLength(2);
            expect(afeDescChange[0]).toBeInTheDocument();
        });

        const loadMoreButton = screen.getAllByRole('button', { name: /load more/i });

        expect(loadMoreButton[0]).not.toBeDisabled();

        const filterOnUser = screen.getByRole('combobox', { name: /filter on user/i });
        expect(filterOnUser).toBeInTheDocument();
        const optionsUser = within(filterOnUser).getAllByRole('option');
        expect(optionsUser).toHaveLength(4);

        expect(within(filterOnUser).getByRole('option', { name: /queen elizabeth/i })).toBeInTheDocument();
        expect(within(filterOnUser).getByRole('option', { name: /rachel green/i })).toBeInTheDocument();

        const filterOnAction = screen.getByRole('combobox', { name: /Filter on the AFE Action/i });
        expect(filterOnAction).toBeInTheDocument();
        const optionsAction = within(filterOnAction).getAllByRole('option');
        expect(optionsAction).toHaveLength(3);

        expect(within(filterOnAction).getByRole('option', { name: /approved/i })).toBeInTheDocument();
        expect(within(filterOnAction).getByRole('option', { name: /action/i })).toBeInTheDocument();


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

        await waitFor(() => {
            expect(filterOnUser).toHaveValue('Rachel Green');
        });

        await waitFor(() => {
            expect(screen.queryByText(/The signed AFE has been uploaded by Queen Elizabeth for John Ross Exploration Inc/i)).not.toBeInTheDocument();
            //expect(screen.getByText(/26D014/i)).toBeVisible();
        }, { timeout: 3000 });



        const rowsSecondFilter = screen.getAllByRole('row');
        // Subtract 1 for the header row
        expect(rowsSecondFilter.length).toBeGreaterThan(1);

        const dataRowsSecondFilter = rowsSecondFilter.slice(1);

        expect(dataRowsSecondFilter.length).toBe(1);

        await user.click(loadMoreButton[0]);
        await waitFor(() => {
            const rowFilteredLoadMore = screen.getAllByRole('row');
            //Subtract 1 for the header row
            expect(rowFilteredLoadMore.length).toBeGreaterThan(1);

            const dataRowsFilterLoadMore = rowFilteredLoadMore.slice(1);

            expect(dataRowsFilterLoadMore.length).toBe(1);
        });

    });
});
