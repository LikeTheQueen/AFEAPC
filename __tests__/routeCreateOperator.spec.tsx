import CreateOperator from 'src/routes/createEditOperators/routes/createOperator';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { 
  partnersLinkedOrUnlinked, 
  operatorAddressAddedResponse, 
  operatorAddedtoSupabaseReturn,
  operatorBillingAddressToCreate,
  partnerAddedtoSupabaseReturn,
  nonOpAddressToCreate,
  nonOpAddressAddedResponse,
  partnerID1,
  operatorAddedtoSupabaseReturnWithoutSourceSystem,
  operatorAddedtoSupabaseReturnNoID 
} from './test-utils/operatorRecords';

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
  addPartnerSupabase: vi.fn(),
  addOperatorPartnerAddressSupabase: vi.fn(),
}));

describe('Create New Operator',() => {
  
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

    const fetchError = screen.getByText(/There was an issue getting the source systm list: /i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address: /i);
    const operatorSaved = screen.getByText('Operator has been saved.');
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();

  });

  test('Displays Fetch error message when Source System List cannot be found', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchProvider.fetchSourceSystems);

    mockFetch.mockResolvedValue({
      ok: false, data: [], message: 'Row level secuirty permissions'
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
    await user.selectOptions(operatorSourceSystemInput,'');
    expect(operatorSourceSystemInput).toHaveValue('0');
    expect(operatorSave).toBeDisabled();

    const fetchError = screen.getByText(/There was an issue getting the source systm list: /i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address: /i);
    const operatorSaved = screen.getByText('Operator has been saved.');
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();

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

    const fetchError = screen.getByText(/There was an issue getting the source systm list: /i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address: /i);
    const operatorSaved = screen.getByText('Operator has been saved.');
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();
  });

  test('Displays the values of the Operator that is being created; Verfies the return of Operator created maps correctly and ID is included in NonOp record', async () => {
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
        ok: true,
        data: operatorAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: true,
        data: operatorAddressAddedResponse,
        message: undefined
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: true,
        data: partnerAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils',2);
       expect(writeProvider.addOperatorAdressSupabase).toHaveBeenCalledWith(
        '2323232', operatorBillingAddressToCreate
      );
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list: /i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address: /i);
    const operatorSaved = screen.getByText('Operator has been saved.');
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).toBeVisible();
    

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

    await user.click(operatorSaveOpNonOpAdddress);

    await waitFor(() => {
      expect(writeProvider.addPartnerSupabase).toHaveBeenCalledWith(
        'Corr Mike Oils','2323232'
      );
    });

    await waitFor(() => {
      expect(writeProvider.addOperatorPartnerAddressSupabase).toHaveBeenCalledWith(
        partnerID1,
        nonOpAddressToCreate
      );
    });

    expect(operatorStreetInput[1]).toHaveValue('');
    
    expect(savedAddressesList).not.toHaveAttribute('hidden');
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).toBeVisible();
 
  });

  test('Displays the values of the Operator that is being created; Verfies the return of Operator created but is missing the mapped IDs to create an address records', async () => {
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
        ok: true,
        data: operatorAddedtoSupabaseReturnWithoutSourceSystem,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: true,
        data: operatorAddressAddedResponse,
        message: undefined
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: true,
        data: partnerAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    
    await user.selectOptions(operatorSourceSystemInput,'');
    expect(operatorSourceSystemInput).toHaveValue('0');
    expect(operatorSave).toBeDisabled();

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).not.toHaveBeenCalled();
       expect(writeProvider.addOperatorAdressSupabase).not.toHaveBeenCalled();
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list: /i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address: /i);
    const operatorSaved = screen.getByText('Operator has been saved.');
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();
    

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
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();

    await user.click(operatorSaveOpNonOpAdddress);

    await waitFor(() => {
      expect(writeProvider.addPartnerSupabase).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(writeProvider.addOperatorPartnerAddressSupabase).not.toHaveBeenCalled();
    });

    expect(operatorStreetInput[1]).toHaveValue('1235 Main Street');
    
    expect(savedAddressesList).toHaveAttribute('hidden');
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(writeError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();
 
  });

  test('Displays the values of the Operator that is being created; Errors out creating the Operator Record and wil not allows save for Partner Record', async () => {
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
        ok: false,
        data: null,
        message: 'Role Security Issue'
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: true,
        data: operatorAddressAddedResponse,
        message: undefined
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: true,
        data: partnerAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils',2);
       expect(writeProvider.addOperatorAdressSupabase).not.toHaveBeenCalled();
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list:/i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address:/i);
    const operatorSaved = screen.getByText(/Operator has been saved./i);
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(operatorSaved).not.toBeVisible();
    expect(writeError).toBeVisible();

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
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();

    expect(savedAddressesList).toHaveAttribute('hidden');
     expect(partnerWriteErrorMessage).not.toBeVisible();
 
  });

  test('Displays the values of the Operator that is being created; Verfies the return of Operator created maps correctly and ID is included in NonOp record but error writing Partner record', async () => {
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
        ok: true,
        data: operatorAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: true,
        data: operatorAddressAddedResponse,
        message: undefined
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: false,
        data: null,
        message: 'Row level security error'
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils',2);
       expect(writeProvider.addOperatorAdressSupabase).toHaveBeenCalledWith(
        '2323232', operatorBillingAddressToCreate
      );
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list:/i);
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    const operatorSaved = screen.getByText(/Operator has been saved./i);
    expect(fetchError).not.toBeVisible();
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(operatorSaved).toBeVisible();

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

    await user.click(operatorSaveOpNonOpAdddress);

    await waitFor(() => {
      expect(writeProvider.addPartnerSupabase).toHaveBeenCalledWith(
        'Corr Mike Oils','2323232'
      );
    });

    await waitFor(() => {
      expect(writeProvider.addOperatorPartnerAddressSupabase).not.toHaveBeenCalled();
    });

    expect(operatorStreetInput[1]).toHaveValue('1235 Main Street');
    
    expect(savedAddressesList).toHaveAttribute('hidden');
    expect(partnerWriteErrorMessage).toBeVisible();
 
  });

  test('Displays the values of the Operator that is being created; Errors out creating the Operator Address Record ', async () => {
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
        ok: true,
        data: operatorAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: false,
        data: null,
        message: 'Role Security'
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: true,
        data: partnerAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils',2);
      expect(writeProvider.addOperatorAdressSupabase).toHaveBeenCalledWith(
        '2323232', operatorBillingAddressToCreate
      );
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list:/i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address:/i);
    const operatorSaved = screen.getByText(/Operator has been saved./i);
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(operatorSaved).toBeVisible();
    expect(writeError).toBeVisible();

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

    expect(savedAddressesList).toHaveAttribute('hidden');
    expect(partnerWriteErrorMessage).not.toBeVisible();
 
  });

  test('Displays the values of the Operator that is being created; Returned Opeator does not have an ID and shows error message', async () => {
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
        ok: true,
        data: operatorAddedtoSupabaseReturnNoID,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorAdressSupabase).mockResolvedValue({
        ok: true,
        data: operatorAddressAddedResponse,
        message: undefined
    })
    
    
    vi.mocked(writeProvider.addPartnerSupabase).mockResolvedValueOnce({
        ok: true,
        data: partnerAddedtoSupabaseReturn,
        message: undefined
    })

    vi.mocked(writeProvider.addOperatorPartnerAddressSupabase).mockResolvedValueOnce({
        ok: true,
        data: nonOpAddressAddedResponse,
        message: undefined
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

    const allLists = screen.getAllByRole('list', { hidden: true });


const savedAddressesList = allLists.find(list => 
  list.textContent?.includes('The addresses below have been saved')
);


expect(savedAddressesList).toHaveAttribute('hidden');

    await user.click(operatorSave);

    await waitFor(() => {
      expect(writeProvider.addOperatorSupabase).toHaveBeenCalledWith('Corr Mike Oils',2);
      expect(writeProvider.addOperatorAdressSupabase).not.toHaveBeenCalled();
    });

    expect(operatorSave).toBeDisabled();
    const fetchError = screen.getByText(/There was an issue getting the source systm list:/i);
    const writeError = screen.getByText(/There was an error writing the Operator Record or the Operator Billing Address:/i);
    const operatorSaved = screen.getByText(/Operator has been saved./i);
    const partnerWriteErrorMessage = screen.getByText(/There was an error writing the Operators Partner Record or Address:/i);
    expect(partnerWriteErrorMessage).not.toBeVisible();
    expect(fetchError).not.toBeVisible();
    expect(operatorSaved).toBeVisible();
    expect(writeError).toBeVisible();

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
    expect(operatorSaveOpNonOpAdddress).toBeDisabled();

    expect(savedAddressesList).toHaveAttribute('hidden');
    expect(partnerWriteErrorMessage).not.toBeVisible();
 
  });
});