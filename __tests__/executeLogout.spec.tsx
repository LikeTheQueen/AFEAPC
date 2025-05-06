import { describe, it, expect, vi } from 'vitest';
import executeLogout from '../src/scripts/executeLogout';

describe('Execute Logout', () => {
    beforeEach(() => {
        vi.restoreAllMocks(); // Reset mocks between tests
      });

    it('Should return Success when response is ok', async () => {
    const mockLoggedOut = true;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ LoggedOut: mockLoggedOut }),
    }));

    const result = await executeLogout('123', '/logout', 'https://api.example.com');

    expect(result).toBe('Success');
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/logout', expect.any(Object));
  });

  it('Should return null when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Internal Server Error'),
    }));

    const result = await executeLogout('123', '/logout', 'https://api.example.com');

    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });

  it('Should return null when fetch throws an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const result = await executeLogout('123', '/logout', 'https://api.example.com');

    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });
});