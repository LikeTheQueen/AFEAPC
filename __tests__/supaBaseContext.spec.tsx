import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SupabaseProvider, useSupabaseData } from '../src/types/SupabaseContext';
import supabase from '../provider/supabase';
import type { Session } from '@supabase/supabase-js';
import type { AFEType, OperatorType } from 'src/types/interfaces';
import '@testing-library/jest-dom';


// Mock dependencies
vi.mock('../provider/fetch', async () => {
  return {
    fetchUserProfileRecordFromSupabase: vi.fn(),
  };
});



vi.mock('../provider/supabase', () => ({
  default: {
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }),
    },
  },
}));


// Create a test consumer
const TestComponent = () => {
  const { loggedInUser, loading, session } = useSupabaseData();
  return (
    <>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="loggedInUser">{JSON.stringify(loggedInUser)}</div>
      <div data-testid="session">{JSON.stringify(session)}</div>
    </>
  );
};

describe('SupabaseProvider', () => {
 const mockSession: Session = { access_token: 'abc', token_type: 'bearer', user: { id: '123' } } as any;

  beforeEach(() => {
    
  
    (supabase.auth.onAuthStateChange as any).mockImplementation((cb: any) => {
      cb('SIGNED_IN', mockSession);
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });
  });
  
  

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides afes, operators, loading, and session to consumers', async () => {
    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });
    expect(screen.getByTestId('session')).toHaveTextContent(JSON.stringify(mockSession));
  });

  it('throws error if useSupabaseData is used outside of provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    consoleError.mockRestore();
  });
});
