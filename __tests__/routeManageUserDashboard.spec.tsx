import UserPermissionDashboard from 'src/routes/createEditUsers/routes/manageUserPermissions';
import SuperUserDash from 'src/routes/createEditUsers/routes/manageUserPermissionsSystem';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserIsSuperUser, Love_Quinn_Super_User, RachelGreen_AllPermissions_CW_NonOpCW, RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser } from './test-utils/afeRecords';

import { userNoUserId } from './test-utils/afeRecords';

import { loggedInUserRachelGreenWithUserId, limitedPermissionList, userListActiveOrInactive, updatedPermissions, updatedNonPermissions } from './test-utils/rachelGreenuser';
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
  writeorUpadateUserRoles: vi.fn(),
}));



describe('Manage User Active and Inactive standard user Standard User Screen',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    test('It should show the create new user page with limited number of Operators to assign permissions to', async () => {
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUsersForOperator);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: userListActiveOrInactive
            });

            const mockDeactivateUser = vi.mocked(writeProvider.updateUserActiveStatusToInactive);
            mockDeactivateUser.mockResolvedValue({
                ok: true,
                data:{id:'idstring', status: false}

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
                                  app_metadata:[],
                                  user_metadata:{}
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
                const deactivateEasyTestButton = within(targetRowEasyTest!).getAllByRole('button', { name: /deactivate user/i })[0]

                await user.click(deactivateEasyTestButton);

                expect(writeProvider.updateUserActiveStatusToInactive).toHaveBeenCalled();

                const targetRowSaraVear = rows.find(row => within(row).queryByText(/Sara Bear/i));
                const activateSaraBearButton = within(targetRowSaraVear!).getAllByRole('button', { name: /activate user/i })[0]

                await user.click(activateSaraBearButton);
                expect(writeProvider.updateUserActiveStatusToActive).toHaveBeenCalled();
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
    const deactivateEasyTestButton = within(targetRowEasyTest!).getAllByRole('button', { name: /deactivate user/i })[0]

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

    const header = screen.getByText(/User Profiles/i);
    expect(header).toBeInTheDocument();

    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(1);
    
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
    
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
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });
    
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
                    expect(writeProvider.writeorUpadateUserRoles).toHaveBeenNthCalledWith(1,
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
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
                    expect(writeProvider.writeorUpadateUserRoles).toHaveBeenNthCalledWith(2,
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS'
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
                    expect(writeProvider.writeorUpadateUserRoles).not.toBeCalledWith(
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
                );

                });
                

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Operated Permissions/i });
                expect(saveNonopPermissionButton).toBeDisabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).not.toBeCalledWith(
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS'
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
                    expect(writeProvider.writeorUpadateUserRoles).toHaveBeenNthCalledWith(1,
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
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
                    expect(writeProvider.writeorUpadateUserRoles).toHaveBeenNthCalledWith(2,
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS'
               );

                });
                

                
            });
   
    
});