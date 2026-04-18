import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import Profile from 'src/routes/userProfile/routes/profile';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    OperatorDropDown,
    PartnerDropdown,
    partnerAccountCodes,
    MonicaGeller_NoOpRoles_CW_NonOpCW,
    RossGeller_Op_CW_No_NonOp
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   fetchUserPermissions: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     updateGLCodeMapping: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<Profile />, {
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

         renderWithProviders(<Profile />, {
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

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         const namefield = screen.getByText('Rachel');
         expect(namefield).toBeInTheDocument();
         const tables = screen.getAllByRole('table');
         expect(tables).toHaveLength(2);

         const checkboxes = screen.getAllByRole("checkbox");
         expect(checkboxes[0]).toBeChecked();
         expect(checkboxes[1]).toBeChecked();
         expect(checkboxes[2]).toBeChecked();
         expect(checkboxes[4]).toBeChecked();
         expect(checkboxes[5]).toBeChecked();
         expect(checkboxes[6]).toBeChecked();
         expect(checkboxes[7]).toBeChecked();
         expect(checkboxes[3]).not.toBeChecked();

     });

     test('Shows the user profile Monica Geller', async () => {

         renderWithProviders(<Profile />, {
             supabaseOverrides: {
                 loggedInUser: MonicaGeller_NoOpRoles_CW_NonOpCW,
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

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         const namefield = screen.getByText('Monica');
         expect(namefield).toBeInTheDocument();
         const tables = screen.getAllByRole('table');
         expect(tables).toHaveLength(1);

         const checkboxes = screen.getAllByRole("checkbox");
         expect(checkboxes[0]).toBeChecked();
         expect(checkboxes[1]).toBeChecked();
         expect(checkboxes[2]).toBeChecked();
         expect(checkboxes[3]).toBeChecked();

     });

     test('Shows the user profile Ross Geller', async () => {

         renderWithProviders(<Profile />, {
             supabaseOverrides: {
                 loggedInUser: RossGeller_Op_CW_No_NonOp,
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

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         const namefield = screen.getByText('Ross');
         expect(namefield).toBeInTheDocument();
         const tables = screen.getAllByRole('table');
         expect(tables).toHaveLength(1);

         const checkboxes = screen.getAllByRole("checkbox");
         expect(checkboxes[0]).toBeChecked();
         expect(checkboxes[1]).not.toBeChecked();
         expect(checkboxes[2]).not.toBeChecked();
         expect(checkboxes[3]).not.toBeChecked();

     });

     test('No logged in user', async () => {

         renderWithProviders(<Profile />, {
             supabaseOverrides: {
                 loggedInUser: null,
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

         expect(screen.getByText('Personal Information')).toBeInTheDocument();
         expect(screen.getByText('Contact your company admin to change your email or permissions.')).toBeInTheDocument();
         
         

     });
    });