import { vi } from 'vitest';
import executeAFECall from 'src/scripts/executeReadWritePromise';

import fetchAuthToken from 'src/scripts/executeFetchAuthToken';
import fetchExecuteAFEData from '../src/scripts/executeFetchExecuteAFEData';
import { processAFEDocIDsToDocHandle } from '../src/scripts/executeBatchProcessAFEDocIDToDocHandle';
import { transformExecuteAFEsID } from '../src/types/transform';
import executeLogout from '../src/scripts/executeLogout';

import { docHandleResponse } from './test-utils/executeResponse';
import type { ExecuteAFEDocIDType } from 'src/types/interfaces';
import { twoExecuteIDDoc } from './test-utils/executeDocIDRecords';

vi.mock('../src/scripts/executeFetchAuthToken', () => ({
    default: vi.fn(),
}));

vi.mock('../src/scripts/executeFetchExecuteAFEData', async () => {
    return {
        default: vi.fn(),
    };
});

vi.mock('../src/scripts/executeBatchProcessAFEDocIDToDocHandle', async () => {
    return {
        processAFEDocIDsToDocHandle: vi.fn(),
    };
});

vi.mock('../src/types/transform', async () => {
    return {
        transformExecuteAFEsID: vi.fn(),
    }
});

vi.mock('../src/scripts/executeLogout', async () => {
    return {
        default: vi.fn(),
    }
});

describe('executeReadWritePromise', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should successfully go through the entire series of read / write and log out', async () => {
        vi.mocked(fetchAuthToken).mockResolvedValue('mockedToken');
        vi.mocked(fetchExecuteAFEData).mockResolvedValue(docHandleResponse);
        vi.mocked(transformExecuteAFEsID).mockReturnValue(twoExecuteIDDoc as ExecuteAFEDocIDType[]);
        vi.mocked(processAFEDocIDsToDocHandle).mockResolvedValue([docHandleResponse]);
        vi.mocked(executeLogout).mockResolvedValue('Success');

        // Act
        await executeAFECall('fakeAuthToken', 'FakeOperator', 'fakeAuthToken', 'FakeOperator', 'fake');

        // Assert
        expect(fetchAuthToken).toHaveBeenCalled();
        expect(fetchExecuteAFEData).toHaveBeenCalled();
        expect(transformExecuteAFEsID).toHaveBeenCalled();
        expect(processAFEDocIDsToDocHandle).toHaveBeenCalled();
        expect(executeLogout).toHaveBeenCalled();
    });

    it('Should return an error that login failed', async () => {
        vi.mocked(fetchAuthToken).mockRejectedValue(new Error('Request Failed and could not login'));
        vi.mocked(fetchExecuteAFEData).mockResolvedValue(docHandleResponse);
        vi.mocked(transformExecuteAFEsID).mockReturnValue(twoExecuteIDDoc as ExecuteAFEDocIDType[])
        vi.mocked(processAFEDocIDsToDocHandle).mockResolvedValue([docHandleResponse])
        vi.mocked(executeLogout).mockResolvedValue('Success');

        // Act
        const result = await executeAFECall('fakeAuthToken', 'FakeOperator', 'fakeAuthToken', 'FakeOperator', 'fake');

        // Assert
        expect(fetchAuthToken).toHaveBeenCalled();
        expect(fetchExecuteAFEData).not.toHaveBeenCalled();
        expect(transformExecuteAFEsID).not.toHaveBeenCalled();
        expect(processAFEDocIDsToDocHandle).not.toHaveBeenCalled();
        expect(executeLogout).not.toHaveBeenCalled();
        expect(result).toEqual(new Error('Request Failed and could not login'))
    });

    it('Should return an error that there was no AFE Data', async () => {
        vi.mocked(fetchAuthToken).mockResolvedValue('mockedToken');
        vi.mocked(fetchExecuteAFEData).mockRejectedValue(new Error);
        vi.mocked(transformExecuteAFEsID).mockReturnValue(twoExecuteIDDoc as ExecuteAFEDocIDType[])
        vi.mocked(processAFEDocIDsToDocHandle).mockResolvedValue([docHandleResponse])
        vi.mocked(executeLogout).mockResolvedValue('Success');

        // Act
        await executeAFECall('fakeAuthToken', 'FakeOperator', 'fakeAuthToken', 'FakeOperator', 'fake');

        // Assert
        expect(fetchAuthToken).toHaveBeenCalled();
        expect(fetchExecuteAFEData).toHaveBeenCalled();
        expect(transformExecuteAFEsID).not.toHaveBeenCalled();
        expect(processAFEDocIDsToDocHandle).not.toHaveBeenCalled();
        expect(executeLogout).toHaveBeenCalled();
    });

    it('Should return an error that the transform did not work', async () => {
        vi.mocked(fetchAuthToken).mockResolvedValue('mockedToken');
        vi.mocked(fetchExecuteAFEData).mockResolvedValue(docHandleResponse);
        vi.mocked(transformExecuteAFEsID).mockRejectedValue(new Error);
        vi.mocked(processAFEDocIDsToDocHandle).mockResolvedValue([docHandleResponse]);
        vi.mocked(executeLogout).mockResolvedValue('Success');

        // Act
        await executeAFECall('fakeAuthToken', 'FakeOperator', 'fakeAuthToken', 'FakeOperator', 'fake');

        // Assert
        expect(fetchAuthToken).toHaveBeenCalled();
        expect(fetchExecuteAFEData).toHaveBeenCalled();
        expect(transformExecuteAFEsID).toHaveBeenCalled();
        expect(processAFEDocIDsToDocHandle).not.toHaveBeenCalled();
        expect(executeLogout).toHaveBeenCalled();
    });

    it('Should return an error when processing AFEs did not work', async () => {
        vi.mocked(fetchAuthToken).mockResolvedValue('mockedToken');
        vi.mocked(fetchExecuteAFEData).mockResolvedValue(docHandleResponse);
        vi.mocked(transformExecuteAFEsID).mockReturnValue(twoExecuteIDDoc as ExecuteAFEDocIDType[]);
        vi.mocked(processAFEDocIDsToDocHandle).mockRejectedValue(new Error('Cannot process AFEs'));
        vi.mocked(executeLogout).mockResolvedValue('Success');

        // Act
        const result = await executeAFECall('fakeAuthToken', 'FakeOperator', 'fakeAuthToken', 'FakeOperator', 'fake');

        // Assert
        expect(fetchAuthToken).toHaveBeenCalled();
        expect(fetchExecuteAFEData).toHaveBeenCalled();
        expect(transformExecuteAFEsID).toHaveBeenCalled();
        expect(processAFEDocIDsToDocHandle).toHaveBeenCalled();
        expect(executeLogout).toHaveBeenCalled();
        expect(result).toEqual(new Error('Cannot process AFEs'))
    });
});
