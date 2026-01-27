import AFE from '../src/routes/afeDashboard/routes/afe';
import * as fetchProvider from '../provider/fetch';
import { vi, type Mock } from 'vitest';
import { getByTestId, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import {
  twoAFErecords,
  twoOperatedAFErecords,
  twoNonOperatedAFErecords,
  loggedInUser,
  loggedInUserOperatedAFEs,
  AFEsFromSupbase,
  OperatorDropDown,
  PartnerDropdown
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
    (fetchProvider.fetchAllOperators as Mock).mockResolvedValue([OperatorDropDown]);
    (fetchProvider.fetchAllPartners as Mock).mockResolvedValue([PartnerDropdown]);
  });

    afterEach(() => {
        vi.resetAllMocks()
    })

  test('Shows 5 Non-Operated AFEs and hides anything related to Operated AFEs for a user that only has Non-Op AFEs in the system', async () => {
    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: AFEsFromSupbase
  });
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUser,
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
  const currentTab = 2;

    await waitFor(() => {
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistFilter')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistFilter')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
     
    });

    
  });

  test('Shows 0 Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: AFEsFromSupbase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUser,
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
     
    });

    
  });

  test('Shows 0 Operated AFEs and 5 Non-Op AFE when a user clicks on ALL AFEs', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: AFEsFromSupbase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUser,
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

    
  });

  test('Shows 5 Operated AFEs and hides anything related to Non-Operated AFEs after user clicks on Operated AFEs', async () => {
    const user = userEvent.setup();

    (fetchProvider.fetchAFEs as Mock).mockResolvedValue({
    ok: true,
    data: AFEsFromSupbase
  });
    
  renderWithProviders(<AFE />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserOperatedAFEs,
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
     
    });
    screen.debug();
    
  });

  test('Expected apc_id for the Operator View'), async () => {
    
  }



 

});

