import { describe, it, expect, vi } from 'vitest';
import { processAFEDocIDsToDocHandle } from '../src/scripts/executeBatchProcessAFEDocIDToDocHandle';
import { singleExecuteIDDoc, twoExecuteIDDoc } from './test-utils/executeDocIDRecords';
import { docHandleResponse, twoDocHandleResponse } from './test-utils/executeResponse';

vi.mock('../src/scripts/executeAFEgetDocHandle', async (importOriginal) => {
    const actual = await importOriginal() as { [key: string]: any };
    return {
      ...actual,
      retryWithBackoff: vi.fn(),
    };
  });

  describe('processAFEDocIDsToDocHandle with a single record', () => {

    vi.mock('../src/scripts/executeAFEgetDocHandle', async (importOriginal) => {
        const actual = await importOriginal() as { [key: string]: any };
        return {
          ...actual,
          retryWithBackoff: vi.fn(),
        };
      });
    
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
      });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it('returns docHandleData when all calls succeed', async () => {
        const items = singleExecuteIDDoc;
        const docHandle = docHandleResponse;

        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => (docHandle),
          });
  
      const result = await processAFEDocIDsToDocHandle(items, 'authToken123', 1, 2000, 5);
      console.log(result)
      expect(result).toEqual([docHandle]);
      //expect(fetchExecuteAFEDocHandle).toHaveBeenCalledTimes(1);
    });
  
    it('returns null or handled error when individual fetch fails', async () => {
        const items = singleExecuteIDDoc;

        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Internal Server Error'),
          });
  
  
      const result = await processAFEDocIDsToDocHandle(items, 'authToken123', 5, 2000, 5);
      expect(result).toEqual([{error:'Failed to fetch item 123e4567-e89b-12d3-a456-426614174000: undefined',item: items[0]}]);
      //expect(fetchExecuteAFEDocHandle).toHaveBeenCalledTimes(1);
    });
  
  });

  describe('processAFEDocIDsToDocHandle with multiple records', () => {

    vi.mock('../src/scripts/executeAFEgetDocHandle', async (importOriginal) => {
        const actual = await importOriginal() as { [key: string]: any };
        return {
          ...actual,
          retryWithBackoff: vi.fn(),
        };
      });
    
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
      });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it('returns docHandleData when all calls succeed', async () => {
        const items = twoExecuteIDDoc;
        const docHandle = docHandleResponse;
        const docHandlesTwo = twoDocHandleResponse;

        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({ Rows: docHandle, docHandle }),
          });
  
      const result = await processAFEDocIDsToDocHandle(items, 'authToken123', 1, 2000, 5);
      console.log(result)
      expect(result).toEqual([{ Rows: docHandle, docHandle }]);
      //expect(fetchExecuteAFEDocHandle).toHaveBeenCalledTimes(1);
    });
  
  });


  