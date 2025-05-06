import { vi, test, expect, describe, afterEach } from 'vitest';
import { fetchFromSupabaseMatchOnString } from '../provider/fetch';

const mockEq = vi.fn();

vi.mock('@supabase/supabase-js', () => {
  const mockSelect = vi.fn(() => ({
    eq: mockEq,
  }));

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));

  const mockClient = {
    from: mockFrom,
  };

  return {
    createClient: vi.fn(() => mockClient),
  };
});

describe('fetchFromSupabaseMatchOnString', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns record when update has no error', async () => {
    mockEq.mockResolvedValueOnce({ data: [{
        "status": 204,
        "statusText": "No Content"
      }], error: null });

    const result = await fetchFromSupabaseMatchOnString('AFE','*','COL','EQUAL');
    expect(result).toEqual([{
        "status": 204,
        "statusText": "No Content"
      }]);
  });

  test('returns [] when insert has an error', async () => {
    mockEq.mockResolvedValueOnce({ data: [], error: 'Error Updating AFE Status' });

    const result = await fetchFromSupabaseMatchOnString('AFE','*','COL','EQUAL');
    expect(result).toEqual([]);
  });
});
