import UserPermissionDashboard from 'src/routes/createEditUsers/routes/manageUserPermissions';
import SuperUserDash from 'src/routes/createEditUsers/routes/manageUserPermissionsSystem';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserIsSuperUser } from './test-utils/afeRecords';

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
                                loggedInUser: loggedInUserRachelGreenWithUserId,
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
                data:{id:'idstring', status: false}

            });
    
            renderWithProviders(<SuperUserStatusDashboard />, {
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
                                loggedInUser: loggedInUserRachelGreenWithUserId,
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
                      expect(mockPermissionsFetch).toHaveBeenCalled();
                    });
    
                const tables = screen.getAllByRole('table');
                expect(tables).toHaveLength(2);
                expect(screen.getAllByText(/Mike Rider/i));
                const checkboxes = screen.getAllByRole("checkbox");
                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).not.toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[4]);
                expect(checkboxes[4]).not.toBeChecked();

                await user.click(checkboxes[6]);
                expect(checkboxes[6]).toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                
                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeEnabled();
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).toBeCalledWith(
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
                );

                });
                

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Op Permissions/i });
                expect(saveNonopPermissionButton).toBeEnabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).toBeCalledWith(
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
                expect(tables).toHaveLength(2);
                expect(screen.getAllByText(/Mike Rider/i));
                const checkboxes = screen.getAllByRole("checkbox");
                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).not.toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[4]);
                expect(checkboxes[4]).toBeChecked();

                await user.click(checkboxes[6]);
                expect(checkboxes[6]).not.toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                
                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeDisabled()
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).not.toBeCalledWith(
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
                );

                });
                

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Op Permissions/i });
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
    })

    test('It should allow user to toggle permissions Super User', async () => {
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });
    
            renderWithProviders(<SuperUserDash />, {
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
                expect(tables).toHaveLength(2);
                expect(screen.getAllByText(/Mike Rider/i));
                const checkboxes = screen.getAllByRole("checkbox");
                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).not.toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[4]);
                expect(checkboxes[4]).not.toBeChecked();

                await user.click(checkboxes[6]);
                expect(checkboxes[6]).toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                
                const saveopPermissionButton = screen.getByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).toBeEnabled();
                await user.click(saveopPermissionButton);
                
               await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).toBeCalledWith(
                    updatedPermissions,'OPERATOR_USER_PERMISSIONS'
                );

                });
                

                const saveNonopPermissionButton = screen.getByRole("button", { name: /Save Non-Op Permissions/i });
                expect(saveNonopPermissionButton).toBeEnabled();

                await user.click(saveNonopPermissionButton);
                await waitFor(() => {
                    expect(writeProvider.writeorUpadateUserRoles).toBeCalledWith(
                    updatedNonPermissions,'PARTNER_USER_PERMISSIONS'
               );

                });
                

                
            });
    test('It should allow user to toggle permissions Standard', async () => {
            const user = userEvent.setup()
    
            const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
            mockPermissionsFetch.mockResolvedValue({
                ok: true,
                data: limitedPermissionList
            });
    
            renderWithProviders(<SuperUserDash />, {
                              supabaseOverrides: {
                                loggedInUser: loggedInUserRachelGreenWithUserId,
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
                      expect(mockPermissionsFetch).toHaveBeenCalled();
                    });
    
                const tables = screen.getAllByRole('table');
                expect(tables).toHaveLength(2);
                expect(screen.getAllByText(/Mike Rider/i));
                const checkboxes = screen.getAllByRole("checkbox");
                expect(checkboxes[0]).toBeChecked();
                
                await user.click(checkboxes[0]);
                expect(checkboxes[0]).toBeChecked();

                await user.click(checkboxes[1]);
                expect(checkboxes[1]).not.toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[2]);
                expect(checkboxes[2]).not.toBeChecked();

                await user.click(checkboxes[4]);
                expect(checkboxes[4]).toBeChecked();

                await user.click(checkboxes[6]);
                expect(checkboxes[6]).not.toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                await user.click(checkboxes[5]);
                expect(checkboxes[5]).not.toBeChecked();

                
                const saveopPermissionButton = screen.queryByRole("button", { name: /Save Operated Permissions/i });
                expect(saveopPermissionButton).not.toBeInTheDocument();
                
                const saveNonopPermissionButton = screen.queryByRole("button", { name: /Save Non-Op Permissions/i });
                expect(saveNonopPermissionButton).not.toBeInTheDocument();
                
            });
    
});