import { vi, test, expect, describe, afterEach } from 'vitest';
import { fetchRolesGeneric, fetchUserProfileRecordFromSupabase } from '../provider/fetch';
import { transformRolesGeneric, transformUserProfileRecordSupabase } from 'src/types/transform';

const mockSelectBasic = vi.fn();

const mockOrder = vi.fn();
const mockNeq = vi.fn(() => ({ order: mockOrder }));
const mockSelectRoles = vi.fn(() => ({ neq: mockNeq }));

const mockSingle = vi.fn();
const mockChain: any = {
  select: vi.fn(() => mockChain),
  eq: vi.fn(() => mockChain),
  limit: vi.fn(() => mockChain),
  single: mockSingle,
};

vi.mock('@supabase/supabase-js', () => {
  const mockFrom = vi.fn((table: string) => {
    if (table === 'SOURCE_SYSTEM') return { select: mockSelectBasic };
    if (table === 'ROLES') return { select: mockSelectRoles };
    if (table === 'USER_PROFILE') return mockChain;
    return {};
  });

  return {
    createClient: vi.fn(() => ({ from: mockFrom })),
  };
});

describe('fetchRolesGeneric', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns empty array on error', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

    const result = await fetchRolesGeneric();

    expect(result).toEqual([]);
  });

  test('returns empty array when data is null', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: null });

    const result = await fetchRolesGeneric();

    expect(result).toEqual([]);
  });

  test('returns transformed roles on success', async () => {
    const mockData = [{ id: 2, name: 'Admin' }, { id: 3, name: 'Viewer' }];
    mockOrder.mockResolvedValueOnce({ data: mockData, error: null });

    const result = await fetchRolesGeneric();

    expect(result).toEqual(transformRolesGeneric(mockData));
  });
});

describe('fetchUserProfileRecordFromSupabase', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns empty array on error', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

    const result = await fetchUserProfileRecordFromSupabase('test-token-string');

    expect(result).toBeNull();
  });

  test('returns empty array when data is null', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });

    const result = await fetchUserProfileRecordFromSupabase('test-token-string');

    expect(result).toBeNull();
  });

  test('returns transformed user on success', async () => {
    const mockData = [{ id: 2, name: 'Admin' }];
    mockSingle.mockResolvedValueOnce({ data: mockData, error: null });

    const result = await fetchUserProfileRecordFromSupabase('test-token-string');

    expect(result).toEqual(transformUserProfileRecordSupabase(mockData));
  });
});