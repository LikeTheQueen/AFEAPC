import { describe, it, expect, vi } from 'vitest';
import fetchExecuteAFEData from '../src/scripts/executeFetchExecuteAFEData';
import { rows } from './test-utils/executeResponse';

describe('Execute Get AFES', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should return the AFEs and write them to Supabase', async () => {
        const rowsData = rows

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue(rowsData),
        }));

        const result = await fetchExecuteAFEData('123', 'abc');

        expect(result).toBe(rowsData.Rows);
        expect(fetch).toHaveBeenCalledWith('/api/api/Documents/Reporting/Execute', expect.any(Object));
    });

    it('should return null when response is not ok', async () => {
        const errorText = {
            "ClassName": "ENI.AFENAVIGATORSERVER.COMPONENTS.SESSION.EXCEPTIONS.SESSIONTOKENINVALIDEXCEPTION",
            "Message": "Session token is not valid",
            "Data": []
        }

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Internal Server Error'),
        }));

        const result = await fetchExecuteAFEData('123', 'abc');

        expect(result).toEqual([]);
        expect(fetch).toHaveBeenCalled();
    });

    it('should return null when fetch throws an error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

        const result = await fetchExecuteAFEData('123', 'abc');

        expect(result).toEqual([]);
        expect(fetch).toHaveBeenCalled();
    });
})
