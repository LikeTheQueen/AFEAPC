import AFE from '../src/routes/afeDashboard/routes/afe';
import * as fetchProvider from '../provider/fetch';
import { vi, type Mock } from 'vitest';
import { getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import {
  twoAFErecords,
  twoOperatedAFErecords,
  twoNonOperatedAFErecords,
  loggedInUser,
  loggedInUserOpNavOilsPartnerJohnRoss,
  loggedInUserNoOpViewRightsAthena,
  AFEsFromSupbase,
  OperatorDropDown,
  PartnerDropdown,
  afeReturnFromSupabase,
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
        vi.resetAllMocks()
    })

  test('Shows Non-Operated AFEs and hides anything related to Operated AFEs for a user that only has Non-Op AFEs in the system or Non Op View Rights', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserNoOpViewRightsAthena,
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
//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
    screen.findByRole("link", { name: /AO06D111NA/i });
    expect(screen.queryByRole("link", { name: /PA06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    screen.findByRole("link", { name: /25D001CA S2/i });
    screen.findByRole("link", { name: /26D001CA/i });
//Operated by Corr Whit with John Ross as partner
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();
    });

  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserNoOpViewRightsAthena,
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
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'06');
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();

//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();
    });

  });

  test('Shows Non-Operated AFEs and does not return AFEs they should not see when using AFE Number search', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserNoOpViewRightsAthena,
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
    });

    const numSearch = screen.getByRole('textbox', { name: /search on afe number/i });
    await user.type(numSearch,'07');
  
    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElistFiltered')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();
    });
    
  });

  test('Shows Non-Operated AFEs and hides anything related to Operated AFEs for a user that has view rights to both', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
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

//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    screen.findByRole("link", { name: /06D111CJ/i });
    screen.findByRole("link", { name: /25D001CJ S2/i });
    screen.findByRole("link", { name: /26D001CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });

    
  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs in the mobile menu and has view rights', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
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
//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
    screen.findByRole("link", { name: /PA07D111NA/i });
    expect(screen.queryByRole("link", { name: /AO06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });

    
  });

  test('Shows no Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs and does not have view rights', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserNoOpViewRightsAthena,
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
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();

//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });

    
  });

  test('Shows Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs and has view rights', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
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
    expect(screen.getByTestId('OperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();

//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
    //expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });

    
  });

  test('Shows 0 Operated AFEs and 5 Non-Op AFE when a user clicks on ALL AFEs and does not have Operated AFE view rights', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserNoOpViewRightsAthena,
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

//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
    //expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    screen.findByRole("link", { name: /25D001CA S2/i });
    screen.findByRole("link", { name: /26D001CA/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });

    
  });

  test('Shows Operated AFEs and Non-Operated AFEs after user clicks on All AFEs and has view right to both', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
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

//Operated by Nav Oil with Athena as Partner
    screen.findByRole("link", { name: /DR26NAVAT/i });
    //expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    screen.findByRole("link", { name: /06D111CJ/i });
    screen.findByRole("link", { name: /25D001CJ S2/i });
    screen.findByRole("link", { name: /26D001CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });
   
    
  });

  test('Shows Operated AFEs and Non-Operated AFEs after Super User clicks on All AFEs and has view right to both', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserIsSuperUser,
        loading: false,
        isSuperUser: true,
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

//Operated by Nav Oil with Athena as Partner
    expect( await screen.findAllByRole("link", { name: /DR26NAVAT/i }));
    //expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    //expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
    //expect( await screen.findAllByRole("link", { name: /25D001CA S2/i }));
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    //expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    //expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    //expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    //expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
   
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs after Super User clicks on All AFEs and has view right to both but fetch returned an error', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
        loading: false,
        isSuperUser: true,
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

//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();

//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();
    
     
    });
   
    
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs after user clicks on All AFEs and has view right to both but there is no token', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    data: afeReturnFromSupabase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOpNavOilsPartnerJohnRoss,
        loading: false,
        isSuperUser: true,
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

//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });
   
    
  });

  test('Shows No Operated AFEs and No Non-Operated AFEs when there is no Session', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: false,
    data: afeReturnFromSupabase
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

//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /DR26NAVAT/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /26D001CJ/i })).not.toBeInTheDocument();
    
//ARCHIVED
//Operated by Nav Oil with Athena as Partner
    //screen.findByRole("link", { name: /DR26NAVAT/i });
    expect(screen.queryByRole("link", { name: /A06D111NA/i })).not.toBeInTheDocument();
//Operated by Corr Whit and Athena is the Partner
    //screen.findByRole("link", { name: /25D001CA S2/i });
    //screen.findByRole("link", { name: /26D001CA/i });
    expect(screen.queryByRole("link", { name: /A25D001CA S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CA/i })).not.toBeInTheDocument();
//Operated by Corr Whit with John Ross as partner
    //screen.findByRole("link", { name: /06D111CJ/i });
    //screen.findByRole("link", { name: /25D001CJ S2/i });
    //screen.findByRole("link", { name: /26D001CJ/i });
    expect(screen.queryByRole("link", { name: /A06D111CJ/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A25D001CJ S2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /A26D001CJ/i })).not.toBeInTheDocument();     
    });
   
    
  });

});

