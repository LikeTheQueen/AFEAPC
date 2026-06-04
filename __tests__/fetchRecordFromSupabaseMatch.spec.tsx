import { vi, test, expect, describe, afterEach } from 'vitest';

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


