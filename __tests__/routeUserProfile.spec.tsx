import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import Profile from 'src/routes/userProfile/routes/profile';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    MonicaGeller_NoOpRoles_CW_NonOpCW,
    RossGeller_Op_CW_No_NonOp,
    RachelGreenuserPermissions
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   fetchUserPermissions: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     updateGLCodeMapping: vi.fn(),
 }));
 
 

 describe('User Profile',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows the user profile Rachel Green', async () => {
 
        const mockPermissionsFetch = vi.mocked(fetchProvider.fetchUserPermissions);
                    mockPermissionsFetch.mockResolvedValue({
                        ok: true,
                        data: RachelGreenuserPermissions
                    });

        renderWithProviders(<Profile />, {
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
                      expect(mockPermissionsFetch).toHaveBeenCalled();
                });

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         const namefield = screen.getByText('Rachel');
         expect(namefield).toBeInTheDocument();
         await waitFor(() => {
                  expect(screen.getAllByText(/Permissions for Operated AFEs/i)[0]).toBeInTheDocument();
                  expect(screen.getAllByText(/Permissions for Non-Operated AFEs/i)[0]).toBeInTheDocument();
                });
         const tables = screen.getAllByRole('table');
         expect(tables).toHaveLength(2);

         const rows = within(tables[0]).getAllByRole('row');
         const nonOpRows =  within(tables[1]).getAllByRole('row');

         const dataRows = rows.slice(1);
         const nonOpdatarows = nonOpRows.slice(1);

         const checkboxes = within(dataRows[2]).getAllByRole("checkbox");
         const nonOpcheckboxes = within(nonOpdatarows[2]).getAllByRole("checkbox");

         expect(checkboxes[0]).toBeChecked();
         expect(nonOpcheckboxes[0]).toBeChecked();
         expect(checkboxes[2]).toBeChecked();
         expect(nonOpcheckboxes[2]).toBeChecked();

         expect(checkboxes[1]).not.toBeChecked();
         expect(nonOpcheckboxes[1]).not.toBeChecked();
         expect(checkboxes[3]).not.toBeChecked();
         expect(nonOpcheckboxes[3]).toBeChecked();

     });

     test('No logged in user', async () => {

         renderWithProviders(<Profile />, {
             supabaseOverrides: {
                 loggedInUser: null,
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

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         
         

     });
    });