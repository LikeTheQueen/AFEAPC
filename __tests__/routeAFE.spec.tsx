vi.mock('../provider/supabase', () => ({
  supabase: {
    rpc: vi.fn()
  }
}));
import AFE from '../src/routes/afeDashboard/routes/afe';
import { formatDate, formatDateShort } from "../src/helpers/styleHelpers";
import * as fetchProvider from '../provider/fetch';
import * as writeProvider from "provider/write";
import * as emailProvider from '../email/emailBasic';
import { vi, type Mock } from 'vitest';
import { cleanup, getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import {
  afesReturnedFromSupabase,
  afesReturnedFromSupabaseDynamicDate,
  RachelGreen_AllPermissions_CW_NonOpCW,
  RossGeller_Op_CW_No_NonOp,
  MonicaGeller_NoOpRoles_CW_NonOpCW,
  OperatorDropDown,
  PartnerDropdown,
  loggedInUserIsSuperUser
} from './test-utils/afeRecords';
import { rachelGreenAllRolesActive } from './test-utils/routeCreateEditUsersHelpersVariables';

vi.mock('../provider/fetch', () => ({
  updateAFEPartnerStatusSupabase: vi.fn(),
  addAFEHistorySupabase: vi.fn(),
  fetchAFEs: vi.fn(),
  fetchAllOperators: vi.fn(), 
  fetchAllPartners: vi.fn(),
}));

vi.mock('provider/write', () => ({
  updateAFEPartnerStatus: vi.fn().mockResolvedValue({ ok: true, data: null }),
  insertAFEHistory: vi.fn(),
}));

vi.mock('../email/emailBasic', () => ({
  handleSendEmail: vi.fn().mockResolvedValue(undefined),
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
}));


describe('displaying AFEs', () => {
  beforeEach(() => {
    cleanup();
    vi.mocked(fetchProvider.fetchAllOperators as Mock).mockResolvedValue(OperatorDropDown);
    vi.mocked(fetchProvider.fetchAllPartners as Mock).mockResolvedValue(PartnerDropdown);
    vi.mocked(fetchProvider.fetchAFEs).mockResolvedValue({ ok: true, data: afesReturnedFromSupabase });
    vi.mocked(writeProvider.updateAFEPartnerStatus).mockResolvedValue({ ok: true, data: {id: '', status: 'New' } });
  });

    afterEach(async() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
        cleanup();
        await new Promise(resolve => setTimeout(resolve, 200));
    })

  test('Show all elements for Non Op AFEs when a user logs in, Operated AFE Elements on Operated tab and both, without filters, on All AFEs tab', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.queryByTestId('Non-OperatedAFElistHeader')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('OperatedAFElistHeader')[0]).toBeVisible();
    //Second AFE Header
    expect(screen.getAllByTestId('OperatedAFElistHeader')[1]).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('Non-OperatedAFElistFilter')).not.toBeInTheDocument();
    
    //No AFEs Message (there are none)
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[0]).not.toBeVisible(); 
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[1]).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

    const allAFETab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(allAFETab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();

    //AFE Filters
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });
    

  });

  test('Show all elements for Non Op AFEs when a user logs in and hides anything related to Operated AFEs when a user (Monica Geller) logs in and does not have Operated AFE permissions', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.queryByTestId('Non-OperatedAFElistHeader')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('OperatedAFElistHeader')[0]).toBeVisible();
    //Second AFE Header
    expect(screen.getAllByTestId('OperatedAFElistHeader')[1]).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.queryByTestId('Non-OperatedAFElistFilter')).not.toBeInTheDocument();
    
    //No AFEs Message (there are none)
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[0]).toBeVisible(); 
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[1]).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const allAFETab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(allAFETab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();

    //AFE Filters
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });
    

  });

  test('Hides all elements for Non Op AFEs when a user logs in and hides anything related to Non-Operated AFEs when a user (Ross Geller) logs in and does not have Non-Operated AFE permissions', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.queryByTestId('Non-OperatedAFElistHeader')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('OperatedAFElistHeader')[0]).toBeVisible();
    //Second AFE Header
    expect(screen.getAllByTestId('OperatedAFElistHeader')[1]).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('Non-OperatedAFElistFilter')).not.toBeInTheDocument();
    
    //No AFEs Message (there are none)
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[0]).not.toBeVisible(); 
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[1]).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

    const allAFETab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(allAFETab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();

    //AFE Filters
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));

  });

  test('Shows Non-Operated AFEs when a user (Rachel Green) logs in', async () => {
     
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    });
    
    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });
   

  });

  test('Shows Non-Operated AFEs and hides anything related to Operated AFEs when a user (Monica Geller) logs in and only has permission for NonOp AFEs', async () => {
     
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.getByRole("link", { name: /099D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });
   
  });

  test('Shows no AFE for a user (Ross Geller) that does not have view rights to see Non Op AFEs', async () => {
     
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search (Rachel Green)', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
      expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    });

    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'06D111N');

    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
      expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).toBeVisible();
    });

    

  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search (Rachel Green) fuzzy search', async () => {
    const user = userEvent.setup();

    (writeProvider.updateAFEPartnerStatus as Mock).mockReturnValue({
      ok: true,
      data: { id: '2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb', status: 'Viewed'}
    });

    (emailProvider.handleSendEmail as Mock).mockImplementation(() => 
  Promise.resolve({ ok: true })
);
    renderWithProviders(<AFE />, {
      routes: [
      { path: '/', element: <AFE /> },
      { path: '/afeDetail/:afeID', element: <div>AFE Detail</div> },
    ],
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
      expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    });

    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'06');
  
    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("link", { name: /06D111JC/i }));

    await waitFor(() => {
      expect(writeProvider.updateAFEPartnerStatus).toHaveBeenCalledWith('2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb','Viewed','test-token');
      expect(emailProvider.handleSendEmail).toHaveBeenCalledWith(
        'Your AFE has been viewed by Rachel at Corr and Whit Oils',
        'This message is to let you know that your AFE has been viewed!',
        'John Ross Exploration Inc',
        'Corr and Whit Oils',
        "AFE Partner Connections",
        RachelGreen_AllPermissions_CW_NonOpCW.email,
        `https://www.afepartner.com/mainscreen/afeDetail/2b3c4d5e-0002-4bbb-9000-bbbbbbbbbbbb`,
        'View AFE'
      )
    });

    await waitFor(() => {
  expect(screen.getByText('AFE Detail')).toBeInTheDocument();
});
await new Promise(resolve => setTimeout(resolve, 150));
    
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using Partner Status search (Rachel Green)', async () => {
    const user = userEvent.setup();

     
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
      expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    });

    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    const partnerStatusSearch = screen.getByRole('combobox', { name: /Select Partner Status/i });
    await user.selectOptions(partnerStatusSearch,'Approved')
  
    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).toBeVisible(); 
  
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see, only 1 they should see, when using Partner Status search (Rachel Green)', async () => {
    const user = userEvent.setup();

     
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
      expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible();
    });

    const partnerStatusSearch = screen.getByRole('combobox', { name: /Select Partner Status/i });
    await user.selectOptions(partnerStatusSearch,'New')
  
    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /06D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
   
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see, when using Operator Approval Days Ago search (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabaseDynamicDate
  });
    renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
      expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible();
    });

    const operatorApprovalSearch = screen.getByRole('combobox', { name: /Approval Days Ago/i });
    await user.selectOptions(operatorApprovalSearch,'1 week ago')
  
    await waitFor(() => {

      expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /099D111JC/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible();
   
  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs in the mobile menu and has view rights (Rachel Green)', async () => {
    const user = userEvent.setup();

     
    
  renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('combobox', { name: /select a tab/i });
    await user.selectOptions(operatedTab, '2');

    await waitFor(() => {
    //First AFE Header
    expect(screen.queryByTestId('Non-OperatedAFElistHeader')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('OperatedAFElistHeader')[0]).toBeVisible();
    //Second AFE Header
    expect(screen.getAllByTestId('OperatedAFElistHeader')[1]).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('Non-OperatedAFElistFilter')).not.toBeInTheDocument();
    
    //No AFEs Message (there are none)
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[0]).not.toBeVisible(); 
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[1]).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

    const allAFETab = screen.getByRole('combobox', { name: /select a tab/i });
    await user.selectOptions(allAFETab, '3');

    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();

    //AFE Filters
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs and has view rights (Ross Geller)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabaseDynamicDate
  });
    
  renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /06D111CJ/i })).toBeVisible();
      expect(screen.getByRole("link", { name: /25D001CA S2/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    const operatorApprovalSearch = screen.getByRole('combobox', { name: /Approval Days Ago/i });
    await user.selectOptions(operatorApprovalSearch,'1 week ago');

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /06D111CJ/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

      //EXPECT ARCHIVED AFEs NOT to be Visible
      expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });
  });

  test('Shows Operated AFEs and Non-Operated AFEs after Super User clicks on All AFEs and has view right to both', async () => {
    const user = userEvent.setup();

  renderWithProviders(<AFE />, {
    routes: [
      { path: '/', element: <AFE /> },
      { path: '/afeDetail/:afeID', element: <div>AFE Detail</div> },
    ],
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });
  
    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
     });

    await waitFor(() => {

      //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
      //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
      //expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
      //expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
      
      expect(screen.getAllByRole("link", { name: /06D111JC/i })[0]).toBeVisible();
      expect(screen.getAllByRole("link", { name: /06D111JC/i })[1]).toBeVisible();
      

      //EXPECT ARCHIVED AFEs NOT to be Visible
      //expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
      //expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    });

    
      await user.click(screen.getAllByRole("link", { name: /06D111JC/i })[0]);
   

    await waitFor(() => {
  expect(screen.getByText('AFE Detail')).toBeInTheDocument();
});

expect(writeProvider.updateAFEPartnerStatus).not.toHaveBeenCalled();
await new Promise(resolve => setTimeout(resolve, 150));
   
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs when there is no Session', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    message: 'Cannot get AFEs'
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: null,
        loading: false,
        isSuperUser: false,
        session: {
        access_token: '',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: '2024-01-01T00:00:00Z',
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).not.toHaveBeenCalled();
  });

  await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

  });

  test('Shows No Operated AFEs and No Non-Operated AFEs when there is no Session', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    message: 'Cannot get AFEs'
  });
    
  renderWithProviders(<AFE />, {
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
          app_metadata:[],
          user_metadata:{}
        }
      },
    }
  });

  await waitFor(() => {
    expect(fetchProvider.fetchAFEs).toHaveBeenCalled();
  });

  await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 
    
    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.queryByTestId('Non-OperatedAFElistHeader')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('OperatedAFElistHeader')[0]).toBeVisible();
    //Second AFE Header
    expect(screen.getAllByTestId('OperatedAFElistHeader')[1]).not.toBeVisible();

    //AFE Filters
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.queryByTestId('Non-OperatedAFElistFilter')).not.toBeInTheDocument();
    
    //No AFEs Message (there are none)
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[0]).not.toBeVisible(); 
    expect(screen.getAllByTestId('OperatedNoFilteredAFEs')[1]).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const allAFETab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(allAFETab);

    await waitFor(() => {
    //First AFE Header
    expect(screen.getByTestId('Non-OperatedAFElistHeader')).toBeVisible();
    //Second AFE Header
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();

    //AFE Filters
    expect(screen.queryByTestId('OperatedAFElistFilter')).not.toBeInTheDocument();
    expect(screen.getByTestId('Non-OperatedAFElistFilter')).not.toBeVisible();

    //No AFEs Message (there are none)
    expect(screen.getByTestId('Non-OperatedNoFilteredAFEs')).not.toBeVisible(); 
    expect(screen.getByTestId('OperatedNoFilteredAFEs')).not.toBeVisible(); 

    //AFEs
    expect(screen.getByTestId('Non-OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

  });

});

