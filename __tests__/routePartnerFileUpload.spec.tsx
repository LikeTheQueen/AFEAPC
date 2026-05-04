import * as XLSX from 'xlsx';
import * as writeProvider from "provider/write";
import { notifyStandard, notifyFailure, useWarnUnsavedChanges, superUserPermission } from 'src/helpers/helpers';
import { vi, type Mock } from 'vitest';
import { screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

import PartnerFileUpload from 'src/routes/partnerConfigurations/routes/partnerFileUpload';
import {
    RachelGreen_AllPermissions_CW_NonOpCW,
} from './test-utils/afeRecords';

vi.mock('provider/fetch', () => ({

}));

vi.mock('provider/write', () => ({
    writePartnerlistFromSourceToDB: vi.fn(),
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



describe('Partner File Upload', () => {
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
            
            // Second call: Worksheet columns
            .mockReturnValueOnce([['Source_id', 'Name', 'Street', 'Suite', 'City', 'State', 'Zip', 'Country']])
            // Third call: raw rows for mapping
            .mockReturnValueOnce([
                ['Source_id', 'Name', 'Street', 'Suite', 'City', 'State', 'Zip', 'Country'],
                ['S1', 'Acme Co', '123 Main', '', 'Denver', 'CO', '80201', 'US'],
                ['S1', 'Acme Co', '123 Main', '', 'Denver', 'CO', '80201', 'US']
            ]);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.clearAllMocks();
    });

    test('Allows user to upload the Partner List and cancel, clearing the list', async () => {

        renderWithProviders(<PartnerFileUpload />, {
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
            expect(screen.getByText('Upload Partner Library from Your AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.spyOn(globalThis, 'FileReader').mockImplementation(() => mockFileReaderInstance as any)

        const mockFile = new File(['dummy'], 'partners.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('Acme Co')).toBeInTheDocument()
        });

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            // Assert specific cells within the first data row
            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('S1')
            expect(cells[1]).toHaveTextContent('Acme Co')
            expect(cells[2]).toHaveTextContent('123 Main')
            expect(cells[4]).toHaveTextContent('Denver')
            expect(cells[5]).toHaveTextContent('CO')
            expect(cells[6]).toHaveTextContent('80201')
            expect(cells[7]).toHaveTextContent('US')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const savePartnerList = screen.getByRole('button', { name: /save partner list/i });
        expect(savePartnerList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(cancelButton);

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(1)
        });

        expect(savePartnerList).toBeDisabled();


    });

    test('Allows user to upload the Partner List and saves the list', async () => {

        vi.mocked(writeProvider.writePartnerlistFromSourceToDB)
            .mockResolvedValue({ ok: true });

        renderWithProviders(<PartnerFileUpload />, {
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
            expect(screen.getByText('Upload Partner Library from Your AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        };
        vi.spyOn(globalThis, 'FileReader').mockImplementation(() => mockFileReaderInstance as any)

        const mockFile = new File(['dummy'], 'partners.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });
        await waitFor(() => {
            expect(screen.getByText('Acme Co')).toBeInTheDocument()
        });

        await waitFor(() => {
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)

            // Assert specific cells within the first data row
            const cells = within(rows[1]).getAllByRole('cell')
            expect(cells[0]).toHaveTextContent('S1')
            expect(cells[1]).toHaveTextContent('Acme Co')
            expect(cells[2]).toHaveTextContent('123 Main')
            expect(cells[4]).toHaveTextContent('Denver')
            expect(cells[5]).toHaveTextContent('CO')
            expect(cells[6]).toHaveTextContent('80201')
            expect(cells[7]).toHaveTextContent('US')
        });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        const savePartnerList = screen.getByRole('button', { name: /save partner list/i });
        expect(savePartnerList).toBeEnabled();
        expect(cancelButton).toBeEnabled();

        await user.click(savePartnerList);

        await waitFor(() => {
            expect(writeProvider.writePartnerlistFromSourceToDB).toHaveBeenCalledWith(
                [{
                    source_id: 'S1',
                    apc_op_id: 'operator-123',
                    name: 'Acme Co',
                    street: '123 Main',
                    suite: '',
                    city: 'Denver',
                    state: 'CO',
                    zip: '80201',
                    country: 'US',
                    active: true
                },
                {
                    source_id: 'S1',
                    apc_op_id: 'operator-124',
                    name: 'Acme Co',
                    street: '123 Main',
                    suite: '',
                    city: 'Denver',
                    state: 'CO',
                    zip: '80201',
                    country: 'US',
                    active: true
                }],
            )
            const rows = screen.getAllByRole('row')

            expect(rows).toHaveLength(2)
        });

        expect(savePartnerList).toBeDisabled();


    });

    test('Incorrect Headers in file', async () => {
        vi.clearAllMocks()

    const mockWorksheet = {}
    const mockWorkbook = {
        Sheets: { Sheet1: mockWorksheet },
        SheetNames: ['Sheet1']
    }
    vi.mocked(XLSX.read).mockReturnValue(mockWorkbook as any)

    vi.mocked(XLSX.utils.sheet_to_json)
        .mockReturnValueOnce([
            ['doc_id', 'Name', 'Street', 'Suite', 'City', 'State', 'Zip', 'Country']
        ])

        renderWithProviders(<PartnerFileUpload />, {
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
            expect(screen.getByText('Upload Partner Library from Your AFE System')).toBeInTheDocument();
            const tableData = screen.getByRole('table');
            expect(tableData).toBeInTheDocument();
            const rowsOG = screen.getAllByRole('row');
            expect(rowsOG).toHaveLength(1)
        });

        const chooseFileButton = screen.getByLabelText('Choose File', { selector: 'input' });
        expect(chooseFileButton).toBeDisabled();

        await userEvent.click(screen.getByText('Mock Operator Select'));

        expect(chooseFileButton).toBeEnabled();

        const mockFileReaderInstance = {
            readAsArrayBuffer: vi.fn(),
            onload: null as any,
            result: new ArrayBuffer(8)
        }
        vi.spyOn(globalThis, 'FileReader').mockImplementation(() => mockFileReaderInstance as any)

        const mockFile = new File(['dummy'], 'partners.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        await act(async () => {
            fireEvent.change(chooseFileButton, { target: { files: [mockFile] } })
            mockFileReaderInstance.onload({ target: { result: new ArrayBuffer(8) } })
        });

        console.log('notifyFailure calls:', vi.mocked(notifyFailure).mock.calls)
console.log('sheet_to_json calls:', vi.mocked(XLSX.utils.sheet_to_json).mock.calls)
console.log('XLSX.read calls:', vi.mocked(XLSX.read).mock.calls)
        await waitFor(() => {
            expect(notifyFailure).toHaveBeenCalled();
        })
        

    });
});