import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import { transformSingleAFE } from 'src/types/transform';


import AFEDetailURL from '../src/routes/afeDashboard/routes/afeDetail';

import { MonicaGeller_NoOpRoles_CW_NonOpCW, afesReturnedFromSupabase } from './test-utils/afeRecords';

import { RachelGreen_AllPermissions_CW_NonOpCW,
    OperatorDropDown,
    PartnerDropdown,
    partnerAccountCodes
 } from './test-utils/afeRecords';

 vi.mock('provider/fetch', () => ({
   fetchAFEDetails: vi.fn(),
    fetchAFEHistory: vi.fn(),
    fetchAFEEstimates: vi.fn(),
    fetchAFEDocs: vi.fn(),
    fetchAFEAttachments: vi.fn(),
    fetchAFESignedNonOp: vi.fn(),
    fetchAFEWells: vi.fn(),
    fetchRelatedDocuments: vi.fn(),
    addAFEHistorySupabase: vi.fn(() => Promise.resolve({ id: 999 })),
 }));
 
 vi.mock('provider/write', () => ({
    updateAFEPartnerStatus: vi.fn().mockResolvedValue({ ok: true, data: null }),
    insertAFEHistory: vi.fn().mockResolvedValue({ ok: true, data:{ afe_id:1,  description:'Did',type: 'Viewed' } }),
 }));

 vi.mock('src/helpers/helpers', () => ({
     notifyStandard: vi.fn(),
     notifyFailure: vi.fn(),
 }));

 vi.mock('src/routes/afeDashboard/routes/helpers/styleHelpers', () => ({
   setStatusTextColor: vi.fn((status) => status),
   setStatusBackgroundColor: vi.fn((status) => status),
   setStatusRingColor: vi.fn((status) => status),
   handleThePartnerStatusChange: vi.fn(),
 }));
  
 vi.mock('src/routes/afeDashboard/routes/helpers/helpers', () => ({
   handleOperatorArchiveStatusChange: vi.fn(),
   handlePartnerArchiveStatusChange: vi.fn(),
   handleThePartnerStatusChange: vi.fn()
 }));
 
 vi.mock('xlsx', () => ({
   utils: {
     json_to_sheet: vi.fn(() => ({})),
     book_new: vi.fn(() => ({})),
     book_append_sheet: vi.fn(),
   },
   writeFile: vi.fn(),
 }));
 
 const setupWithSelections = async (
   user: ReturnType<typeof userEvent.setup>
 ) => {
    const afeID = afesReturnedFromSupabase[6].id;
    const afeDetailRoute = `/mainscreen/afeDetail/${afeID}`;
    const afeDetailPath = '/mainscreen/afeDetail/:afeID';
   renderWithProviders(<AFEDetailURL />, {
    routePath: afeDetailRoute,
    routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
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

 describe('View AFE Details',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
 
     test('Shows the user they cannot access the AFE', async () => {
        (fetchProvider.fetchAFEDetails as Mock)
                 .mockResolvedValue({ ok: true, data: afesReturnedFromSupabase[6] });
                 
             await setupWithSelections(user);
 
         
 
     });

     test('Fetches the mapped account codes when a user selects the dropdowns and let user delete one', async () => {
             (fetchProvider.fetchMappedGLAccountCode as Mock)
                 .mockResolvedValue({ ok: true, data: [] });
             await setupWithSelections(user);

             expect(notifyStandard).toHaveBeenCalledWith(
      "Your support ticket has been logged and is now in the pipeline.  Sit tight while we pressure test the issue and bring it up to production."
    );
     });
    });