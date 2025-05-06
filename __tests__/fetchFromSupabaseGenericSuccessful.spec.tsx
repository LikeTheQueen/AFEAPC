import { vi, expect } from 'vitest';
import { fetchFromSupabase } from '../provider/fetch';

describe('API Tests', () => {
    vi.mock('@supabase/supabase-js', () => ({
        createClient: vi.fn(() => ({
            from: vi.fn(() => ({
                select: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }], error: null })),
            })),
        })),
    }));

    it('should fetch table successfully', async () => {
        const projects = await fetchFromSupabase('table', 'items');
        expect(projects).toEqual([{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }]);
    }), vi.clearAllMocks();
});

