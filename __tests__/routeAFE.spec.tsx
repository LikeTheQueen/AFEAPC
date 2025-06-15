import AFE from '../src/routes/afeDashboard/routes/afe';
import * as fetchProvider from '../provider/fetch';
import { vi } from 'vitest';
import { getByTestId, render, screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils/renderWithOptions';
import { twoAFErecords, twoOperatedAFErecords, twoNonOperatedAFErecords } from './test-utils/afeRecords';

vi.mock('../provider/fetch', () => ({
  updateAFEPartnerStatusSupabase: vi.fn(),
  addAFEHistorySupabase: vi.fn(),
}));


describe('displaying AFEs', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })

  test('Shows data for two AFEs, one operated and one non operated', () => {
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        afes: twoAFErecords,
        loading: false,
      },
    });
  
    
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('OperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    expect(screen.getByTestId('NoOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();

    
  });

  test('Shows a statement that there are no Operated AFEs and shows Non-Op AFEs', () => {
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        afes: twoNonOperatedAFErecords,
        loading: false,
      },
    });

    
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NoOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistHeader')).toBeVisible();
    
  });

  test('Shows a statement that there are no Non-Operated AFEs and shows Operated AFEs', () => {
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        afes: twoOperatedAFErecords,
        loading: false,
      },
    });

    //expect(getByText('Navigator Corporation')).toBeVisible(); 
    expect(screen.getByTestId('OperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NoOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
  });

  test('Shows a statement that there are no Non-Operated or Operated AFEs', () => {
    const { getByText } = renderWithProviders(<AFE />, {
      supabaseOverrides: {
        afes: [],
        loading: false,
      },
    });

    expect(screen.getByTestId('OperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElistHeader')).not.toBeVisible();
    expect(screen.getByTestId('OperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NonOperatedAFElist')).not.toBeVisible();
    expect(screen.getByTestId('NoOperatedAFElist')).toBeVisible();
    expect(screen.getByTestId('NoNonOperatedAFElist')).toBeVisible();
  });

});

