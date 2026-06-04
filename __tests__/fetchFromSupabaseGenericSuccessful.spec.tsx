import { vi, expect } from 'vitest';

describe('API Tests', () => {
    vi.mock('@supabase/supabase-js', () => ({
        createClient: vi.fn(() => ({
            from: vi.fn(() => ({
                select: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }], error: null })),
            })),
        })),
    }));

    it('should fetch table successfully', async () => {
        
    }), vi.clearAllMocks();
});

