import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import * as emailProvider from '../email/emailBasic';
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import SupportHistory from 'src/routes/support/routes/supportHistory';

import { RachelGreen_AllPermissions_CW_NonOpCW, loggedInUserIsSuperUser, userNoUserId
 } from './test-utils/afeRecords';

import { supportHistory, singleTicketThreadResponse, orginalTicketUpdatedResponse } from './test-utils/supportHistory';
import { supportEmail } from 'src/constants/variables';
import { data } from 'react-router';

vi.mock('../email/emailBasic', () => ({
  handleSendEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
}));

vi.mock('provider/fetch', () => ({
    fetchSupportHistory: vi.fn(),
}));

vi.mock('provider/write', () => ({
    createSupportTicket: vi.fn(),
    createSupportTicketThread: vi.fn(),
    updateSupportTicket: vi.fn(),
}));

vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
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
      (emailProvider.handleSendEmail as Mock).mockResolvedValue({ ok: true });
      (writeProvider.createSupportTicketThread as Mock)
          .mockResolvedValueOnce({ok: true, data: singleTicketThreadResponse, message: null});
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:true, data:supportHistory, message:null});
        
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
        
        await waitFor(() => {
        expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get help on this?', expect.any(Date), 2);
        });

        await waitFor(() => {
              
              expect(emailProvider.handleSendEmail).toHaveBeenCalledWith(
                'New comment on ticket #2',
                `${RachelGreen_AllPermissions_CW_NonOpCW.firstName} ${RachelGreen_AllPermissions_CW_NonOpCW.lastName} has added a new comment: Can I get help on this?`,
                'elizabeth.shaw@afepartner.com',
                RachelGreen_AllPermissions_CW_NonOpCW.email,
                RachelGreen_AllPermissions_CW_NonOpCW.firstName,
                RachelGreen_AllPermissions_CW_NonOpCW.email,
                "https://afepartner.com/mainscreen/supporthistory"
              );

              expect(commentField[0]).toHaveValue('');
            });
        
    });

    test('Error saving comment', async () => {
      (emailProvider.handleSendEmail as Mock).mockResolvedValue({ ok: true });
      (writeProvider.createSupportTicketThread as Mock)
          .mockResolvedValueOnce({ok: false, data: null, message: 'Error Message'});
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:true, data:supportHistory, message:null});
        
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
        
        await waitFor(() => {
        expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get help on this?', expect.any(Date), 2);
        });

        expect(notifyFailure).toHaveBeenCalledWith(
              `Unable to save comment.  Please try again or contact AFE Partner Support @ ${supportEmail}`
            );
        
    });

    test('No calls for support tickets are made if the user is not logged in', async () => {
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:true, data:supportHistory, message:null});
        
                await setupWithSelectionsNoUserID(user);
                expect(fetchProvider.fetchSupportHistory).toHaveBeenCalledTimes(0);

        expect(screen.getByText('Support History')).toBeInTheDocument();
        expect(screen.getByText('You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it.')).toBeInTheDocument();
        expect(screen.getByText('There are no support tickets to view')).toBeInTheDocument();
        expect(screen.getByText('There are no support tickets to view')).not.toBeVisible();

    });

    test('Shows an error when the call for Support Tickets fails', async () => {
        
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:false, data:[], message: 'Error Message in the test'});
        
        await setupWithSelections(user);
        
        await waitFor(() => {
        expect(fetchProvider.fetchSupportHistory).toHaveBeenCalledTimes(1);
          });
        
          expect(screen.getByText('Support History')).toBeInTheDocument();
        expect(screen.getByText('You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it.')).toBeInTheDocument();
        
        screen.debug();
        
        await waitFor(() => {
        expect(screen.getByText('There are no support tickets to view')).toBeInTheDocument();
        expect(screen.getByText('There are no support tickets to view')).not.toBeVisible();
        });
        expect(screen.getByText('Error Message in the test')).toBeInTheDocument();
        expect(screen.getByText('Error Message in the test')).toBeVisible();

    });

    test('Loads screen and allows Super User to send comment and resolve', async () => {
        (emailProvider.handleSendEmail as Mock).mockResolvedValueOnce({ ok: true });
        (emailProvider.handleSendEmail as Mock).mockResolvedValueOnce({ ok: true });
        (writeProvider.createSupportTicketThread as Mock)
          .mockResolvedValueOnce({ok: true, data: singleTicketThreadResponse, message: null});
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:true, data:supportHistory, message:null});
        (writeProvider.updateSupportTicket as Mock)
          .mockResolvedValue({ok:true, data:orginalTicketUpdatedResponse, message:null});
        
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

        await waitFor(() => {
          expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get more details', expect.any(Date), 2);
        });

      await waitFor(() => {

        expect(emailProvider.handleSendEmail).toHaveBeenNthCalledWith(
          1,
          'New comment on ticket #2',
          `${loggedInUserIsSuperUser.firstName} ${loggedInUserIsSuperUser.lastName} has added a new comment: Can I get more details`,
          'eandv3851@gmail.com',
          'elizabeth.shaw@afepartner.com',
          loggedInUserIsSuperUser.firstName,
          'AFE Partner Connections',
          "https://afepartner.com/mainscreen/supporthistory"
        );

        expect(commentField[0]).toHaveValue('');
      });

        await user.type(resolutionField[0], 'Nevermind I fix');

        await user.click(resolveButton[0]);

        await waitFor(() => {
        expect(writeProvider.updateSupportTicket).toHaveBeenCalledWith(2, false, "13e69340-d14c-45a9-96a8-142795925487","Nevermind I fix");
        });

        await waitFor(() => {

        expect(emailProvider.handleSendEmail).toHaveBeenNthCalledWith(
          2,
          `Ticket Resolved for: ${orginalTicketUpdatedResponse.subject}`,
          `${loggedInUserIsSuperUser.firstName} ${loggedInUserIsSuperUser.lastName} has resolved this ticket: ${orginalTicketUpdatedResponse.resolution}`,
          `${orginalTicketUpdatedResponse.created_by_email}`,
          'elizabeth.shaw@afepartner.com',
          loggedInUserIsSuperUser.firstName,
          loggedInUserIsSuperUser.email,
          "https://afepartner.com/mainscreen/supporthistory"
        );

        expect(commentField[0]).toHaveValue('');
      });


        
    });

    test('Loads screen and allows Super User to send comment but resolve fails', async () => {
        (emailProvider.handleSendEmail as Mock).mockResolvedValueOnce({ ok: true });
        (emailProvider.handleSendEmail as Mock).mockResolvedValueOnce({ ok: true });
        (writeProvider.createSupportTicketThread as Mock)
          .mockResolvedValueOnce({ok: true, data: singleTicketThreadResponse, message: null});
        (fetchProvider.fetchSupportHistory as Mock)
                  .mockResolvedValue({ok:true, data:supportHistory, message:null});
        (writeProvider.updateSupportTicket as Mock)
          .mockResolvedValue({ok:false, data: null, message: 'Returned Error'});
        
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

        await waitFor(() => {
          expect(writeProvider.createSupportTicketThread).toHaveBeenCalledWith('Can I get more details', expect.any(Date), 2);
        });

      await waitFor(() => {

        expect(emailProvider.handleSendEmail).toHaveBeenNthCalledWith(
          1,
          'New comment on ticket #2',
          `${loggedInUserIsSuperUser.firstName} ${loggedInUserIsSuperUser.lastName} has added a new comment: Can I get more details`,
          'eandv3851@gmail.com',
          'elizabeth.shaw@afepartner.com',
          loggedInUserIsSuperUser.firstName,
          'AFE Partner Connections',
          "https://afepartner.com/mainscreen/supporthistory"
        );

        expect(commentField[0]).toHaveValue('');
      });

        await user.type(resolutionField[0], 'Nevermind I fix');

        await user.click(resolveButton[0]);

        await waitFor(() => {
        expect(writeProvider.updateSupportTicket).toHaveBeenCalledWith(2, false, "13e69340-d14c-45a9-96a8-142795925487","Nevermind I fix");
        });

        expect(notifyFailure).toHaveBeenCalledWith(
              `The ticket resolution did not save.  Check the Logs`
            );

        


        
    });
});