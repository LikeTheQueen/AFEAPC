import * as XLSX from 'xlsx';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import GLFileUpload from 'src/routes/glConfigurations/routes/glFileUpload';

import {
    RachelGreen_AllPermissions_CW_NonOpCW,
} from './test-utils/afeRecords';

vi.mock('provider/fetch', () => ({

}));

vi.mock('provider/write', () => ({
    writeGLAccountlistFromSourceToDB: vi.fn(),
}));

vi.mock('src/helpers/helpers', () => ({
    notifyStandard: vi.fn(),
    notifyFailure: vi.fn(),
    useWarnUnsavedChanges: vi.fn(),
    superUserPermission: vi.fn(),
    editOperatorLibrary: vi.fn(),
}));

vi.mock('xlsx', () => ({
    read: vi.fn(),
    utils: {
        sheet_to_json: vi.fn()
    }
}));

vi.mock('src/routes/sharedComponents/operatorDropdownMultiSelect', () => ({
    OperatorDropdownMultiSelect: ({ onChange }: { onChange: (ids: string[]) => void }) => {
        return <button onClick={() => onChange(['operator-123', 'operator-124'])}>Mock Operator Select</button>
    }
}));

vi.mock('src/routes/sharedComponents/partnerDropdownMultiSelect', () => ({
    PartnerDropdownMultiSelect: ({ onChange }: { onChange: (ids: string[]) => void }) => {
        return <button onClick={() => onChange(['partner-123', 'partner-124'])}>Mock Partner Select</button>
    }
}));



describe('Account File Upload', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();

        // Make XLSX return whatever you want
        const mockWorksheet = {}
        const mockWorkbook = {
            Sheets: { Sheet1: mockWorksheet },
            SheetNames: ['Sheet1']
        };

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook as any)

        vi.mocked(XLSX.utils.sheet_to_json)
            
            // First Call: Worksheet columns
            .mockReturnValueOnce([['Account_number', 'Account_Group', 'Account_Description']])
            // Second Call: raw rows for mapping
            .mockReturnValueOnce([
                ['Account_number', 'Account_Group', 'Account_Description'],
                ['acct-1', 'Drill', 'Rig'],
                ['acct-1', 'Drill', 'Rig']
            ]);
    });

    afterEach(() => {
        vi.unstubAllGlobals(); 
        vi.restoreAllMocks();
        vi.resetAllMocks();
        vi.clearAllMocks();
    });

    test('Allows user to upload the Account List and cancel, clearing the list', async () => {

        renderWithProviders(<GLFileUpload />, {
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

        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Partner Select'));
        await userEvent.click(screen.getByText('Mock Operator Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('acct-1')).toBeInTheDocument()
        });

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('Drill')
            expect(cells[1]).toHaveTextContent('acct-1')
            expect(cells[2]).toHaveTextContent('Rig')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const saveAccountList = screen.getByRole('button', { name: /save gl account code list/i });
        expect(saveAccountList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(cancelButton);

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(1)
        });

        expect(saveAccountList).toBeDisabled();
    });

    test('Allows user to upload the Account List and saves the list', async () => {

        vi.mocked(writeProvider.writeGLAccountlistFromSourceToDB)
            .mockResolvedValue({ ok: true, message: undefined });

        renderWithProviders(<GLFileUpload />, {
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
                }
            }
        });
        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));
        await userEvent.click(screen.getByText('Mock Partner Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        };
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('acct-1')).toBeInTheDocument()
        });
        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            // Assert specific cells within the first data row
            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('Drill')
            expect(cells[1]).toHaveTextContent('acct-1')
            expect(cells[2]).toHaveTextContent('Rig')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const saveAccountList = screen.getByRole('button', { name: /save gl account code list/i });
        expect(saveAccountList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(saveAccountList);

        await waitFor(() => {
            expect(writeProvider.writeGLAccountlistFromSourceToDB).toHaveBeenCalledWith(
                [{
                    account_number: 'acct-1',
                    apc_op_id: 'operator-123',
                    apc_part_id: null,
                    account_group: 'Drill',
                    account_description: 'Rig'
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: 'operator-124',
                    apc_part_id: null,
                    account_group: 'Drill',
                    account_description: 'Rig'
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: null,
                    apc_part_id: 'partner-123',
                    account_group: 'Drill',
                    account_description: 'Rig'
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: null,
                    apc_part_id: 'partner-124',
                    account_group: 'Drill',
                    account_description: 'Rig'
                }
            ],
            )
            const rows = screen.getAllByRole('row')
            expect(rows).toHaveLength(1)
        });

        expect(saveAccountList).toBeDisabled();
        expect(notifyStandard).toHaveBeenCalled();
    });

    test('Allows user to upload the Account List and saves the list but returns an error on SAVE', async () => {

        vi.mocked(writeProvider.writeGLAccountlistFromSourceToDB)
            .mockResolvedValue({ ok: false, message: 'Error' });

        renderWithProviders(<GLFileUpload />, {
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
                }
            }
        });
        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));
        await userEvent.click(screen.getByText('Mock Partner Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        };
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('acct-1')).toBeInTheDocument()
        });
        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            // Assert specific cells within the first data row
            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('Drill')
            expect(cells[1]).toHaveTextContent('acct-1')
            expect(cells[2]).toHaveTextContent('Rig')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const saveAccountList = screen.getByRole('button', { name: /save gl account code list/i });
        expect(saveAccountList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(saveAccountList);

        await waitFor(() => {
            expect(writeProvider.writeGLAccountlistFromSourceToDB).toHaveBeenCalledWith(
                [{
                    account_number: 'acct-1',
                    account_group: 'Drill',
                    account_description: 'Rig',
                    apc_op_id: 'operator-123',
                    apc_part_id: null
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: 'operator-124',
                    apc_part_id: null,
                    account_group: 'Drill',
                    account_description: 'Rig'
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: null,
                    apc_part_id: 'partner-123',
                    account_group: 'Drill',
                    account_description: 'Rig'
                },
                {
                    account_number: 'acct-1',
                    apc_op_id: null,
                    apc_part_id: 'partner-124',
                    account_group: 'Drill',
                    account_description: 'Rig'
                }
            ],
            )
            const rows = screen.getAllByRole('row')
            expect(rows).toHaveLength(1)
        });

        expect(saveAccountList).toBeDisabled();
        expect(notifyFailure).toHaveBeenCalled();
    });

});

describe('Account File Upload - incorrect headers', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        vi.unstubAllGlobals(); 
        vi.restoreAllMocks();
        vi.resetAllMocks();
        vi.clearAllMocks();
    });

    test('Incorrect Headers in Account file', async () => {
        // Make XLSX return whatever you want
        const mockWorksheet = {}
        const mockWorkbook = {
            Sheets: { Sheet1: mockWorksheet },
            SheetNames: ['Sheet1']
        };

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook as any)

        vi.mocked(XLSX.utils.sheet_to_json)
            
            // Second call: Worksheet columns
            .mockReturnValueOnce([['Account_num', 'Account_Group', 'Account_Description']])

        renderWithProviders(<GLFileUpload />, {
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

        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));
        await userEvent.click(screen.getByText('Mock Partner Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        
        await waitFor(() => {
            expect(notifyFailure).toHaveBeenCalled();
        });

    });

    test('No rows in Account file', async () => {
        // Make XLSX return whatever you want
        const mockWorksheet = {}
        const mockWorkbook = {
            Sheets: { Sheet1: mockWorksheet },
            SheetNames: ['Sheet1']
        };

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook as any)

        vi.mocked(XLSX.utils.sheet_to_json)
            .mockReturnValueOnce([
        ['Account_number', 'Account_Group', 'Account_Description']
    ])
    .mockReturnValueOnce([
        ['Account_number', 'Account_Group', 'Account_Description']
        // no data rows - headers only
    ])

        renderWithProviders(<GLFileUpload />, {
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

        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));
        await userEvent.click(screen.getByText('Mock Partner Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        
        await waitFor(() => {
            expect(notifyFailure).toHaveBeenCalled();
        });

    });

    test('Handles null values in Account file gracefully', async () => {
        // Make XLSX return whatever you want
        const mockWorksheet = {}
        const mockWorkbook = {
            Sheets: { Sheet1: mockWorksheet },
            SheetNames: ['Sheet1']
        };

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook as any)

        vi.mocked(XLSX.utils.sheet_to_json)
            
            // Second call: Worksheet columns
            .mockReturnValueOnce([['Account_number', 'Account_Group', 'Account_Description']])
            // Third call: raw rows for mapping
            .mockReturnValueOnce([
                ['Account_number', 'Account_Group', 'Account_Description'],
                ['acct-1', null, null]
            ]);

        renderWithProviders(<GLFileUpload />, {
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

        await waitFor(() => {
            expect(screen.getByText('Upload GL Account Codes from the AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));
        await userEvent.click(screen.getByText('Mock Partner Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.stubGlobal('FileReader', vi.fn(() => mockFileReaderInstance));

        const mockFile = new File(['dummy'], 'accounts.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('acct-1')).toBeInTheDocument()
        });

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            // Assert specific cells within the first data row
            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('')
            expect(cells[1]).toHaveTextContent('acct-1')
            expect(cells[2]).toHaveTextContent('')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const saveAccountList = screen.getByRole('button', { name: /save gl account code list/i });
        expect(saveAccountList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(cancelButton);

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(1)
        });

        expect(saveAccountList).toBeDisabled();
    });
});