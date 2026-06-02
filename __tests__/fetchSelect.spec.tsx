import { vi, test, expect, describe, afterEach } from 'vitest';
import { fetchSourceSystems, fetchNonOpList } from '../provider/fetch';

const mockSelect = vi.fn();

vi.mock('@supabase/supabase-js', () => {
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

describe('fetchSourceSystems', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns ok:false and empty data on error', async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: { message: 'DB connection failed' } });

    const result = await fetchSourceSystems();

    expect(result).toEqual({
      ok: false,
      data: [],
      message: 'DB connection failed',
    });
  });

  test('returns ok:true and data on success', async () => {
    const mockData = [{ id: 1, system: 'SystemA' }, { id: 2, system: 'SystemB' }];
    mockSelect.mockResolvedValueOnce({ data: mockData, error: null });

    const result = await fetchSourceSystems();

    expect(result).toEqual({
      ok: true,
      data: mockData,
      message: '',
    });
  });
});





