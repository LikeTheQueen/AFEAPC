import { vi, test, expect, describe, afterEach } from 'vitest';
import { updateAFEPartnerStatusSupabase } from '../provider/fetch';

const mockEq = vi.fn();

vi.mock('@supabase/supabase-js', () => {
  const mockUpdate = vi.fn(() => ({
    eq: mockEq,
  }));

  const mockFrom = vi.fn(() => ({
    update: mockUpdate,
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
    mockEq.mockResolvedValueOnce({ data: [], error: null });

    const result = await updateAFEPartnerStatusSupabase('id');
    expect(result).toBe('success');
  });

  test('returns [] when update has an error', async () => {
    mockEq.mockResolvedValueOnce({ data: [], error: 'Error Updating AFE Status' });

    const result = await updateAFEPartnerStatusSupabase('id');
    expect(result).toEqual([]);
  });
});
