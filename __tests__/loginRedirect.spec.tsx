// __tests__/LoginRedirect.spec.tsx
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render } from '@testing-library/react';
import LoginForm from '../src/routes/login';

vi.mock('../provider/supabase', () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'abc',
            user: { id: '123' },
          },
        },
      }),
      onAuthStateChange: vi.fn((cb) => {
        cb('SIGNED_IN', {
          access_token: 'abc',
          user: { id: '123' },
        });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
    },
  },
}));

describe('Login redirect', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { href: '', assign: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects to /mainscreen if user is already logged in', async () => {
    render(<LoginForm />);
    await new Promise((r) => setTimeout(r, 50)); 
    expect(location.href).toBe('/mainscreen');
  });
});
