import { describe, it, expect, vi } from 'vitest';


vi.mock('../src/scripts/executeFetchExecuteAFEDocHandle', async () => {
  const actual = await vi.importActual<typeof import('../src/scripts/executeFetchExecuteAFEDocHandle')>('../src/scripts/executeFetchExecuteAFEDocHandle');
  return {
    ...actual,
    fetchExecuteAFEDocHandle: vi.fn(), // Replace the fetch
  };
});

import { retryWithBackoff as retry } from '../src/scripts/executeBatchProcessAFEDocIDToDocHandle';
import { fetchExecuteAFEDocHandle } from '../src/scripts/executeFetchExecuteAFEDocHandle';


describe('retryWithBackoff', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('retries and eventually succeeds', async () => {
    vi.mocked(fetchExecuteAFEDocHandle)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ success: true });

    const fakeItem = { docID: '123' } as any;
    const fakeAuthToken = 'token';

    const result = await retry(fakeItem, fakeAuthToken, 5);

    expect(fetchExecuteAFEDocHandle).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ success: true });
  });

  it('gives up after max retries', async () => {
    vi.mocked(fetchExecuteAFEDocHandle)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValue(undefined);

    const fakeItem = { docID: '456' } as any;
    const fakeAuthToken = 'token';

    const result = await retry(fakeItem, fakeAuthToken, 3);

    expect(fetchExecuteAFEDocHandle).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ item: fakeItem, error: 'Max retries reached' });
  },9000);
});
