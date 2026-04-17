vi.mock('../provider/supabase', () => ({
  supabase: {
    rpc: vi.fn()
  }
}));
import AFE from '../src/routes/afeDashboard/routes/afe';
import { formatDate, formatDateShort } from "../src/helpers/styleHelpers";
import * as fetchProvider from '../provider/fetch';
import { vi, type Mock } from 'vitest';
import { getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import {
  afesReturnedFromSupabase,
  RachelGreen_AllPermissions_CW_NonOpCW,
  RossGeller_Op_CW_No_NonOp,
  MonicaGeller_NoOpRoles_CW_NonOpCW,
  OperatorDropDown,
  PartnerDropdown,
  loggedInUserIsSuperUser
} from './test-utils/afeRecords';

vi.mock('../provider/fetch', () => ({
  updateAFEPartnerStatusSupabase: vi.fn(),
  addAFEHistorySupabase: vi.fn(),
  fetchAFEs: vi.fn(),
  fetchAllOperators: vi.fn(), 
  fetchAllPartners: vi.fn(),
}));


describe('displaying AFEs', () => {
  beforeEach(() => {
    // Set default mocks that all tests can use
    (fetchProvider.fetchAllOperators as Mock).mockResolvedValue(OperatorDropDown);
    (fetchProvider.fetchAllPartners as Mock).mockResolvedValue(PartnerDropdown);
  });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })

  test('Shows Non-Operated AFEs and hides anything related to Operated AFEs when a user (Rachel Green) logs in', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
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
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.getByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    

  });

  test('Shows Non-Operated AFEs and hides anything related to Operated AFEs when a user (Monica Geller) logs in and only has permission for NonOp AFEs', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
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
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   
  });

  test('Shows no AFE for a user (Ross Geller) that does not have view rights to see Non Op AFEs', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
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
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'06D111N');
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
     });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   

  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search (Rachel Green) fuzzy search', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'06');
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
    
  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using Partner Status search (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    });

    const partnerStatusSearch = screen.getByRole('combobox', { name: /Select Partner Status/i });
    await user.selectOptions(partnerStatusSearch,'Approved')
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
     });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   

  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see, only 1 they should see, when using Partner Status search (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    });

    const partnerStatusSearch = screen.getByRole('combobox', { name: /Select Partner Status/i });
    await user.selectOptions(partnerStatusSearch,'New')
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
     });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   

  });

  test.skip('Shows Non-Operated AFEs and does not return AFEs they should not see, when using Operator Approval Days Ago search (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    });

    const operatorApprovalSearch = screen.getByRole('combobox', { name: /Operator Approval Days Ago/i });
    await user.selectOptions(operatorApprovalSearch,'1 week ago')
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
     });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /099D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /1199D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   
  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs in the mobile menu and has view rights (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
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
      expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('combobox', { name: /select a tab/i });
    await user.selectOptions(operatedTab, '2');

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

    await screen.findByRole("link", { name: /06D111CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /25D001CA S2/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();

  });

  test('Shows no Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs and does not have view rights (Monica Geller)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    
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
      expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();   
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA S2/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();

    
  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs and has view rights (Ross Geller)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
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
      expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();
      expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'Operated AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });

    await screen.findByRole("link", { name: /06D111CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /25D001CA S2/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //EXPECT ARCHIVED AFEs NOT to be Visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
  });

  test('Shows 0 Operated AFEs and 1 Non-Op AFE when a user clicks on ALL AFEs and does not have Operated AFE view rights (Monica Geller)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    
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
      expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument(); 
    
  });

  test('Shows there are no AFEs to view when the response is empty (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    message:'Error getting AFEs'
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
      expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const errorMessage = await screen.findAllByText(/Unable to retrieve AFEs for the user/i);
    expect(errorMessage).toHaveLength(2);
    
  });

  test('Shows Operated AFEs and Non-Operated AFEs after user clicks on All AFEs and has view right to both (Rachel Green)', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
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
      expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    });
    
    await screen.findByRole("link", { name: /06D111CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /25D001CA S2/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
  });

  test('Shows Operated AFEs and Non-Operated AFEs after Super User clicks on All AFEs and has view right to both', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afesReturnedFromSupabase
  });
    
  renderWithProviders(<AFE />, {
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
      expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
     });

    await screen.findAllByRole("link", { name: /06D111CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findAllByRole("link", { name: /25D001CA S2/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    await screen.findAllByRole("link", { name: /06D111NJ/i });
    //expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    await screen.findAllByRole("link", { name: /06D111NA/i });
    //expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    await screen.findAllByRole("link", { name: /06D111JC/i });
    //expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findAllByRole("link", { name: /06D111AN/i });
    //expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryAllByRole("link", { name: /06D111JA/i })).toHaveLength(0);
    //await screen.findByRole("link", { name: /06D111AC/i });
    //expect(screen.queryAllByRole("link", { name: /06D111AC/i })[0]).not.toBeInTheDocument();
   
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs after user (Rachel Green) clicks on All AFEs and has view right to both but fetch returned an error', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    data: afesReturnedFromSupabase
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
      expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const errorMessage = await screen.findAllByText(/Unable to retrieve AFEs for the user/i);
    expect(errorMessage).toHaveLength(2);

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA S2/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   
    
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs after user clicks on All AFEs and has view right to both but there is no token', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    message:'No AFEs'
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: RachelGreen_AllPermissions_CW_NonOpCW,
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
      expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();

    });

    const errorMessage = await screen.findAllByText(/There are no Non-Operated AFEs to View/i);
    expect(errorMessage).toHaveLength(2);

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA S2/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   
    
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
      expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    });

    const operatedTab = screen.getByRole('button', { name: 'All AFEs' });
    await user.click(operatedTab);

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    });

    const errorMessage = await screen.findAllByText(/There are no Non-Operated AFEs to View/i);
    expect(errorMessage[0]).toBeInTheDocument();

    //await screen.findByRole("link", { name: /06D111CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /25D001CA S2/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NJ/i });
    expect(screen.queryByRole("link", { name: /06D111NJ/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111NA/i });
    expect(screen.queryByRole("link", { name: /06D111NA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111JC/i });
    expect(screen.queryByRole("link", { name: /06D111JC/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AN/i });
    expect(screen.queryByRole("link", { name: /06D111AN/i })).not.toBeInTheDocument();

    //Expect the archived AFE NOT to be visible
    //await screen.findByRole("link", { name: /06D111JA/i });
    expect(screen.queryByRole("link", { name: /06D111JA/i })).not.toBeInTheDocument();
    //await screen.findByRole("link", { name: /06D111AC/i });
    expect(screen.queryByRole("link", { name: /06D111AC/i })).not.toBeInTheDocument();
   
    
  });

});

