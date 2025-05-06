import { vi, test, expect, describe, afterEach } from 'vitest';
import { writeExecuteAFEtoSupabase, writeExecuteAFEEstimatesSupabase } from '../provider/writeExecuteRecords';
import { error } from 'console';

const mockInsert = vi.fn();

vi.mock('@supabase/supabase-js', () => {
  
  const mockFrom = vi.fn(() => ({
    upsert: mockInsert,
  }));

  const mockClient = {
    from: mockFrom,
  };

  return {
    createClient: vi.fn(() => mockClient),
  };
});

describe('Write Execute AFE Data to Supabase', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns "success" when update has no error', async () => {
    mockInsert.mockResolvedValueOnce({ data: [], error: null });

    const result = await writeExecuteAFEtoSupabase('resoure', []);
    expect(result).toBe('Success');
  });

  test('returns error when update has an error', async () => {
    mockInsert.mockResolvedValueOnce({ data: [], error: 'Error Writing AFEs' });

    const result = await writeExecuteAFEtoSupabase('resoure', []);
    expect(result).toEqual('Error Writing AFEs');
  });
});

describe('Write Execute AFE Estimates to Supabase', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
  
    test('returns "success" when update has no error', async () => {
        mockInsert.mockResolvedValueOnce({ data: [], error: null });
  
      const result = await writeExecuteAFEEstimatesSupabase('resoure', []);
      expect(result).toBe('Success');
    });
  
    test('returns error when update has an error', async () => {
        mockInsert.mockResolvedValueOnce({ data: [], error: 'Error Writing AFE Estimates' });
  
      const result = await writeExecuteAFEEstimatesSupabase('resoure', []);
      expect(result).toEqual('Error Writing AFE Estimates');
      
    });
  });
