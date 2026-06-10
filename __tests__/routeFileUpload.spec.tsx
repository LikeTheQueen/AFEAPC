import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';


import FileUpload from 'src/routes/sharedComponents/fileUpload';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    OperatorDropDown,
    PartnerDropdown,
    partnerAccountCodes,
    apc_op_id_CWz,
    apc_partner_id_McKen,
    PheobeBuffett_NoUserEditRights_McKenzie
 } from './test-utils/afeRecords';
import { handleSendEmail } from 'email/emailBasic';

    vi.mock('../sharedComponents/fileUpload', async (importOriginal) => {
    const actual = await importOriginal() as Record<string, unknown>
    return {
        ...actual,
        sha256: vi.fn().mockResolvedValue('mocked-checksum'),
    }
    });

 vi.mock('provider/fetch', () => ({
   fetchEmailsNonOperator: vi.fn(),
   fetchEmailsOperator: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     insertAFEHistory: vi.fn(),
     insertAFEDocument: vi.fn(),
     insertAFEDocumentRecord: vi.fn(),
 }));

 vi.mock('../email/emailBasic', () => ({
  handleSendEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
  sendAFEStatusChangeEmailToOperator: vi.fn().mockResolvedValue(undefined),
  sendAFEStatusChangeEmailToPartner: vi.fn().mockResolvedValue(undefined),
}));

 vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<FileUpload
    apc_afe_id='7a69eb26-e0ce-436d-88db-d114db6a1f2b'
    apc_op_id={apc_op_id_CWz}
    apc_part_id={apc_partner_id_McKen}
    userName='Pheobe Buffett'
    apc_partner_name='Mckenzie Oil'
    apc_operator_name='Corr and Whit Oils Company & Friends'
    afe_number='26D014R'
    afe_version='Base'
    mode='Partner'
    token='test-token'
    />, {
     supabaseOverrides: {
       loggedInUser: PheobeBuffett_NoUserEditRights_McKenzie,
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
 };

 const setupWithSelectionsOperator = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<FileUpload
    apc_afe_id='7a69eb26-e0ce-436d-88db-d114db6a1f2b'
    apc_op_id={apc_op_id_CWz}
    apc_part_id={apc_partner_id_McKen}
    userName='Pheobe Buffett'
    apc_partner_name='Mckenzie Oil'
    apc_operator_name='Corr and Whit Oils Company & Friends'
    afe_number='26D014R'
    afe_version='Base'
    mode='Operator'
    token='test-token'
    />, {
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
 };

 describe('File Upload',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     vi.spyOn(crypto.subtle, 'digest').mockResolvedValue(new ArrayBuffer(32));
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows the File Upload field and option for non op agreement from the Partner POV', async () => {
        (writeProvider.insertAFEDocument as Mock)
        .mockResolvedValue({ ok: true });
        (writeProvider.insertAFEDocumentRecord as Mock)
        .mockResolvedValue({ ok: true });
        (fetchProvider.fetchEmailsOperator as Mock)
        .mockResolvedValue({
            ok: true,
            data:['eandv3851@gmail.com']
        })
 
        setupWithSelections(user);
        
        expect(screen.getByText('No File Chosen')).toBeInTheDocument();
        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeEnabled();
        await user.click(chooseFileButton);
        const mockBuffer = new ArrayBuffer(12);
        const mockFile = new File(['dummy content'], 'afe-signed.pdf', { type: 'application/pdf' });

        mockFile.arrayBuffer = vi.fn().mockResolvedValue(mockBuffer);

        const fileInput = document.querySelector('input[type="file"]')!
        fireEvent.change(fileInput, {
            target: { files: [mockFile] }
        });

        expect(screen.getByRole('button', { name: /save file/i })).toBeDisabled();

        const fieldset = screen.getByRole('group', { name: /signed non-op afe/i });
        const yesRadio = within(fieldset).getByRole('radio', { name: /yes/i });
        expect(yesRadio).not.toBeChecked();

        await user.click(yesRadio);

        expect(screen.getByRole('button', { name: /save file/i })).toBeEnabled();

        await user.click(screen.getByRole('button', { name: /save file/i }));

        expect(writeProvider.insertAFEDocument).toHaveBeenCalledWith(
        expect.stringMatching(/^afe\/.+\/attachments\/[\d.]+\.pdf$/),
        mockFile,
        'test-token'
        );
        
        expect(writeProvider.insertAFEDocumentRecord).toHaveBeenCalledWith(
            '7a69eb26-e0ce-436d-88db-d114db6a1f2b',
            apc_op_id_CWz,
            apc_partner_id_McKen,
            expect.stringMatching(/^afe\/.+\/attachments\/[\d.]+\.pdf$/),
            'afe-signed.pdf',
            'afe-signed',
            'pdf',
            12,
            "0000000000000000000000000000000000000000000000000000000000000000",
            true,
            'test-token'
        );

        expect(fetchProvider.fetchEmailsOperator).toHaveBeenLastCalledWith(apc_op_id_CWz,'test-token');

        expect(writeProvider.insertAFEHistory).toHaveBeenLastCalledWith(
            '7a69eb26-e0ce-436d-88db-d114db6a1f2b',
            'The signed AFE has been uploaded by Pheobe Buffett for Mckenzie Oil',
            'action',
            'test-token'
        );

        expect(handleSendEmail).toHaveBeenCalled();
        expect(notifyStandard).toHaveBeenCalledWith('Upload complete. The operation ran without incident.');

     });

     test('Shows the File Upload field and option for non op agreement from the Operator POV', async () => {
        (writeProvider.insertAFEDocument as Mock)
        .mockResolvedValue({ ok: true });
        (writeProvider.insertAFEDocumentRecord as Mock)
        .mockResolvedValue({ ok: true });
        (fetchProvider.fetchEmailsNonOperator as Mock)
        .mockResolvedValue({
            ok: true,
            message:'',
            data:['eandv3851@gmail.com']
        })
 
        setupWithSelectionsOperator(user);
        
        expect(screen.getByText('No File Chosen')).toBeInTheDocument();
        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeEnabled();
        await user.click(chooseFileButton);
        const mockBuffer = new ArrayBuffer(12);
        const mockFile = new File(['dummy content'], 'afe-signed.pdf', { type: 'application/pdf' });

        mockFile.arrayBuffer = vi.fn().mockResolvedValue(mockBuffer);

        const fileInput = document.querySelector('input[type="file"]')!
        fireEvent.change(fileInput, {
            target: { files: [mockFile] }
        });

        expect(screen.getByRole('button', { name: /save file/i })).toBeEnabled();

        const fieldset = screen.queryByRole('group', { name: /signed non-op afe/i });
        expect(fieldset).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /save file/i }));

        expect(writeProvider.insertAFEDocument).toHaveBeenCalledWith(
        expect.stringMatching(/^afe\/.+\/attachments\/[\d.]+\.pdf$/),
        mockFile,
        'test-token'
        );
        
        expect(writeProvider.insertAFEDocumentRecord).toHaveBeenCalledWith(
            '7a69eb26-e0ce-436d-88db-d114db6a1f2b',
            apc_op_id_CWz,
            apc_partner_id_McKen,
            expect.stringMatching(/^afe\/.+\/attachments\/[\d.]+\.pdf$/),
            'afe-signed.pdf',
            'afe-signed',
            'pdf',
            12,
            "0000000000000000000000000000000000000000000000000000000000000000",
            false,
            'test-token'
        );

        expect(fetchProvider.fetchEmailsNonOperator).toHaveBeenLastCalledWith(apc_partner_id_McKen, 'test-token');

        expect(writeProvider.insertAFEHistory).toHaveBeenLastCalledWith(
            '7a69eb26-e0ce-436d-88db-d114db6a1f2b',
            'An attachment has been uploaded by Pheobe Buffett for Corr and Whit Oils Company & Friends',
            'action',
            'test-token'
        );

        expect(handleSendEmail).toHaveBeenCalled();
        expect(notifyStandard).toHaveBeenCalledWith('Upload complete. The operation ran without incident.');

     });
    });