
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import LoadingPage from 'src/routes/sharedComponents/loadingPage';

import { RachelGreen_AllPermissions_CW_NonOpCW
 } from './test-utils/afeRecords';

 

 describe('Loading Page',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows the laoding page', async () => {
 
         renderWithProviders(<LoadingPage />, {
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
 
         expect(screen.getByText(/loading/i)).toBeInTheDocument();
          
     });

    });