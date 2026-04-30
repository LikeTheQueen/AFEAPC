import * as fetchProvider from 'provider/fetch';
import { vi, describe, test, beforeEach, afterEach, expect, type Mock } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { OperatorDropdownMultiSelect } from 'src/routes/sharedComponents/operatorDropdownMultiSelect';
import { PartnerDropdownMultiSelect } from 'src/routes/sharedComponents/partnerDropdownMultiSelect';
import { RachelGreen_AllPermissions_CW_NonOpCW, RachelGreen_AllPermissions_CW_NonOpCWAthena, RossGeller_Op_CW_No_NonOp } from './test-utils/afeRecords';
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

  test('renders the non-op operator list', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils Company')).toBeInTheDocument();
      expect(screen.getByText('Athena Minerals Inc.')).toBeInTheDocument();
    });
  });

  test('checks and unchecks an non-op operator', async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={onChange} isDisabled={false} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils Company')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    
    // Check first operator
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith(['475e4d12-8a0b-4264-933d-d960936852b2']);

    // Uncheck first operator
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  test('renders with initialSelectedIds non-op pre-checked', async () => {
    
    renderWithProviders(
      <PartnerDropdownMultiSelect 
        onChange={vi.fn()} 
        isDisabled={false}
        initialSelectedIds={['712abc45-def0-4321-9876-abcdef012345']} 
      />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils Company')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
  });

  test('disables checkboxes when isDisabled is true for Non-Op', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={true} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils Company')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  test('Shows no records to edit if array is empty and there is no user', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides: { ...supabaseOverrides, loggedInUser: null } }
    );
    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to edit libraries for any Non-Op Addresses')).toBeInTheDocument();
    });
    
  });

  test('Shows no records to edit if array is empty and user does not have permissions', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides: { ...supabaseOverrides, loggedInUser: RossGeller_Op_CW_No_NonOp } }
    );
    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to edit libraries for any Non-Op Addresses')).toBeInTheDocument();
    });
    
  });
});

describe('OperatorDropdownMultiSelect', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  test('renders the operator list', async () => {
    renderWithProviders(
      <OperatorDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils')).toBeInTheDocument();
      expect(screen.getByText('Athena Minerals Inc.')).toBeInTheDocument();
    });
  });

  test('checks and unchecks an operator', async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <OperatorDropdownMultiSelect onChange={onChange} isDisabled={false} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    
    // Check first operator
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith(['626390b5-6f63-4caa-a0aa-b333a15eaf59']);

    // Uncheck first operator
    await user.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  test('renders with initialSelectedIds pre-checked', async () => {
    renderWithProviders(
      <OperatorDropdownMultiSelect 
        onChange={vi.fn()} 
        isDisabled={false}
        initialSelectedIds={['3b34a78a-13ad-40b5-aecd-268d56dd5e0d']} 
      />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
  });

  test('disables checkboxes when isDisabled is true', async () => {
    renderWithProviders(
      <OperatorDropdownMultiSelect onChange={vi.fn()} isDisabled={true} />,
      { supabaseOverrides }
    );

    await waitFor(() => {
      expect(screen.getByText('Corr and Whit Oils')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  test('Shows empty array if no Operators records to edit', async () => {
    renderWithProviders(
      <OperatorDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides: { ...supabaseOverrides, loggedInUser: null } }
    );

    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to edit libraries for any Operators')).toBeInTheDocument();
    });
  });

  test('Shows no records to edit if array is empty and user does not have permissions Operato', async () => {
    renderWithProviders(
      <PartnerDropdownMultiSelect onChange={vi.fn()} isDisabled={false} />,
      { supabaseOverrides: { ...supabaseOverrides, loggedInUser: RossGeller_Op_CW_No_NonOp } }
    );
    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to edit libraries for any Non-Op Addresses')).toBeInTheDocument();
    });
    
  });
});