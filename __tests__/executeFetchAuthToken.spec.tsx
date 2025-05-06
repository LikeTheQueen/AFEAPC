import { describe, it, expect, vi } from 'vitest';
import fetchAuthToken from '../src/scripts/executeFetchAuthToken';

describe('Execute Login', () => {
    beforeEach(() => {
        vi.restoreAllMocks(); // Reset mocks between tests
      });

    it('Should return authentication token when response is ok', async () => {
    const mockToken = 'mocked-token-123';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ AuthenticationToken: mockToken }),
    }));

    const result = await fetchAuthToken('123', 'abc', '/auth', 'https://api.example.com');

    expect(result).toBe(mockToken);
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/auth', expect.any(Object));
  });

  it('Should return null when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
    }));

    const result = await fetchAuthToken('123', 'abc', '/auth', 'https://api.example.com');

    expect(result).toEqual(new Error('Request Failed and could not login'));
    expect(fetch).toHaveBeenCalled();
  });

  it('Should return null when fetch throws an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const result = await fetchAuthToken('123', 'abc', '/auth', 'https://api.example.com');

    expect(result).toEqual(new Error('Request Failed and could not login'));
    expect(fetch).toHaveBeenCalled();
  });
});