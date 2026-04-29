import * as fetchProvider from 'provider/fetch';
import { vi, describe, test, beforeEach, afterEach, expect, type Mock } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { OperatorDropdownMultiSelect } from 'src/routes/sharedComponents/operatorDropdownMultiSelect';
import { PartnerDropdownMultiSelect } from 'src/routes/sharedComponents/partnerDropdownMultiSelect';
import { RachelGreen_AllPermissions_CW_NonOpCW, RachelGreen_AllPermissions_CW_NonOpCWAthena } from './test-utils/afeRecords';
import { operatorListReturnFromSupabase, operatorListReturnFromSupabaseMultiSelect, partnerListReturnedToMultiSelect } from './test-utils/operatorRecords';




vi.mock('provider/fetch', () => ({
  fetchOperatorsOrPartnersToEdit: vi.fn(),
  fetchAllOperators: vi.fn(),
  fetchAllPartners: vi.fn(),
}));

const supabaseOverrides = {
  loggedInUser: RachelGreen_AllPermissions_CW_NonOpCWAthena,
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
  }
};



describe('PartnerDropdownMultiSelect', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  test('renders the partner list', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils Company')).toBeInTheDocument();
      expect(screen.getByText('Athena Minerals')).toBeInTheDocument();
    });
  });
  

 
});