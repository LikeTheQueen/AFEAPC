import OperatorExecuteFilters from 'src/routes/createEditOperators/routes/manageOperatorExecuteFilters';
import * as fetchProvider from 'provider/fetch';
import * as writeProvider from "provider/write";
import { vi, type Mock } from 'vitest';
import { getByRole, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils/renderWithOptions';

import { loggedInUserRachelGreen, operatorFilters, nullOperatorFilters } from './test-utils/rachelGreenuser'

vi.mock('src/routes/sharedComponents/operatorDropdown', () => ({
  OperatorDropdown: ({ value, onChange }: { value: string; onChange: (id: string) => void }) => (
    <select
      aria-label="Select an Operator"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- select --</option>
      <option value="op-1">Operator One</option>
      <option value="op-2">Operator Two</option>
    </select>
  )
}));

vi.mock('provider/fetch', () => ({
  fetchOperatorExecuteFilters: vi.fn(),
}));

vi.mock('provider/write', () => ({
  updateOperatorFilterFields: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
  Flip: {},
  ToastContainer: () => null,
}));

import { toast } from 'react-toastify';


describe('Execute Filters for Operator',() => {
  
    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    })
 
    test('It should show [] in the filters for the Operators AFEs and Well Fields when no Operator is selected', async () => {
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        const afeFilterBox = screen.getByLabelText(/AFE Filter/i );
        expect(afeFilterBox).toHaveValue('[]');
        const wellFieldsBox = screen.getByLabelText(/Well Fields/i);
        expect(wellFieldsBox).toHaveValue('[]');
        expect(screen.getByText('Select an Operator to View Filters:')).toBeInTheDocument();
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });

    test('It should show the AFE Filters and Well Fields when an Operator is selected for that Operator', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: true,
            message: undefined,
            data: operatorFilters
        });
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );

        await waitFor(() => {
            const wellFieldsBox = screen.getByRole('textbox', { name: /well fields/i }) as HTMLTextAreaElement;
            expect(wellFieldsBox.value).toContain('$ISPRIMARY');
            expect(wellFieldsBox.value).toContain('CUSTOM/WELL_NAME_DESC');
            expect(wellFieldsBox.value).toContain('$DESCRIPTION');
            expect(wellFieldsBox.value).toContain('$CUSTOM/WELL_NUM');
            const afeFilterBox = screen.getByRole('textbox', { name: /AFE Filter/i }) as HTMLTextAreaElement;
            expect(afeFilterBox.value).toContain('"LeftParenthesis": "("');
            expect(afeFilterBox.value).toContain('"Column": "CUSTOM/OP_STATUS"');
            
        });
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });

    test('It should show the DEFAULT AFE Filters and Well Fields when an Operator is selected for an Operator that does not have defined values', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: true,
            message: undefined,
            data: nullOperatorFilters
        });
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );

        await waitFor(() => {
            const wellFieldsBox = screen.getByRole('textbox', { name: /well fields/i }) as HTMLTextAreaElement;
            expect(wellFieldsBox.value).toContain('$ISPRIMARY');
            expect(wellFieldsBox.value).toContain('CUSTOM/WELL_NAME');
            expect(wellFieldsBox.value).toContain('$DESCRIPTION');
            expect(wellFieldsBox.value).toContain('$CUSTOM/WELL_NUM');
            const afeFilterBox = screen.getByRole('textbox', { name: /AFE Filter/i }) as HTMLTextAreaElement;
            expect(afeFilterBox.value).toContain('"LeftParenthesis": "("');
            expect(afeFilterBox.value).toContain('"Column": "CUSTOM/OPERATOR_STATUS"');
            
        });
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });

    test('It should show empty arrays when the response fails and an error message.', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: false,
            message: 'Could Not Get Data',
            data: []
        });
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );

        await waitFor(() => {
            const afeFilterBox = screen.getByLabelText(/AFE Filter/i);
            expect(afeFilterBox).toHaveValue('[]');
            const wellFieldsBox = screen.getByLabelText(/Well Fields/i);
            expect(wellFieldsBox).toHaveValue('[]');
        });
        expect(screen.queryByTestId('json-error-well')).toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });

    test('It should show [] in the filters for the Operators AFEs and Well Fields when no Operator is selected and invalid JSON message when user clears', async () => {
        const user = userEvent.setup();
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        const afeFilterBox = screen.getByLabelText(/AFE Filter/i );
        expect(afeFilterBox).toHaveValue('[]');
        const wellFieldsBox = screen.getByLabelText(/Well Fields/i);
        expect(wellFieldsBox).toHaveValue('[]');
        expect(screen.getByText('Select an Operator to View Filters:')).toBeInTheDocument();
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
        
        await user.clear(afeFilterBox);

        await waitFor(() => {
            expect(screen.queryByTestId('json-error-afe')).toBeInTheDocument();
        });

        await user.clear(wellFieldsBox);

        await waitFor(() => {
            expect(screen.queryByTestId('json-error-well')).toBeInTheDocument();
        });


    });

    test('It should show the AFE Filters and Well Fields when an Operator is selected for that Operator and make the Save Changes button clickable when the user adds valid JSON', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: true,
            message: undefined,
            data: operatorFilters
        });
        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );
        const wellFieldsBox = screen.getByRole('textbox', { name: /well fields/i }) as HTMLTextAreaElement;
        const afeFilterBox = screen.getByRole('textbox', { name: /AFE Filter/i }) as HTMLTextAreaElement;
        
        await waitFor(() => {
            
            expect(wellFieldsBox.value).toContain('$ISPRIMARY');
            expect(wellFieldsBox.value).toContain('CUSTOM/WELL_NAME_DESC');
            expect(wellFieldsBox.value).toContain('$DESCRIPTION');
            expect(wellFieldsBox.value).toContain('$CUSTOM/WELL_NUM');
            
            expect(afeFilterBox.value).toContain('"LeftParenthesis": "("');
            expect(afeFilterBox.value).toContain('"Column": "CUSTOM/OP_STATUS"');
            
        });
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();

        fireEvent.change(wellFieldsBox, {
            target: {
                value: JSON.stringify([
                    '$ISPRIMARY',
                    'CUSTOM/WELL_NAME_DESC',
                    '$DESCRIPTION',
                    '$CUSTOM/WELL_NUM',
                    'CUSTOM/OPERATOR_STATUS'
                ], null, 2)
            }
        });

        fireEvent.change(afeFilterBox, {
            target: {
                value: JSON.stringify([
                    {
                        "Value": "No Status",
                        "Column": "$STATUS",
                        "Operator": "=",
                        "LeftParenthesis": "("
                    },
                ])
            }
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
        });

        fireEvent.change(afeFilterBox, {
            target: {
                value: '['
            }
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
        });
    });

    test('It should show the AFE Filters and Well Fields when an Operator is selected for that Operator and make the Save Changes button clickable when the user adds valid JSON and save response', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: true,
            message: undefined,
            data: operatorFilters
        });

        vi.mocked(writeProvider.updateOperatorFilterFields).mockResolvedValue({
            ok: true,
            message: null,
            data: operatorFilters
        });

        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );
        const wellFieldsBox = screen.getByRole('textbox', { name: /well fields/i }) as HTMLTextAreaElement;
        const afeFilterBox = screen.getByRole('textbox', { name: /AFE Filter/i }) as HTMLTextAreaElement;
        
        await waitFor(() => {
            
            expect(wellFieldsBox.value).toContain('$ISPRIMARY');
            expect(wellFieldsBox.value).toContain('CUSTOM/WELL_NAME_DESC');
            expect(wellFieldsBox.value).toContain('$DESCRIPTION');
            expect(wellFieldsBox.value).toContain('$CUSTOM/WELL_NUM');
            
            expect(afeFilterBox.value).toContain('"LeftParenthesis": "("');
            expect(afeFilterBox.value).toContain('"Column": "CUSTOM/OP_STATUS"');
            
        });
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();

        fireEvent.change(wellFieldsBox, {
            target: {
                value: JSON.stringify([
                    '$ISPRIMARY',
                    'CUSTOM/WELL_NAME_DESC',
                    '$DESCRIPTION',
                    '$CUSTOM/WELL_NUM',
                    'CUSTOM/OPERATOR_STATUS'
                ], null, 2)
            }
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
        });

        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(writeProvider.updateOperatorFilterFields).toHaveBeenCalled();
            expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    data: expect.stringContaining("Line Secured")
                })
            );
        });

    });

    test('It should show the AFE Filters and Well Fields when an Operator is selected for that Operator and make the Save Changes button clickable when the user adds valid JSON and save response', async () => {
        const user = userEvent.setup()

        vi.mocked(fetchProvider.fetchOperatorExecuteFilters).mockResolvedValue({
            ok: true,
            message: undefined,
            data: operatorFilters
        });

        vi.mocked(writeProvider.updateOperatorFilterFields).mockResolvedValue({
            ok: false,
            message: 'Error',
            data: []
        });

        renderWithProviders(<OperatorExecuteFilters />, {
                      supabaseOverrides: {
                        loggedInUser: loggedInUserRachelGreen,
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
        await user.selectOptions(
            screen.getByRole('combobox', { name: /select an operator/i }),
            'op-1'
        );
        const wellFieldsBox = screen.getByRole('textbox', { name: /well fields/i }) as HTMLTextAreaElement;
        const afeFilterBox = screen.getByRole('textbox', { name: /AFE Filter/i }) as HTMLTextAreaElement;
        
        await waitFor(() => {
            
            expect(wellFieldsBox.value).toContain('$ISPRIMARY');
            expect(wellFieldsBox.value).toContain('CUSTOM/WELL_NAME_DESC');
            expect(wellFieldsBox.value).toContain('$DESCRIPTION');
            expect(wellFieldsBox.value).toContain('$CUSTOM/WELL_NUM');
            
            expect(afeFilterBox.value).toContain('"LeftParenthesis": "("');
            expect(afeFilterBox.value).toContain('"Column": "CUSTOM/OP_STATUS"');
            
        });
        expect(screen.queryByTestId('json-error-well')).not.toBeInTheDocument();
        expect(screen.queryByTestId('json-error-afe')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();

        fireEvent.change(wellFieldsBox, {
            target: {
                value: JSON.stringify([
                    '$ISPRIMARY',
                    'CUSTOM/WELL_NAME_DESC',
                    '$DESCRIPTION',
                    '$CUSTOM/WELL_NUM',
                    'CUSTOM/OPERATOR_STATUS'
                ], null, 2)
            }
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
        });

        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(writeProvider.updateOperatorFilterFields).toHaveBeenCalled();
            expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    data: expect.stringContaining("Flow Disrupted.")
                })
            );
        });

    });

    
});