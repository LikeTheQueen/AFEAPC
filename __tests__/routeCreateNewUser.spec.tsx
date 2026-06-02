import CreateNewUser from 'src/routes/createEditUsers/routes/createNewUser';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import * as emailProvider from '../email/emailBasic';
import { notifyStandard, notifyFailure, doesUserHaveRole } from 'src/helpers/helpers';
import { operatorEditUsers, nonOperatorEditUsers } from "src/constants/variables";
import { vi, type Mock } from 'vitest';
import { getByRole, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { apc_parent_company_CWFriends, JoeyGreen_NoUserEditRights_CW_NonOpCW, loggedInUserIsSuperUser, ParentCompanyDropdown } from './test-utils/afeRecords';
import { RachelGreen_ViewAFECW_NonOPAFECW_APCSuperUser, RachelGreen_AllPermissions_CW_NonOpCW } from '__tests__/test-utils/afeRecords';

import { permissionResponseRachel, permissionResponseRachelNonOp, genericRoleList } from './test-utils/rachelGreenuser';

vi.mock('provider/fetch', () => ({
  fetchRolesGeneric: vi.fn(),
  fetchListOfOperatorsOrPartnersForUser: vi.fn(),
  fetchAllParentCompanies: vi.fn()
}));

vi.mock('provider/write', () => ({
  updateOperatorFilterFields: vi.fn(),
}));

vi.mock('../email/emailBasic', () => ({
  handleSendEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
}));

vi.mock('src/routes/createEditUsers/routes/helpers/helpers', () => ({
  handleNewUser: vi.fn(),
}));

vi.mock('src/helpers/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('src/helpers/helpers')>();
  return {
    ...actual,
    notifyStandard: vi.fn(),
    notifyFailure: vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
  Flip: {},
  ToastContainer: () => null,
}));

import { toast } from 'react-toastify';
import { handleNewUser } from 'src/routes/createEditUsers/routes/helpers/helpers';
import { supportEmail } from 'src/constants/variables';

describe('Create New User',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

    test('It should show the create new user page with limited number of Operators to assign permissions to', async () => {
        const user = userEvent.setup()
        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );
        vi.mocked(fetchProvider.fetchAllParentCompanies).mockResolvedValue(
            []
        );

        renderWithProviders(<CreateNewUser />, {
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
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            const userFirstName = screen.getByLabelText(/First name/i );
            expect(userFirstName).toHaveDisplayValue('');
            
            const toggle = screen.queryByRole('switch', { name: /^Super User/i });
            expect(toggle).not.toBeInTheDocument();

            const parentCompaniesDropdown = screen.queryByRole('combobox', { name: /Parent Company/i});
            expect(parentCompaniesDropdown).not.toBeInTheDocument();
            
            const orgtoggle = screen.getByRole('switch', { name: /^Org Super User/i });
            expect(orgtoggle).toBeInTheDocument();
            expect(orgtoggle).toBeVisible();
            
            const activetoggle = screen.getByRole('switch', { name: /Active/i });
            expect(activetoggle).toBeInTheDocument();
            expect(activetoggle).toBeEnabled();
            
            expect(screen.getByRole('button', { name: /add new user/i })).toBeDisabled();

            const nonOpPermissionTable = screen.getAllByRole("listitem");
            expect(nonOpPermissionTable).toHaveLength(9);
            const tables = screen.getAllByRole('table');
            expect(tables).toHaveLength(2);
            expect(screen.getByText(/Corr and Whit Oils Company/i)).toBeInTheDocument();
            expect(screen.getByText(/John Ross Exploration Inc/i)).toBeInTheDocument();
        });
    
    test('It should save the new user information, allow the user to click the save button and get back a response', async () => {
        const user = userEvent.setup()

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        vi.mocked(fetchProvider.fetchAllParentCompanies).mockResolvedValue(
            []
        );

        renderWithProviders(<CreateNewUser />, {
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
          const userFirstName = screen.getByLabelText(/First name/i );
            expect(userFirstName).toHaveDisplayValue('');
        })

            await waitFor(() => {
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            const userFirstName = screen.getByLabelText(/First name/i );
            const userLastName = screen.getByLabelText(/Last name/i );
            const userEmail = screen.getByLabelText(/Email address/i );
            const saveUserButton = screen.getByRole('button', { name: /add new user/i });
            expect(userFirstName).toHaveDisplayValue('');
            
            const toggle = screen.queryByRole('switch', { name: /^Super User/i });
            expect(toggle).not.toBeInTheDocument();

            const parentCompaniesDropdown = screen.queryByRole('combobox', { name: /Parent Company/i});
            expect(parentCompaniesDropdown).not.toBeInTheDocument();
            
            const activetoggle = screen.getByRole('switch', { name: /Active/i });
            expect(activetoggle).toBeInTheDocument();

            const orgtoggle = screen.getByRole('switch', { name: /^Org Super User/i });
            expect(orgtoggle).toBeInTheDocument();

            expect(activetoggle).toBeEnabled();
            
            expect(saveUserButton).toBeDisabled();

            const nonOpPermissionTable = screen.getAllByRole("listitem");
            expect(nonOpPermissionTable).toHaveLength(9);
            const tables = screen.getAllByRole('table');
            expect(tables).toHaveLength(2);
            expect(screen.getByText(/Corr and Whit Oils Company/i)).toBeInTheDocument();
            expect(screen.getByText(/John Ross Exploration Inc/i)).toBeInTheDocument();

            await user.type(userFirstName, 'Janice');
            expect(userFirstName).toHaveDisplayValue('Janice');

            await user.type(userLastName, 'Grill');
            expect(userLastName).toHaveValue('Grill');

            await user.type(userEmail, 'jgrill@email.com');
            expect(userEmail).toHaveValue('jgrill@email.com');

            expect(saveUserButton).toBeEnabled();

            await user.click(saveUserButton);

            expect(handleNewUser).toHaveBeenCalledWith(
                'Janice',
                'Grill',
                'jgrill@email.com',
                false,
                [],
                [],
                false,
                'test-token',
                apc_parent_company_CWFriends,
                false
            );


        });
    
    test('It should save the new user information with active and permissions, allow the user to click the save button and get back a response', async () => {
        const user = userEvent.setup()

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        
        
        renderWithProviders(<CreateNewUser />, {
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
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            const userFirstName = screen.getByLabelText(/First name/i );
            const userLastName = screen.getByLabelText(/Last name/i );
            const userEmail = screen.getByLabelText(/Email address/i );
            const saveUserButton = screen.getByRole('button', { name: /add new user/i });
            const checkboxes = screen.getAllByRole('checkbox');

            expect(checkboxes).toHaveLength(8);
            expect(userFirstName).toHaveDisplayValue('');
            const toggle = screen.queryByRole('switch', { name: /^Super User$/i });
            expect(toggle).not.toBeInTheDocument();
            const activetoggle = screen.getByRole('switch', { name: /Active/i });
            expect(activetoggle).toBeInTheDocument();
            expect(activetoggle).toBeEnabled();
            expect(saveUserButton).toBeDisabled();

            const nonOpPermissionTable = screen.getAllByRole("listitem");
            expect(nonOpPermissionTable).toHaveLength(9);
            const tables = screen.getAllByRole('table');
            expect(tables).toHaveLength(2);
            expect(screen.getByText(/Corr and Whit Oils Company/i)).toBeInTheDocument();
            expect(screen.getByText(/John Ross Exploration Inc/i)).toBeInTheDocument();

            await user.type(userFirstName, 'Janice');
            expect(userFirstName).toHaveDisplayValue('Janice');

            await user.type(userLastName, 'Grill');
            expect(userLastName).toHaveValue('Grill');

            await user.type(userEmail, 'jgrill@email.com');
            expect(userEmail).toHaveValue('jgrill@email.com');

            expect(saveUserButton).toBeEnabled();

            await user.click(activetoggle);
            await user.click(checkboxes[1]);
            await user.click(checkboxes[5]);


            await user.click(saveUserButton);

            expect(handleNewUser).toHaveBeenCalledWith(
                'Janice',
                'Grill',
                'jgrill@email.com',
                true,
                [{role:4, apc_id:'3b34a78a-13ad-40b5-aecd-268d56dd5e0d', apc_address_id:66,active:true}],
                [{role:5, apc_id:'8ed0a285-0011-4f56-962f-c46bc0889d1b', apc_address_id:10,active:true}],
                false,
                'test-token',
                apc_parent_company_CWFriends,
                false
            );


        });

    test('It should save the new user information with inactive and permissions by selecting and deslecting, allow the user to click the save button and get back a response', async () => {
        const user = userEvent.setup()

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        
        
        renderWithProviders(<CreateNewUser />, {
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
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            const userFirstName = screen.getByLabelText(/First name/i );
            const userLastName = screen.getByLabelText(/Last name/i );
            const userEmail = screen.getByLabelText(/Email address/i );
            const saveUserButton = screen.getByRole('button', { name: /add new user/i });
            const checkboxes = screen.getAllByRole('checkbox');

            expect(checkboxes).toHaveLength(8);
            expect(userFirstName).toHaveDisplayValue('');
            const toggle = screen.queryByRole('switch', { name: /^Super User/i });
            expect(toggle).not.toBeInTheDocument();
            const orgtoggle = screen.getByRole('switch', { name: /^Org Super User/i });
            expect(orgtoggle).toBeInTheDocument();
            const activetoggle = screen.getByRole('switch', { name: /Active/i });
            expect(activetoggle).toBeInTheDocument();
            expect(activetoggle).toBeEnabled();
            expect(saveUserButton).toBeDisabled();

            const nonOpPermissionTable = screen.getAllByRole("listitem");
            expect(nonOpPermissionTable).toHaveLength(9);
            const tables = screen.getAllByRole('table');
            expect(tables).toHaveLength(2);
            expect(screen.getByText(/Corr and Whit Oils Company/i)).toBeInTheDocument();
            expect(screen.getByText(/John Ross Exploration Inc/i)).toBeInTheDocument();

            await user.type(userFirstName, 'Janice');
            expect(userFirstName).toHaveDisplayValue('Janice');

            await user.type(userLastName, 'Grill');
            expect(userLastName).toHaveValue('Grill');

            await user.type(userEmail, 'jgrill@email.com');
            expect(userEmail).toHaveValue('jgrill@email.com');

            expect(saveUserButton).toBeEnabled();

            await user.click(activetoggle);
            await user.click(checkboxes[1]);
            await user.click(checkboxes[5]);
            await user.click(activetoggle);
            await user.click(checkboxes[1]);
            await user.click(checkboxes[5]);
            await user.click(checkboxes[2]);
            await user.click(checkboxes[6]);

            await user.click(orgtoggle);
            await user.click(saveUserButton);

            expect(handleNewUser).toHaveBeenCalledWith(
                'Janice',
                'Grill',
                'jgrill@email.com',
                false,
                [{role:8, apc_id:'3b34a78a-13ad-40b5-aecd-268d56dd5e0d', apc_address_id:66,active:true}],
                [{role:9, apc_id:'8ed0a285-0011-4f56-962f-c46bc0889d1b', apc_address_id:10,active:true}],
                false,
                'test-token',
                apc_parent_company_CWFriends,
                true
            );


        });

    test('It should save the new user information with active as a super user and not show other permission options, allow the user to click the save button and get back a response', async () => {
        const user = userEvent.setup()

        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        vi.mocked(fetchProvider.fetchAllParentCompanies).mockResolvedValue(
            ParentCompanyDropdown
        );

        renderWithProviders(<CreateNewUser />, {
                          supabaseOverrides: {
                            loggedInUser: loggedInUserIsSuperUser,
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
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            const userFirstName = screen.getByLabelText(/First name/i );
            const userLastName = screen.getByLabelText(/Last name/i );
            const userEmail = screen.getByLabelText(/Email address/i );
            const saveUserButton = screen.getByRole('button', { name: /add new user/i });
            const checkboxes = screen.getAllByRole('checkbox');

            expect(checkboxes).toHaveLength(8);
            expect(userFirstName).toHaveDisplayValue('');
            const toggle = screen.getByRole('switch', { name: /^Super User/i });
            expect(toggle).toBeInTheDocument();
            expect(toggle).toBeEnabled();
            const orgtoggle = screen.getByRole('switch', { name: /^Org Super User/i });
            expect(orgtoggle).toBeInTheDocument();
            expect(orgtoggle).toBeEnabled();
            const activetoggle = screen.getByRole('switch', { name: /Active/i });
            expect(activetoggle).toBeInTheDocument();
            expect(activetoggle).toBeEnabled();
            expect(saveUserButton).toBeDisabled();

            const parentCompaniesDropdown = screen.getByRole('combobox', { name: /Parent Company/i});
            expect(parentCompaniesDropdown).toBeInTheDocument();

            const nonOpPermissionTable = screen.getAllByRole("listitem");
            expect(nonOpPermissionTable).toHaveLength(9);
            const tables = screen.getAllByRole('table');
            expect(tables).toHaveLength(2);
            expect(screen.getByText(/Corr and Whit Oils Company$/i)).toBeInTheDocument();
            expect(screen.getByText(/John Ross Exploration Inc/i)).toBeInTheDocument();

            await user.type(userFirstName, 'Janice');
            expect(userFirstName).toHaveDisplayValue('Janice');

            await user.type(userLastName, 'Grill');
            expect(userLastName).toHaveValue('Grill');

            await user.type(userEmail, 'jgrill@email.com');
            expect(userEmail).toHaveValue('jgrill@email.com');

            expect(saveUserButton).not.toBeEnabled();

            await user.click(activetoggle);
            await user.click(checkboxes[1]);
            await user.click(checkboxes[5]);
            await user.click(checkboxes[1]);
            await user.click(checkboxes[5]);
            await user.click(checkboxes[2]);
            await user.click(checkboxes[6]);

            await user.selectOptions(parentCompaniesDropdown, apc_parent_company_CWFriends);

            await user.click(toggle);
            expect(screen.getByRole('button', { name: /add new user/i })).not.toBeEnabled();
            await user.click(saveUserButton);

            expect(handleNewUser).not.toHaveBeenCalledWith(
                'Janice',
                'Grill',
                'jgrill@email.com',
                true,
                [],
                [],
                true,
                'test-token',
                apc_parent_company_CWFriends,
                false
            );

            await user.selectOptions(parentCompaniesDropdown, '');
            expect(screen.getByRole('button', { name: /add new user/i })).toBeEnabled();
            await user.click(saveUserButton);

            expect(handleNewUser).toHaveBeenCalledWith(
                'Janice',
                'Grill',
                'jgrill@email.com',
                true,
                [],
                [],
                true,
                'test-token',
                '',
                false
            );


        });
    
    test('It should show message the user does not have permissions', async () => {
        
        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachelNonOp
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        renderWithProviders(<CreateNewUser />, {
                          supabaseOverrides: {
                            loggedInUser: JoeyGreen_NoUserEditRights_CW_NonOpCW,
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
                  expect(mockPartnersFetch).not.toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).not.toHaveBeenCalled();
                });

            expect(screen.getByText(/You do not have permission to create users/i)).toBeInTheDocument();
            expect(screen.getByText(/You do not have permission to create users/i)).toBeVisible();

            const fetchErrorMessage = screen.queryByText(`Unable to get available permission grid.  Try again or contact AFE Partner Support: ${supportEmail}`);
            expect(fetchErrorMessage).not.toBeInTheDocument();
            
            
        });
    test('It should show an error when the fetch does not work', async () => {
        
        const mockPartnersFetch = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetch.mockResolvedValueOnce({
            ok: true,
            data: permissionResponseRachel
        });

        const mockPartnersFetchSecond = vi.mocked(fetchProvider.fetchListOfOperatorsOrPartnersForUser);
        mockPartnersFetchSecond.mockResolvedValueOnce({
            ok: false,
            message: "Error"
        });
        
        vi.mocked(fetchProvider.fetchRolesGeneric).mockResolvedValue(
            genericRoleList
        );

        renderWithProviders(<CreateNewUser />, {
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
                  expect(mockPartnersFetch).toHaveBeenCalled();
                  expect(mockPartnersFetchSecond).toHaveBeenCalled();
                });

            expect(screen.queryByText(/You do not have permissions to create new users/i)).not.toBeInTheDocument();
            

            const fetchErrorMessage = screen.getByText(/Unable to get available permission grid./i);
            expect(fetchErrorMessage).toBeInTheDocument();
            
            
        });


});