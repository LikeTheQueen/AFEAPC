import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import TestExecuteConnections from 'src/routes/systemConfigurations';

import { RachelGreen_AllPermissions_CW_NonOpCW,
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   testExecuteConnection: vi.fn(),
   testExecuteNewConnection: vi.fn(),
 }));
 
 vi.mock('provider/write', () => ({
     updateGLCodeMapping: vi.fn(),
 }));

 vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
   renderWithProviders(<TestExecuteConnections />, {
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

 describe('System Configurations',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows a dropdown of Operators that the user can select and test - runs successful test', async () => {
         (fetchProvider.testExecuteConnection as Mock)
             .mockResolvedValue({ ok: true, message: 'Success' });

         await setupWithSelections(user);

         expect(screen.getByText('Test the Current Execute Connection')).toBeInTheDocument();
         expect(screen.getByText(/Select an Operator and we'll poke the integration to make sure it's working./i)).toBeInTheDocument();

         const runTestButton = screen.getByRole('button', { name: /run test/i });
         const operatorSelect = screen.getAllByRole('combobox', { name: /Select an Operator to Test the Connection For:/i});
         expect(operatorSelect[0]).toBeInTheDocument();
         expect(runTestButton).toBeDisabled();
         await user.selectOptions(
             screen.getAllByRole('combobox')[0],
             RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name
         );

         await waitFor(() => {
            expect(operatorSelect[0]).toHaveValue(RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_id);
         })

         await waitFor(() => {
             expect(runTestButton).toBeEnabled();
         });

         await user.click(runTestButton);

         await waitFor(() => {
         expect(fetchProvider.testExecuteConnection).toHaveBeenLastCalledWith(RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_id, RachelGreen_AllPermissions_CW_NonOpCW.user_id);
            });

         expect(notifyStandard).toHaveBeenCalledWith(
             `API Integration passed.  This integration just struck oil.\n\n(TLDR: Successful connection)`
         );

         expect(screen.getAllByText(/AFE Partner Connections successfully connected to Execute./i)[0]).toBeVisible();
         const closeSidebarButton = screen.getAllByRole('button', { name: /close sidebar/i});
         expect(closeSidebarButton[0]).toBeVisible();

         await user.click(closeSidebarButton[0]);
         expect(screen.getAllByText(/AFE Partner Connections successfully connected to Execute./i)[0]).not.toBeVisible();
     });

     test('Shows a dropdown of Operators that the user can select and test - runs UNsuccessful test', async () => {
         (fetchProvider.testExecuteConnection as Mock)
             .mockResolvedValue({ ok: false, message: 'No Connection' });

         await setupWithSelections(user);

         expect(screen.getByText('Test the Current Execute Connection')).toBeInTheDocument();
         expect(screen.getByText(/Select an Operator and we'll poke the integration to make sure it's working./i)).toBeInTheDocument();

         const runTestButton = screen.getByRole('button', { name: /run test/i });
         expect(runTestButton).toBeDisabled();
         await user.selectOptions(
             screen.getAllByRole('combobox')[0],
             RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name
         );

         await waitFor(() => {
             expect(runTestButton).toBeEnabled();
         });

         await user.click(runTestButton);

         await waitFor(() => {
         expect(fetchProvider.testExecuteConnection).toHaveBeenLastCalledWith(RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_id, RachelGreen_AllPermissions_CW_NonOpCW.user_id);
            });

         expect(notifyFailure).toHaveBeenCalledWith(
             `API Integration failed.  This well isn't producing.\n\n(TLDR: Failed connection)`
         );

         expect(screen.getByText(/The test failed. The connection needs to be reconfigured. If you have a new API Key or Document ID please reach out to Support./i)).toBeVisible();
         const closeSidebarButton = screen.getAllByRole('button', { name: /close sidebar/i});
         expect(closeSidebarButton[0]).toBeVisible();

         await user.click(closeSidebarButton[0]);
         expect(screen.getByText(/The test failed. The connection needs to be reconfigured. If you have a new API Key or Document ID please reach out to Support./i)).not.toBeVisible();
     });

     test('Shows a dropdown of Operators that the user can select, enters keys and URL - runs successful test', async () => {
         (fetchProvider.testExecuteNewConnection as Mock)
             .mockResolvedValue({ ok: true, message: 'Success' });

         await setupWithSelections(user);

         expect(screen.getByText('Test the Current Execute Connection')).toBeInTheDocument();
         expect(screen.getByText(/Select an Operator and we'll poke the integration to make sure it's working./i)).toBeInTheDocument();

         const runTestButton = screen.getByRole('button', { name: /test and save/i });
         expect(runTestButton).toBeDisabled();
         await user.selectOptions(
             screen.getAllByRole('combobox')[1],
             RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name
         );

         await waitFor(() => {
             expect(runTestButton).toBeDisabled();
         });

         const eapikey = screen.getByLabelText('Execute API Key');
         expect(eapikey).toHaveValue('');
         expect(eapikey).toHaveAttribute('type', 'password');
         await user.type(eapikey,'password');
         await waitFor(() => {
            expect(eapikey).toHaveValue('password');
         });
         fireEvent.click(screen.getByLabelText('Toggle key visibility'));
         expect(eapikey).toHaveAttribute('type', 'text');

         const docID = screen.getByRole('textbox', { name: 'Execute Document ID'});
         expect(docID).toHaveValue('');
         const executeURl = screen.getByRole('textbox', { name: 'Execute Base URL'});
         expect(executeURl).toHaveValue('');
         await user.type(docID,'docID');
         expect(docID).toHaveValue('docID');
         await user.type(executeURl,'www.url.com');
         expect(executeURl).toHaveValue('www.url.com');

         await waitFor(() => {
            expect(runTestButton).toBeEnabled();
         });

         await user.click(runTestButton);

         await waitFor(() => {
            expect(fetchProvider.testExecuteNewConnection).toHaveBeenCalledWith(
                RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_id,
                RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name,
                'www.url.com',
                'docID',
                'password'
            )
         });

         expect(notifyStandard).toHaveBeenCalledWith(
             `API Integration passed.  This integration just struck oil.\n\n(TLDR: Successful connection)`
         );

         expect(screen.getAllByText(/AFE Partner Connections successfully connected to Execute./i)[1]).toBeVisible();
         const closeSidebarButton = screen.getAllByRole('button', { name: /close sidebar/i});
         console.log(closeSidebarButton.length,'the len')
         expect(closeSidebarButton[0]).toBeVisible();

         await user.click(closeSidebarButton[0]);
         expect(screen.getAllByText(/AFE Partner Connections successfully connected to Execute./i)[1]).not.toBeVisible();

     });

     test('Shows a dropdown of Operators that the user can select, enters keys and URL - runs UNsuccessful test', async () => {
         (fetchProvider.testExecuteNewConnection as Mock)
             .mockResolvedValue({ ok: false, message: 'No Connection' });

         await setupWithSelections(user);

         expect(screen.getByText('Test the Current Execute Connection')).toBeInTheDocument();
         expect(screen.getByText(/Select an Operator and we'll poke the integration to make sure it's working./i)).toBeInTheDocument();

         const runTestButton = screen.getByRole('button', { name: /test and save/i });
         expect(runTestButton).toBeDisabled();
         await user.selectOptions(
             screen.getAllByRole('combobox')[1],
             RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name
         );

         await waitFor(() => {
             expect(runTestButton).toBeDisabled();
         });

         const eapikey = screen.getByLabelText('Execute API Key');
         expect(eapikey).toHaveValue('');
         expect(eapikey).toHaveAttribute('type', 'password');
         await user.type(eapikey,'password');
         await waitFor(() => {
            expect(eapikey).toHaveValue('password');
         });
         fireEvent.click(screen.getByLabelText('Toggle key visibility'));
         expect(eapikey).toHaveAttribute('type', 'text');

         const docID = screen.getByRole('textbox', { name: 'Execute Document ID'});
         expect(docID).toHaveValue('');
         const executeURl = screen.getByRole('textbox', { name: 'Execute Base URL'});
         expect(executeURl).toHaveValue('');
         await user.type(docID,'docID');
         expect(docID).toHaveValue('docID');
         await user.type(executeURl,'www.url.com');
         expect(executeURl).toHaveValue('www.url.com');

         await waitFor(() => {
            expect(runTestButton).toBeEnabled();
         });

         await user.click(runTestButton);

         await waitFor(() => {
            expect(fetchProvider.testExecuteNewConnection).toHaveBeenCalledWith(
                RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_id,
                RachelGreen_AllPermissions_CW_NonOpCW.operatorRoles[0].apc_name,
                'www.url.com',
                'docID',
                'password'
            )
         });

         expect(notifyFailure).toHaveBeenCalledWith(
             `API Integration failed.  This well isn't producing.\n\n(TLDR: Failed connection)`
         );

         expect(screen.getByText(/The response returned an error: No Connection/i)).toBeVisible();
         const closeSidebarButton = screen.getAllByRole('button', { name: /close sidebar/i});
         expect(closeSidebarButton[0]).toBeVisible();

         await user.click(closeSidebarButton[0]);
         expect(screen.getByText(/The response returned an error: No Connection/i)).not.toBeVisible();

     });


    });