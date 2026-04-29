import { describe, it, expect, vi } from 'vitest';
import { fetchExecuteAFEDocHandle } from '../src/scripts/executeFetchExecuteAFEDocHandle';
import { singleExecuteIDDoc } from './test-utils/executeDocIDRecords';
import { docHandleResponse } from './test-utils/executeResponse';

describe('Execute Get AFE Doc Handles', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Should return AFE Doc Handles', async () => {
        const items = singleExecuteIDDoc
        const docHandle = docHandleResponse

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue(docHandle),
        }));

        const result = await fetchExecuteAFEDocHandle( items[0], 'auth-token');
        expect(result).toBe(docHandle);

    });

    it('should return null when response is not ok', async () => {
        const docHandle = docHandleResponse
        const items = singleExecuteIDDoc
        const errorText = {
            "error": "Failed to fetch item 123e4567-e89b-12d3-a456-426614174000: undefined",
            "item": items[0],
          }
        
            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Internal Server Error'),
            }));
    
            const result = await fetchExecuteAFEDocHandle( items[0], 'auth-token');
    
            expect(result).toEqual(errorText);
            expect(fetch).toHaveBeenCalled();
    });

    it('should return the item and error when fetch throws an error', async () => {
        const items = singleExecuteIDDoc
        const docHandle = docHandleResponse 
        const errorText = {
            "item": items[0],
            "error": "Network error",
          }   
        
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    
            const result = await fetchExecuteAFEDocHandle( items[0], 'auth-token');
    
            expect(result).toEqual(errorText);
            expect(fetch).toHaveBeenCalled();
    });

    
})
