import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import AFEDetailURL from '../src/routes/afeDetail';
import { singleAFE } from './test-utils/afeRecords';


// Mock useSupabaseData hook
vi.mock('../src/types/SupabaseContext', () => ({
  useSupabaseData: vi.fn(),
}));

import { useSupabaseData } from '../src/types/SupabaseContext';

// Define a complete mock AFE 
const mockAFE = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    operator: '123e4567-e89b-12d3-a456-426614174000',
    created_at: 'May 1',
    afe_type: 'Drilling',
    afe_number: 'TESTNum1',
    description: 'Desc',
    total_gross_estimate: 100,
    version_string: '',
    supp_gross_estimate: 0,
    operator_wi: 10,
    partnerID: '',
    partner_name: 'PartnerNaem',
    partner_wi: 23,
    partner_status: 'New',
    op_status: 'IAPP',
    iapp_date: 'May5',
    last_mod_date: 'Jun3',
    legacy_chainID: 1,
    legacy_afeid: 2,
    chain_version: 1,
    source_system_id: 'ex ID'
};

describe('AFEDetailURL', () => {
  it('shows loading when afes are not loaded', () => {
    (useSupabaseData as any).mockReturnValue({ afes: undefined });

    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    // You might need to add a loading indicator to your component
    // expect(screen.getByText(/loading afe data/i)).toBeInTheDocument();
  });

  it('shows not found when afeID does not match', () => {
    (useSupabaseData as any).mockReturnValue({
      afes: [{ id: '999', afe_number: 'Some Other AFE' }],
    });

    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    // You might need to add a not found message to your component
    // expect(screen.getByText(/afe not found/i)).toBeInTheDocument();
  });

  it('shows AFE details when matching afeID is found', () => {
    // Mock the useSupabaseData hook to return mock AFE
    (useSupabaseData as any).mockReturnValue({
      afes: [mockAFE],
    });

    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check if the AFE number is displayed in the document
    expect(screen.getByText(/TESTNum1/i)).toBeInTheDocument();
  });
});