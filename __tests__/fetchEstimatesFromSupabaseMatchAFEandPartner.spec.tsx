import { vi, test, expect, describe, afterEach } from 'vitest';
import { fetchEstimatesFromSupabaseMatchOnAFEandPartner } from '../provider/fetch';

const mockEq = vi.fn();

vi.mock('@supabase/supabase-js', () => {
    const mockEqual = vi.fn(() => ({
        eq: mockEq
      }));

    const mockSelect = vi.fn(() => ({
    eq: mockEqual
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

describe('fetchEstimatesFromSupabaseMatchOnAFEandPartner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns record when update has no error', async () => {
    mockEq.mockResolvedValueOnce({ data: [{
        "status": 204,
        "statusText": "No Content"
      }], error: null });

    const result = await fetchEstimatesFromSupabaseMatchOnAFEandPartner('AFEID','PARTNERID');
    expect(result).toEqual([{
        "status": 204,
        "statusText": "No Content"
      }]);
  });

  test('returns [] when insert has an error', async () => {
    mockEq.mockResolvedValueOnce({ data: [], error: 'Error getting AFE Estimates' });

    const result = await fetchEstimatesFromSupabaseMatchOnAFEandPartner('AFEID','PARTNERID');
    expect(result).toEqual([]);
  });
});
