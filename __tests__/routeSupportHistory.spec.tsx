import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import SupportHistory from 'src/routes/support/routes/supportHistory';

import { RachelGreen_AllPermissions_CW_NonOpCW, loggedInUserIsSuperUser, userNoUserId
 } from './test-utils/afeRecords';

import { supportHistory } from './test-utils/supportHistory';

vi.mock('provider/fetch', () => ({
    fetchSupportHistory: vi.fn(),
}));

vi.mock('provider/write', () => ({
    createSupportTicket: vi.fn(),
    createSupportTicketThread: vi.fn(),
    updateSupportTicket: vi.fn(),
}));

const setupWithSelections = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SupportHistory />, {
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

const setupWithSelectionsSuperUser = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SupportHistory />, {
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
          app_metadata: [],
          user_metadata: {}
        }
      },
    }
  }); 
};

const setupWithSelectionsNoUserID = async (
  user: ReturnType<typeof userEvent.setup>,
  
) => {
  renderWithProviders(<SupportHistory />, {
    supabaseOverrides: {
      loggedInUser: userNoUserId,
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

describe('View and support tickets',() => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
    user = userEvent.setup();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();

    });

    test('Loads screen and allows user to send comment', async () => {
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue(supportHistory);
        
                await setupWithSelections(user);
                expect(fetchProvider.fetchSupportHistory).toHaveBeenCalledTimes(1);

        expect(screen.getByText('Support History')).toBeInTheDocument();
        expect(screen.getByText('You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it.')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText(/This is another issue that I have and it's a really long text and I need to limit the length of the subject instead of it going and going and going and going/i)).toBeInTheDocument();
          expect(screen.getByText(/I have this issue you see/i)).toBeInTheDocument();
          expect(screen.getAllByText(/Nov 29, 2025/i)[0]).toBeInTheDocument();
        });

        const commentField = screen.getAllByRole('textbox', { name: 'Add your comment' });
        expect(commentField[0]).toBeInTheDocument();

        await user.type(commentField[0], 'Can I get help on this?');

        const commentButton = screen.getAllByRole('button', { name: /comment/i });
        
        expect(commentButton[0]).not.toBeDisabled();
        expect(commentButton[1]).toBeDisabled();

        await user.click(commentButton[0]);
        

        expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get help on this?', expect.any(Date), 2);
        
    });

    test('No calls for support tickets are made if the user is no logged in', async () => {
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue(supportHistory);
        
                await setupWithSelectionsNoUserID(user);
                expect(fetchProvider.fetchSupportHistory).toHaveBeenCalledTimes(0);

        expect(screen.getByText('Support History')).toBeInTheDocument();
        expect(screen.getByText('You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it.')).toBeInTheDocument();

    });

    test('Loads screen and allows Super User to send comment and resolve', async () => {
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue(supportHistory);
        
                await setupWithSelectionsSuperUser(user);
                expect(fetchProvider.fetchSupportHistory).toHaveBeenCalledTimes(1);

        expect(screen.getByText('Support History')).toBeInTheDocument();
        expect(screen.getByText('You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it.')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText(/This is another issue that I have and it's a really long text and I need to limit the length of the subject instead of it going and going and going and going/i)).toBeInTheDocument();
          expect(screen.getByText(/I have this issue you see/i)).toBeInTheDocument();
          expect(screen.getAllByText(/Nov 29, 2025/i)[0]).toBeInTheDocument();
        });

        const commentField = screen.getAllByRole('textbox', { name: 'Add your comment' });
        const resolutionField = screen.getAllByRole('textbox', { name: 'Resolution' });

        expect(commentField[0]).toBeInTheDocument();
        expect(resolutionField[0]).toBeInTheDocument();

        await user.type(commentField[0], 'Can I get more details');

        const commentButton = screen.getAllByRole('button', { name: /comment/i });
        const resolveButton = screen.getAllByRole('button', { name: /close ticket/i });

        expect(resolveButton[0]).not.toBeDisabled();
        
        expect(commentButton[0]).not.toBeDisabled();
        expect(commentButton[1]).toBeDisabled();

        await user.click(commentButton[0]);

        expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get more details', expect.any(Date), 2);

        await user.type(resolutionField[0], 'Nevermind I fix');

        await user.click(resolveButton[0]);

        expect(writeProvider.updateSupportTicket).toHaveBeenCalledWith(2, false, "13e69340-d14c-45a9-96a8-142795925487","Nevermind I fix");
        
    });
});