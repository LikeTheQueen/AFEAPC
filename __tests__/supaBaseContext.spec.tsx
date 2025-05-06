import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SupabaseProvider, useSupabaseData } from '../src/types/SupabaseContext';
import { fetchFromSupabase } from '../provider/fetch';
import { transformAFEs, transformOperator } from '../src/types/transform';
import supabase from '../provider/supabase';
import * as fetchModule from '../provider/fetch';
import type { Session } from '@supabase/supabase-js';
import React from 'react';
import type { AFEType, OperatorType } from 'src/types/interfaces';
import '@testing-library/jest-dom';


// Mock dependencies
vi.mock('../provider/fetch', async () => {
  return {
    fetchFromSupabase: vi.fn(), 
  };
});

vi.mock('../src/types/transform', async () => {
  return {
  transformAFEs: vi.fn(),
  transformOperator: vi.fn(),
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
  const { afes, operators, loading, session } = useSupabaseData();
  return (
    <>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="afes">{JSON.stringify(afes)}</div>
      <div data-testid="operators">{JSON.stringify(operators)}</div>
      <div data-testid="session">{JSON.stringify(session)}</div>
    </>
  );
};

describe('SupabaseProvider', () => {
  const mockAFEs = [{ id: 1, afe_number: 'AFE123' }];
  const mockOperators = [{ id: 1, name: 'Operator X' }];
  const transformedAFEs: AFEType[] = [{ id:'123e4567-e89b-12d3-a456-426614174000', operator:'123e4567-e89b-12d3-a456-426614174000', created_at:'May 1', afe_type: 'Drilling', afe_number:'TESTNum1', description:'Desc', total_gross_estimate:100, version_string:'', supp_gross_estimate:0, operator_wi:10, partnerID:'', partner_name:'PartnerNaem', partner_wi:23, partner_status:'New', op_status:'IAPP', iapp_date:'May5', last_mod_date:'Jun3', legacy_chainID:1, legacy_afeid:2, chain_version:1, source_system_id:'ex ID' }];
  const transformedOperators: OperatorType[] = [{ id:'123e4567-e89b-12d3-a456-426614174000', created_at:'May 1', name:'Nav Oil', base_url:'', key:'', docID:'' }];
  const mockSession: Session = { access_token: 'abc', token_type: 'bearer', user: { id: '123' } } as any;

  beforeEach(() => {
    vi.mocked(fetchFromSupabase).mockImplementation(
      async (table: string, _select: string): Promise<any> => {
        if (table === 'AFE_PROCESSED') {
          return mockAFEs;
        }
        if (table === 'OPERATORS') {
          return mockOperators;
        }
        return [];
      }
    );
  
    vi.mocked(transformAFEs).mockReturnValue(transformedAFEs);
    vi.mocked(transformOperator).mockReturnValue(transformedOperators);

  
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
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    expect(screen.getByTestId('afes')).toHaveTextContent(JSON.stringify(transformedAFEs));
    expect(screen.getByTestId('operators')).toHaveTextContent(JSON.stringify(transformedOperators));
    expect(screen.getByTestId('session')).toHaveTextContent(JSON.stringify(mockSession));
  });

  it('throws error if useSupabaseData is used outside of provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    consoleError.mockRestore();
  });
});
