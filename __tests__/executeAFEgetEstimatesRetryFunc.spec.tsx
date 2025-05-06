import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/scripts/executeFetchExecuteAFEEstimates', async () => {
  const actual = await vi.importActual<typeof import('../src/scripts/executeFetchExecuteAFEEstimates')>('../src/scripts/executeFetchExecuteAFEEstimates');
  return {
    ...actual,
    fetchExecuteAFEEstimates: vi.fn(), 
  };
});


import { retryWithBackoff as retry } from '../src/scripts/executeAFEgetEstimatesRetryFunc';
import { fetchExecuteAFEEstimates } from '../src/scripts/executeFetchExecuteAFEEstimates';
import { error } from 'console';

describe('retryWithBackoff', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('retries and eventually succeeds', async () => {
    vi.mocked(fetchExecuteAFEEstimates)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ success: true });

      const docID = '8910';
      const authToken = 'token';
      const docHandle = '123';
  
      const result = await retry(docHandle, authToken, 3, docID);

    expect(fetchExecuteAFEEstimates).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ success: true });
  });

  it('retries and eventually fails with error', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetchExecuteAFEEstimates)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ success: true });
    
      const docID = '8910';
      const authToken = 'token';
      const docHandle = '123';
  
      const result = await retry(docHandle, authToken, 3, docID);

    expect(fetchExecuteAFEEstimates).toHaveBeenCalledTimes(3);
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Retry 1 for item 123 failed. Retrying in 1000ms...'));
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Retry 2 for item 123 failed. Retrying in 2000ms...'));
    expect(result).toEqual({ success: true });
  });

  it('gives up after max retries', async () => {
    vi.mocked(fetchExecuteAFEEstimates)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValue(undefined);

    const docID = '8910';
    const authToken = 'token';
    const docHandle = '123';

    const result = await retry(docHandle, authToken, 3, docID);

    expect(fetchExecuteAFEEstimates).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ docHandle, error: 'Max retries reached' });
  },9000);

  it('Fails to get a response', async () => {
    vi.mocked(fetchExecuteAFEEstimates)
      .mockResolvedValue({
        error: Error('Cannot process AFEs'),
      });

      const docID = '8910';
      const authToken = 'token';
      const docHandle = '123';
  
      const result = await retry(docHandle, authToken, 3, docID);

    expect(fetchExecuteAFEEstimates).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ error: Error('Cannot process AFEs') });
  });
});
