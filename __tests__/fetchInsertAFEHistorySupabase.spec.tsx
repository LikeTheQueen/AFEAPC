import { vi, test, expect, describe, afterEach } from 'vitest';
import { addAFEHistorySupabase } from '../provider/fetch';

const mockInsert = vi.fn();

vi.mock('@supabase/supabase-js', () => {
  
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
  }));

  const mockClient = {
    from: mockFrom,
  };

  return {
    createClient: vi.fn(() => mockClient),
  };
});

describe('updateAFEPartnerStatusSupabase', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns "success" when update has no error', async () => {
    mockInsert.mockResolvedValueOnce({ data: [], error: null });

    const result = await addAFEHistorySupabase('id','description');
    expect(result).toBe('success');
  });

  test('returns [] when update has an error', async () => {
    mockInsert.mockResolvedValueOnce({ data: [], error: 'Error Updating AFE Status' });

    const result = await addAFEHistorySupabase('id', 'description');
    expect(result).toEqual([]);
  });
});
