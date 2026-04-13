import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import ContactSupport from 'src/routes/support/routes/contactSupport';

import { RachelGreen_AllPermissions_CW_NonOpCW
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   fetchMappedGLAccountCode: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     updateGLCodeMapping: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<ContactSupport />, {
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

 describe('View and Edit Operators',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows a list of Operators and Partners to the user for mapping', async () => {
 
         renderWithProviders(<ContactSupport />, {
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
 
         expect(screen.getByText('View and Manage you GL Account Code Mappings')).toBeInTheDocument();
         expect(screen.getByText('Select both an Operator and Your Company as a Partner from the dropdowns to view the GL Account Code Mappings.')).toBeInTheDocument();
 
     });

     test('Fetches the mapped account codes when a user selects the dropdowns and let user delete one', async () => {
             (fetchProvider.fetchMappedGLAccountCode as Mock)
                 .mockResolvedValue({ ok: true, data: [] });
             await setupWithSelections(user);
     });
    });