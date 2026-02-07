import CreateOperator from 'src/routes/createEditOperators/routes/createOperator';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { partnersLinkedOrUnlinked } from './test-utils/operatorRecords';

import { 
    loggedInUserSuperUser,
    sourceSystems

 } from './test-utils/superUserAndSourceList';

 vi.mock('../provider/fetch', () => ({
  fetchSourceSystems: vi.fn(),
  fetchPartnersLinkedOrUnlinkedToOperator: vi.fn(),
}));

vi.mock('../provider/write', () => ({
  addOperatorSupabase: vi.fn(),
  addOperatorAdressSupabase: vi.fn(),
}));

describe('View and Edit Operators',() => {
  
    afterEach(() => {
        vi.resetAllMocks()
    })

  test('Displays the values of the Operator that is being created', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchProvider.fetchSourceSystems);

    mockFetch.mockResolvedValue({
      ok: true, data: sourceSystems, message: ''
    });

    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
    mockPartnersFetch.mockResolvedValue({
      ok: true,
      data: partnersLinkedOrUnlinked
    });

    renderWithProviders(<CreateOperator />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserSuperUser,
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
            app_metadata: [],
            user_metadata: {}
          }
        },
      }
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    const operatorSave = saveButtons[0];
    expect(operatorSave).toBeDisabled();

    const operatorNameInput = screen.getAllByRole('textbox', { name: /name/i });
    await user.type(operatorNameInput[0], 'Corr Mike Oils');
    expect(operatorNameInput[0]).toHaveValue('Corr Mike Oils');
    expect(operatorSave).toBeDisabled();

    const operatorStreetInput = screen.getAllByRole('textbox', { name: /street/i });
    await user.type(operatorStreetInput[0], '1234 Main Street');
    expect(operatorStreetInput[0]).toHaveValue('1234 Main Street');
    expect(operatorSave).toBeDisabled();

    const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
    await user.type(operatorCityInput[0], 'Austin');
    expect(operatorCityInput[0]).toHaveValue('Austin');
    expect(operatorSave).toBeDisabled();

    const operatorStateInput = screen.getAllByRole('textbox', { name: /state/i });
    await user.type(operatorStateInput[0], 'Texas');
    expect(operatorStateInput[0]).toHaveValue('Texas');
    expect(operatorSave).toBeDisabled();

    const operatorZipInput = screen.getAllByRole('textbox', { name: /zip/i });
    await user.type(operatorZipInput[0], '98987');
    expect(operatorZipInput[0]).toHaveValue('98987');
    expect(operatorSave).toBeDisabled();

    const operatorCountryInput = screen.getAllByRole('combobox', { name: /Country/i });
    await user.selectOptions(operatorCountryInput[0],'United States');
    expect(operatorCountryInput[0]).toHaveValue('United States');
    expect(operatorSave).toBeDisabled();

    const operatorSourceSystemInput = screen.getByRole('combobox', { name: /Source System for AFEs/i });
    await user.selectOptions(operatorSourceSystemInput,'W Energy');
    expect(operatorSourceSystemInput).toHaveValue('2');
    expect(operatorSave).not.toBeDisabled();

  });

  test('Displays the values of the Operator that is being created; Checking SAVE disabled when inputs are entered out of order', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchProvider.fetchSourceSystems);

    mockFetch.mockResolvedValue({
      ok: true, data: sourceSystems, message: ''
    });

    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
    mockPartnersFetch.mockResolvedValue({
      ok: true,
      data: partnersLinkedOrUnlinked
    });

    renderWithProviders(<CreateOperator />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserSuperUser,
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
            app_metadata: [],
            user_metadata: {}
          }
        },
      }
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    const operatorSave = saveButtons[0];
    expect(operatorSave).toBeDisabled();

    const operatorNameInput = screen.getAllByRole('textbox', { name: /name/i });
    await user.type(operatorNameInput[0], 'Corr Mike Oils');
    expect(operatorNameInput[0]).toHaveValue('Corr Mike Oils');
    expect(operatorSave).toBeDisabled();

    const operatorSourceSystemInput = screen.getByRole('combobox', { name: /Source System for AFEs/i });
    await user.selectOptions(operatorSourceSystemInput,'W Energy');
    expect(operatorSourceSystemInput).toHaveValue('2');
    expect(operatorSave).toBeDisabled();

    const operatorStreetInput = screen.getAllByRole('textbox', { name: /street/i });
    await user.type(operatorStreetInput[0], '1234 Main Street');
    expect(operatorStreetInput[0]).toHaveValue('1234 Main Street');
    expect(operatorSave).toBeDisabled();

    const operatorStateInput = screen.getAllByRole('textbox', { name: /state/i });
    await user.type(operatorStateInput[0], 'Texas');
    expect(operatorStateInput[0]).toHaveValue('Texas');
    expect(operatorSave).toBeDisabled();

    const operatorZipInput = screen.getAllByRole('textbox', { name: /zip/i });
    await user.type(operatorZipInput[0], '98987');
    expect(operatorZipInput[0]).toHaveValue('98987');
    expect(operatorSave).toBeDisabled();

    const operatorCountryInput = screen.getAllByRole('combobox', { name: /Country/i });
    await user.selectOptions(operatorCountryInput[0],'United States');
    expect(operatorCountryInput[0]).toHaveValue('United States');
    expect(operatorSave).toBeDisabled();

    const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
    await user.type(operatorCityInput[0], 'Austin');
    expect(operatorCityInput[0]).toHaveValue('Austin');
    expect(operatorSave).not.toBeDisabled();

  });

  test('Displays the values of the Operator that is being created; Checking SAVE disabled when inputs are entered out of order', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchProvider.fetchSourceSystems);

    mockFetch.mockResolvedValue({
      ok: true, data: sourceSystems, message: ''
    });

    const mockPartnersFetch = vi.mocked(fetchProvider.fetchPartnersLinkedOrUnlinkedToOperator);
    mockPartnersFetch.mockResolvedValue({
      ok: true,
      data: partnersLinkedOrUnlinked
    });

    vi.mocked(writeProvider.addOperatorSupabase).mockResolvedValue({
        id: '2323232',
        created_at: undefined,
        name: 'Corr Mike Oils',
        base_url: undefined,
        key: undefined,
        docID: undefined,
        source_system: 2,
        active: true,
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        id: 6,
        street: '1234 Main Street',
        suite: '',
        city: 'Austin',
        state: 'Texas',
        zip: '98987',
        country: 'United States',
        address_active: true
    })

    renderWithProviders(<CreateOperator />, {
      supabaseOverrides: {
        loggedInUser: loggedInUserSuperUser,
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
            app_metadata: [],
            user_metadata: {}
          }
        },
      }
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(mockPartnersFetch).toHaveBeenCalled();
    });

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    const operatorSave = saveButtons[0];
    expect(operatorSave).toBeDisabled();

    const operatorNameInput = screen.getAllByRole('textbox', { name: /name/i });
    await user.type(operatorNameInput[0], 'Corr Mike Oils');
    expect(operatorNameInput[0]).toHaveValue('Corr Mike Oils');
    expect(operatorSave).toBeDisabled();

    const operatorSourceSystemInput = screen.getByRole('combobox', { name: /Source System for AFEs/i });
    await user.selectOptions(operatorSourceSystemInput,'W Energy');
    expect(operatorSourceSystemInput).toHaveValue('2');
    expect(operatorSave).toBeDisabled();

    const operatorStreetInput = screen.getAllByRole('textbox', { name: /street/i });
    await user.type(operatorStreetInput[0], '1234 Main Street');
    expect(operatorStreetInput[0]).toHaveValue('1234 Main Street');
    expect(operatorSave).toBeDisabled();

    const operatorStateInput = screen.getAllByRole('textbox', { name: /state/i });
    await user.type(operatorStateInput[0], 'Texas');
    expect(operatorStateInput[0]).toHaveValue('Texas');
    expect(operatorSave).toBeDisabled();

    const operatorZipInput = screen.getAllByRole('textbox', { name: /zip/i });
    await user.type(operatorZipInput[0], '98987');
    expect(operatorZipInput[0]).toHaveValue('98987');
    expect(operatorSave).toBeDisabled();

    const operatorCountryInput = screen.getAllByRole('combobox', { name: /Country/i });
    await user.selectOptions(operatorCountryInput[0],'United States');
    expect(operatorCountryInput[0]).toHaveValue('United States');
    expect(operatorSave).toBeDisabled();

    const operatorCityInput = screen.getAllByRole('textbox', { name: /city/i });
    await user.type(operatorCityInput[0], 'Austin');
    expect(operatorCityInput[0]).toHaveValue('Austin');
    expect(operatorSave).not.toBeDisabled();

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils','2');
      expect(writeProvider.addOperatorAdressSupabase).toHaveBeenCalledWith(
        '2323232','1234 Main Street','','Austin','Texas','98987','United States'
      );
    });

    expect(operatorSave).toBeDisabled();

    const operatorSaveOpNonOpAdddress = saveButtons[2];
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();

    await user.type(operatorStreetInput[1], '1235 Main Street');
    expect(operatorStreetInput[1]).toHaveValue('1235 Main Street');
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();

    await user.type(operatorStateInput[1], 'Texas');
    expect(operatorStateInput[1]).toHaveValue('Texas');
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();
    
    await user.type(operatorZipInput[1], '98987');
    expect(operatorZipInput[1]).toHaveValue('98987');
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();
   
    await user.selectOptions(operatorCountryInput[1],'United States');
    expect(operatorCountryInput[1]).toHaveValue('United States');
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();
    
    await user.type(operatorCityInput[1], 'Austin');
    expect(operatorCityInput[1]).toHaveValue('Austin');
    expect(operatorSaveOpNonOpAdddress).not.toBeDisabled();
 
  });
});