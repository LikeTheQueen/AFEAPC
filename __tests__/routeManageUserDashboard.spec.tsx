import UserPermissionDashboard from 'src/routes/createEditUsers/routes/manageUserPermissions';
import SuperUserDash from 'src/routes/createEditUsers/routes/manageUserPermissionsSystem';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure, doesUserHaveRole } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { Love_Quinn_Super_User, RachelGreen_AllPermissions_CW_NonOpCW, RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser } from './test-utils/afeRecords';

import { userNoUserId } from './test-utils/afeRecords';

import { limitedPermissionList, userListActiveOrInactive, updatedPermissions, updatedNonPermissions } from './test-utils/rachelGreenuser';
import UserStatusDashboard from 'src/routes/createEditUsers/routes/manageUserDashboard';
import SuperUserStatusDashboard from 'src/routes/createEditUsers/routes/manageUsersSystem';

vi.mock('provider/fetch', () => ({
  fetchUsersForOperator: vi.fn(),
  fetchListOfOperatorsOrPartnersForUser: vi.fn(),
  fetchUserPermissions: vi.fn(),
}));

vi.mock('provider/write', () => ({
  updateUserActiveStatusToInactive: vi.fn(),
  updateUserActiveStatusToActive: vi.fn(),
  insertOrUpdatePermissions: vi.fn(),
  updateUserRecord: vi.fn(),
  writeToFunctionLogs: vi.fn(),
}));

vi.mock('src/helpers/helpers', async () => {
    const actual = await vi.importActual('src/helpers/helpers');
    return {
        ...(actual as any),
        notifyStandard: vi.fn(),
        notifyFailure: vi.fn(),
    };
});

describe('Manage User Active and Inactive standard user Standard User Screen',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

  test('It should show a no permission message if they are not an Org Super User', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

    const mockDeactivateUser = vi.mocked(writeProvider.updateUserActiveStatusToInactive);
    mockDeactivateUser.mockResolvedValue({
      ok: true,
      data: { id: 'idstring', status: false }

    });

    renderWithProviders(<UserStatusDashboard />, {
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
      expect(mockPermissionsFetch).not.toHaveBeenCalled();
    });

    const noPermissionMessage = screen.getByText(/Oh hey there/i);
    expect(noPermissionMessage).toBeVisible();
    const tables = screen.queryAllByRole('table');
    expect(tables).toHaveLength(0);
  });
  
  test('It should show a list of users and the ability to make them active, inactive or edit org super user privs.  Successful Reponses', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

   vi.mocked(writeProvider.updateUserActiveStatusToInactive)
   .mockResolvedValueOnce({
      ok: true,
      data: { id: 'idstring', status: false }
    });

    vi.mocked(writeProvider.updateUserActiveStatusToActive)
   .mockResolvedValueOnce({
      ok: true,
      data: { id: 'idstring', status: false }
    });

    renderWithProviders(<UserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    expect(screen.getByText(/Easy Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Liam /i)).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => within(row).queryByText(/Rachel Green/i));

    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[0]).toBeDisabled();
    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[1]).toBeDisabled();

    const orgtoggle = within(targetRow!).getAllByRole('switch', { name: /^Super User/i });
    expect(orgtoggle[0]).toBeInTheDocument();

    const activeButton = screen.getAllByRole('button', { name: /deactivate user/i });
    expect(activeButton).toHaveLength(14);

    const targetRowEasyTest = rows.find(row => within(row).queryByText(/Easy Test/i));
    const deactivateEasyTestButton = within(targetRowEasyTest!).getAllByRole('button', { name: /deactivate user/i })[0];

    await user.click(deactivateEasyTestButton);

    expect(writeProvider.updateUserActiveStatusToInactive).toHaveBeenCalled();

    expect(notifyStandard).toHaveBeenCalledWith(
          `Line Closed.  The user is now inactive in the system.\n\n(TLDR: The user is now INACTIVE)`
    );

    const targetRowSaraVear = rows.find(row => within(row).queryByText(/Sara Bear/i));
    const activateSaraBearButton = within(targetRowSaraVear!).getAllByRole('button', { name: /activate user/i })[0]

    await user.click(activateSaraBearButton);
    expect(writeProvider.updateUserActiveStatusToActive).toHaveBeenCalled();
    expect(notifyStandard).toHaveBeenCalledWith(
          `Line Opened.  The user is now active in the system.\n\n(TLDR: The user is now ACTIVE)`
    );
  });

  test('It should show a list of users and the ability to make them active, inactive or edit org super user privs.  UNSuccessful Reponses', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

   vi.mocked(writeProvider.updateUserActiveStatusToInactive)
   .mockResolvedValueOnce({
      ok: false,
      message: 'Cannot do the user status change'
    })
    .mockRejectedValue(new Error('Database connection failed'));

    vi.mocked(writeProvider.updateUserActiveStatusToActive)
   .mockResolvedValueOnce({
      ok: false,
      message: 'Cannot do the user status change'
    })
    .mockRejectedValue(new Error('Database connection failed'));

    renderWithProviders(<UserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    expect(screen.getByText(/Easy Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Liam /i)).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => within(row).queryByText(/Rachel Green/i));

    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[0]).toBeDisabled();
    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[1]).toBeDisabled();

    const orgtoggle = within(targetRow!).getAllByRole('switch', { name: /^Super User/i });
    expect(orgtoggle[0]).toBeInTheDocument();

    const activeButton = screen.getAllByRole('button', { name: /deactivate user/i });
    expect(activeButton).toHaveLength(14);

    const targetRowEasyTest = rows.find(row => within(row).queryByText(/Easy Test/i));
    const deactivateEasyTestButton = within(targetRowEasyTest!).getAllByRole('button', { name: /deactivate user/i })[0];

    await user.click(deactivateEasyTestButton);
    expect(writeProvider.updateUserActiveStatusToInactive).toHaveBeenCalled();
    expect(notifyStandard).not.toHaveBeenCalled();
    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure Never Built.  User deactivation failed before the line came online.\n\n(TLDR: The user is IS STILL ACTIVE)`
    );
    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalled();

    const targetRowSaraVear = rows.find(row => within(row).queryByText(/Sara Bear/i));
    const activateSaraBearButton = within(targetRowSaraVear!).getAllByRole('button', { name: /activate user/i })[0];
    const activateSaraBearButtonMobile = within(targetRowSaraVear!).getAllByRole('button', { name: /activate user/i })[2]

    await user.click(activateSaraBearButton);
    expect(writeProvider.updateUserActiveStatusToActive).toHaveBeenCalled();
    expect(notifyStandard).not.toHaveBeenCalled();
    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure Never Built.  User activation failed before the line came online.\n\n(TLDR: The user is NOT ACTIVE)`
    );
    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalled();

    await user.click(activateSaraBearButtonMobile);
    expect(writeProvider.updateUserActiveStatusToActive).toHaveBeenCalled();
    expect(notifyStandard).not.toHaveBeenCalled();
    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure Never Built.  User activation failed before the line came online.\n\n(TLDR: The user is NOT ACTIVE)`
    );
    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalled();

    const targetLiam = rows.find(row => within(row).queryByText(/Liam Neilson/i));
    const deactivateLiamButton = within(targetLiam!).getAllByRole('button', { name: /deactivate user/i })[1];

    await user.click(deactivateLiamButton);
    expect(writeProvider.updateUserActiveStatusToInactive).toHaveBeenCalled();
    expect(notifyStandard).not.toHaveBeenCalled();
    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure Never Built.  User activation failed before the line came online.\n\n(TLDR: The user is NOT ACTIVE)`
    );
    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalled();
  });

  test('It should show a list of users and the ability to make them active, inactive or edit org super user privs.  User will toggle Super User switch', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

   vi.mocked(writeProvider.updateUserRecord)
    .mockResolvedValueOnce({
      ok: false,
      message: 'Issue'
    })
    .mockResolvedValueOnce({
      ok: true,
    })
    .mockResolvedValueOnce({
      ok: false,
      message: 'Issue'
    })
    .mockResolvedValueOnce({
      ok: true,
    });

    renderWithProviders(<UserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    expect(screen.getByText(/Easy Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Liam /i)).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => within(row).queryByText(/Mike Rider/i));

    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[0]).not.toBeDisabled();
    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[1]).not.toBeDisabled();

    const orgtoggle = within(targetRow!).getAllByRole('switch', { name: /^Super User/i });
    expect(orgtoggle[0]).toBeInTheDocument();

    const activeButton = screen.getAllByRole('button', { name: /deactivate user/i });
    expect(activeButton).toHaveLength(14);

    await user.click(orgtoggle[0]);

    expect(writeProvider.updateUserRecord).toHaveBeenCalledWith('77ef7dd6-bd03-4500-b599-ad1447e8c489', true, 'test-token');

    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure held.  Super User access has not been updated.\n\n(TLDR: Super User Access is still OFF)`
        );
    
    await user.click(orgtoggle[0]);
    
    expect(writeProvider.updateUserRecord).toHaveBeenCalledWith('77ef7dd6-bd03-4500-b599-ad1447e8c489', true, 'test-token');

    expect(notifyStandard).toHaveBeenCalledWith(
          `Shut-In Complete.  Super User access has been sealed off.\n\n(TLDR: Super User Access is now ON)`
        );
    
    await user.click(orgtoggle[1]);

    expect(writeProvider.updateUserRecord).toHaveBeenCalledWith('77ef7dd6-bd03-4500-b599-ad1447e8c489', false, 'test-token');

    expect(notifyFailure).toHaveBeenCalledWith(
           `Pressure held.  Super User access has not been updated.\n\n(TLDR: Super User Access is still ON)`
        );
    
    await user.click(orgtoggle[1]);

    expect(writeProvider.updateUserRecord).toHaveBeenCalledWith('77ef7dd6-bd03-4500-b599-ad1447e8c489', false, 'test-token');

    expect(notifyStandard).toHaveBeenCalledWith(
          `Shut-In Complete.  Super User access has been sealed off.\n\n(TLDR: Super User Access is now OFF)`
        );

  });

  test('User will toggle Super User switch and get back error response', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

    const mockDeactivateUser = vi.mocked(writeProvider.updateUserRecord);
    mockDeactivateUser.mockResolvedValue({
      ok: false,
      message: 'Error updating Org Super User Status'
    });

    renderWithProviders(<UserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    expect(screen.getByText(/Easy Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Liam /i)).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => within(row).queryByText(/Mike Rider/i));

    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[0]).not.toBeDisabled();
    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[1]).not.toBeDisabled();

    const orgtoggle = within(targetRow!).getAllByRole('switch', { name: /^Super User/i });
    expect(orgtoggle[0]).toBeInTheDocument();

    const activeButton = screen.getAllByRole('button', { name: /deactivate user/i });
    expect(activeButton).toHaveLength(14);

    await user.click(orgtoggle[0]);

    expect(writeProvider.updateUserRecord).toHaveBeenCalledWith('77ef7dd6-bd03-4500-b599-ad1447e8c489', true, 'test-token');

    expect(notifyFailure).toHaveBeenCalledWith(
          `Pressure held.  Super User access has not been updated.\n\n(TLDR: Super User Access is still OFF)`
        );

  });
});

describe('Manage User Active and Inactive standard user Super User Screen',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

  test('It should show the list of users with the ability to make them active or inactive for the Super User', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

    vi.mocked(writeProvider.updateUserActiveStatusToInactive)
   .mockResolvedValueOnce({
      ok: true,
      data: { id: 'idstring', status: false }
    });

    vi.mocked(writeProvider.updateUserActiveStatusToActive)
   .mockResolvedValueOnce({
      ok: true,
      data: { id: 'idstring', status: false }
    });

    renderWithProviders(<SuperUserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: Love_Quinn_Super_User,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    expect(screen.getByText(/Easy Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Liam /i)).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => within(row).queryByText(/Rachel Green/i));

    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[0]).toBeDisabled();
    expect(within(targetRow!).getAllByRole('button', { name: /deactivate user/i })[1]).toBeDisabled();

    const activeButton = screen.getAllByRole('button', { name: /deactivate user/i });
    expect(activeButton).toHaveLength(14);

    const targetRowEasyTest = rows.find(row => within(row).queryByText(/Easy Test/i));
    const deactivateEasyTestButton = within(targetRowEasyTest!).getAllByRole('button', { name: /deactivate user/i })[0];

    expect(deactivateEasyTestButton).toBeEnabled();

    await user.click(deactivateEasyTestButton);

    expect(writeProvider.updateUserActiveStatusToInactive).toHaveBeenCalled();

    const targetRowSaraVear = rows.find(row => within(row).queryByText(/Sara Bear/i));
    const activateSaraBearButton = within(targetRowSaraVear!).getAllByRole('button', { name: /activate user/i })[0]

    await user.click(activateSaraBearButton);
    expect(writeProvider.updateUserActiveStatusToActive).toHaveBeenCalled();
  });

  test('It should not show users if there is no user access token', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: true,
      data: userListActiveOrInactive
    });

    const mockDeactivateUser = vi.mocked(writeProvider.updateUserActiveStatusToInactive);
    mockDeactivateUser.mockResolvedValue({
      ok: true,
      data: { id: 'idstring', status: false }

    });

    renderWithProviders(<SuperUserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: userNoUserId,
        loading: false,
        session: null,
      }
    });

    await waitFor(() => {
      expect(mockPermissionsFetch).not.toHaveBeenCalled();
    });

    expect(screen.getByRole("heading")).toHaveTextContent("Oh hey there Tim Ross! Nice to see you here.");

  });

  test('It should show and error if cannot get users', async () => {
    const user = userEvent.setup()

    const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
    mockPermissionsFetch.mockResolvedValue({
      ok: false,
      message: 'error'
    });

    const mockDeactivateUser = vi.mocked(writeProvider.updateUserActiveStatusToInactive);
    mockDeactivateUser.mockResolvedValue({
      ok: true,
      data: { id: 'idstring', status: false }

    });

    renderWithProviders(<SuperUserStatusDashboard />, {
      supabaseOverrides: {
        loggedInUser: Love_Quinn_Super_User,
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
      expect(mockPermissionsFetch).toHaveBeenCalled();
    });

    const header = screen.getByText(/User Profiles/i);
    expect(header).toBeInTheDocument();

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
    
  });
});

describe('Manage User Permissions Standard user screen',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    test('It should allow user to toggle permissions standard user', async () => {
            const user = userEvent.setup();
            
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });
            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
    
            renderWithProviders(<UserPermissionDashboard />, {
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
                                  app_metadata:[],
                                  user_metadata:{}
                                }
                              },
                            }
                });
    
                await waitFor(() => {
                      expect(mockPermissionsFetch).toHaveBeenCalled();
                });
                
                await waitFor(() => {
                  expect(screen.getAllByText(/The permissions associated to each user./i)[0]).toBeInTheDocument();
                  expect(screen.getAllByText(/The permissions associated to each user./i)[1]).toBeInTheDocument();
                });
    
                const tables = screen.getAllByRole('table');
                expect(tables).toHaveLength(2);
                const rows = within(tables[0]).getAllByRole('row');
                const nonOpRows =  within(tables[1]).getAllByRole('row');

                const dataRows = rows.slice(1);
                const nonOpdatarows = nonOpRows.slice(1);

                expect(within(dataRows[0]).getByText(/Mike Rider/i)).toBeInTheDocument();
                expect(within(nonOpdatarows[0]).getByText(/Mike Rider/i)).toBeInTheDocument();

                const checkboxes = within(dataRows[2]).getAllByRole("checkbox");
                const nonOpcheckboxes = within(nonOpdatarows[2]).getAllByRole("checkbox");

                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).not.toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeEnabled();
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).toHaveBeenNthCalledWith(1,
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS', 'test-token'
                );

                });
                
                expect(nonOpcheckboxes[0]).toBeChecked();
                
                await user.click(nonOpcheckboxes[0]);
                expect(nonOpcheckboxes[0]).not.toBeChecked();

                await user.click(nonOpcheckboxes[1]);
                expect(nonOpcheckboxes[1]).toBeChecked();

                await user.click(nonOpcheckboxes[2]);
                expect(nonOpcheckboxes[2]).toBeChecked();

                await user.click(nonOpcheckboxes[2]);
                expect(nonOpcheckboxes[2]).not.toBeChecked();

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Operated Permissions/i });
                expect(saveNonopPermissionButton).toBeEnabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).toHaveBeenNthCalledWith(2,
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS','test-token'
               );

                });

            });
    test('It should allow user to toggle permissions Super User', async () => {
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });

            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
    
            renderWithProviders(<UserPermissionDashboard />, {
                              supabaseOverrides: {
                                loggedInUser: Love_Quinn_Super_User,
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
                                  app_metadata:[],
                                  user_metadata:{}
                                }
                              },
                            }
                });
    
                await waitFor(() => {
                  expect(mockPermissionsFetch).toHaveBeenCalled();
                });
                
                await waitFor(() => {
                  expect(screen.getAllByText(/The permissions associated to each user./i)[0]).toBeInTheDocument();
                  expect(screen.getAllByText(/The permissions associated to each user./i)[1]).toBeInTheDocument();
                });
    
                const tables = screen.getAllByRole('table');
                expect(tables).toHaveLength(2);
                const rows = within(tables[0]).getAllByRole('row');
                const dataRows = rows.slice(1);
                expect(within(dataRows[0]).getByText(/Mike Rider/i)).toBeInTheDocument();
                //expect(screen.getAllByText(/Mike Rider/i)[0]).toBeInTheDocument();
                const checkboxes = within(dataRows[2]).getAllByRole("checkbox");
                expect(checkboxes[0]).toBeChecked();
                expect(checkboxes[1]).not.toBeChecked();
                expect(checkboxes[2]).not.toBeChecked();
                expect(checkboxes[3]).not.toBeChecked();
                
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).not.toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[3]);
                expect(checkboxes[3]).toBeChecked();

                await user.click(checkboxes[3]);
                expect(checkboxes[3]).not.toBeChecked();

                await user.click(checkboxes[0]);
                expect(checkboxes[0]).toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).not.toBeChecked();

                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeDisabled()
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).not.toBeCalledWith(
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS', 'test-token'
                );

                });
                

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Operated Permissions/i });
                expect(saveNonopPermissionButton).toBeDisabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).not.toBeCalledWith(
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS', 'test-token'
               );

                });
                

                
            });
    
});

describe('Manage User Permissions System Super User Screen',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    });

    test('It should allow user to toggle permissions Super User', async () => {
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });

            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
            vi.mocked(writeProvider.insertOrUpdatePermissions)
            .mockResolvedValueOnce({ok:true});
    
            renderWithProviders(<SuperUserDash />, {
                              supabaseOverrides: {
                                loggedInUser: Love_Quinn_Super_User,
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
                                  app_metadata:[],
                                  user_metadata:{}
                                }
                              },
                            }
                });
    
                await waitFor(() => {
                  expect(mockPermissionsFetch).toHaveBeenCalledWith(Love_Quinn_Super_User.is_super_user, 'test-token')
                });

                await waitFor(() => {
                  expect(screen.getAllByText(/The permissions associated to each user./i)[0]).toBeInTheDocument();
                  expect(screen.getAllByText(/The permissions associated to each user./i)[1]).toBeInTheDocument();
                });
    
                const tables = screen.getAllByRole('table');
                expect(tables).toHaveLength(2);
                const rows = within(tables[0]).getAllByRole('row');
                const nonOpRows =  within(tables[1]).getAllByRole('row');

                const dataRows = rows.slice(1);
                const nonOpdatarows = nonOpRows.slice(1);

                expect(within(dataRows[0]).getByText(/Mike Rider/i)).toBeInTheDocument();
                expect(within(nonOpdatarows[0]).getByText(/Mike Rider/i)).toBeInTheDocument();

                const checkboxes = within(dataRows[2]).getAllByRole("checkbox");
                const nonOpcheckboxes = within(nonOpdatarows[2]).getAllByRole("checkbox");

                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).not.toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeEnabled();
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).toHaveBeenNthCalledWith(1,
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS', 'test-token'
                );

                });

                expect(nonOpcheckboxes[0]).toBeChecked();
                
                await user.click(nonOpcheckboxes[0]);
                expect(nonOpcheckboxes[0]).not.toBeChecked();

                await user.click(nonOpcheckboxes[1]);
                expect(nonOpcheckboxes[1]).toBeChecked();

                await user.click(nonOpcheckboxes[2]);
                expect(nonOpcheckboxes[2]).toBeChecked();

                await user.click(nonOpcheckboxes[2]);
                expect(nonOpcheckboxes[2]).not.toBeChecked();
                
                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Operated Permissions/i });
                expect(saveNonopPermissionButton).toBeEnabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.insertOrUpdatePermissions).toHaveBeenNthCalledWith(2,
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS', 'test-token'
               );

                });
                

                
            });
   
    
});