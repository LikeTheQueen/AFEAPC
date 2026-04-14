import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import * as emailProvider from '../email/emailBasic';
import { notifyStandard } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import ContactSupport from 'src/routes/support/routes/contactSupport';

import { RachelGreen_AllPermissions_CW_NonOpCW
 } from './test-utils/afeRecords';

 vi.mock('../email/emailBasic', () => ({
  handleSendEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
}));
 
 vi.mock('provider/write', () => ({
     createSupportTicket: vi.fn(),
 }));

 vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
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

 describe('Contact Support',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
     });
 
     test('Shows the user a form to submit ticket', async () => {
 
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
 
         expect(screen.getByText('Oh hey there!')).toBeInTheDocument();
         expect(screen.getByText(/So glad you stopped by./i)).toBeInTheDocument();
 
     });

     test('User fills in subect and message and tests submit button', async () => {
         await setupWithSelections(user);

         expect(screen.getByText('Oh hey there!')).toBeInTheDocument();
         expect(screen.getByText(/So glad you stopped by./i)).toBeInTheDocument();

         const submitButton = screen.getByRole('button', { name: /submit/i });
         expect(submitButton).toBeDisabled();

         const subjectBox = screen.getByRole('textbox', { name: 'Subject' });
         expect(subjectBox).toBeInTheDocument();

         const messageBox = screen.getByRole('textbox', { name: 'Message' });
         expect(messageBox).toBeInTheDocument();

         await user.type(subjectBox, 'I want to contact you');
         expect(subjectBox).toHaveValue('I want to contact you');

         await user.type(messageBox, 'About this thing');
         expect(messageBox).toHaveValue('About this thing');

         expect(submitButton).not.toBeDisabled();

         await user.clear(messageBox);
         expect(messageBox).toHaveValue('');

         expect(submitButton).toBeDisabled();

         await user.type(messageBox, 'About this thing');
         expect(messageBox).toHaveValue('About this thing');

         await user.clear(subjectBox);

         expect(submitButton).toBeDisabled();

         await user.type(subjectBox, 'I want to contact you');
         expect(subjectBox).toHaveValue('I want to contact you');

         expect(submitButton).not.toBeDisabled();

     });

     test('User fills in subect and message and tests submit button', async () => {
        (emailProvider.handleSendEmail as Mock).mockResolvedValue({ ok: true });
         await setupWithSelections(user);

         expect(screen.getByText('Oh hey there!')).toBeInTheDocument();
         expect(screen.getByText(/So glad you stopped by./i)).toBeInTheDocument();

         const submitButton = screen.getByRole('button', { name: /submit/i });
         expect(submitButton).toBeDisabled();

         const subjectBox = screen.getByRole('textbox', { name: 'Subject' });
         expect(subjectBox).toBeInTheDocument();

         const messageBox = screen.getByRole('textbox', { name: 'Message' });
         expect(messageBox).toBeInTheDocument();

         await user.type(subjectBox, 'I want to contact you');
         expect(subjectBox).toHaveValue('I want to contact you');

         await user.type(messageBox, 'About this thing');
         expect(messageBox).toHaveValue('About this thing');

         expect(submitButton).not.toBeDisabled();

         await user.click(submitButton);

         await waitFor(() => {
      
      expect(emailProvider.handleSendEmail).toHaveBeenNthCalledWith(
        1,
        'I want to contact you',
        'About this thing',
        'elizabeth.shaw@afepartner.com',
        RachelGreen_AllPermissions_CW_NonOpCW.email,
        RachelGreen_AllPermissions_CW_NonOpCW.firstName,
        RachelGreen_AllPermissions_CW_NonOpCW.email,
      );

      // Confirmation email sent second
      expect(emailProvider.handleSendEmail).toHaveBeenNthCalledWith(
        2,
        'Your Support Ticket has been received',
        'We have received your support request.',
        RachelGreen_AllPermissions_CW_NonOpCW.email,
        'AFE Partner Connections',
        RachelGreen_AllPermissions_CW_NonOpCW.firstName,
        'AFE Partner Connections',
      );

    expect(writeProvider.createSupportTicket).toHaveBeenCalledWith('I want to contact you', 'About this thing');

     
    expect(notifyStandard).toHaveBeenCalledWith(
      "Your support ticket has been logged and is now in the pipeline.  Sit tight while we pressure test the issue and bring it up to production."
    );
  
      expect(screen.getByRole('textbox', { name: /subject/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /message/i })).toHaveValue(''); 
    
    });
     });

    });