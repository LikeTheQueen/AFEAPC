import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { vi } from 'vitest';
import AFEDetailURL from '../src/routes/afeDetail';
import userEvent from '@testing-library/user-event';
import { addAFEHistorySupabase } from '../provider/fetch';
import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import { useSupabaseData } from '../src/types/SupabaseContext';
import { handlePartnerStatusChange } from "src/routes/afeDashboard/routes/helpers/helpers";

// Mocks
let currentId = 100;
const mockAFE = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  operator: 'Operator Co',
  created_at: '2025-05-01',
  afe_type: 'Drilling',
  afe_number: 'TESTNum1',
  description: 'Description here',
  total_gross_estimate: 100000,
  version_string: 'v1',
  supp_gross_estimate: 0,
  operator_wi: 10,
  partnerID: 'partner-1',
  partner_name: 'PartnerName',
  partner_wi: 25,
  partner_status: 'New',
  op_status: 'IAPP',
  iapp_date: '2025-05-05',
  last_mod_date: '2025-06-03',
  legacy_chainID: 1,
  legacy_afeid: 2,
  chain_version: 1,
  source_system_id: 'system-1',
};
const mockAFEApproved = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  operator: 'Operator Co',
  created_at: '2025-05-01',
  afe_type: 'Drilling',
  afe_number: 'TESTNum1',
  description: 'Description here',
  total_gross_estimate: 100000,
  version_string: 'v1',
  supp_gross_estimate: 0,
  operator_wi: 10,
  partnerID: 'partner-1',
  partner_name: 'PartnerName',
  partner_wi: 25,
  partner_status: 'Approved',
  op_status: 'IAPP',
  iapp_date: '2025-05-05',
  last_mod_date: '2025-06-03',
  legacy_chainID: 1,
  legacy_afeid: 2,
  chain_version: 1,
  source_system_id: 'system-1',
};

const mockAFERejected = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  operator: 'Operator Co',
  created_at: '2025-05-01',
  afe_type: 'Drilling',
  afe_number: 'TESTNum1',
  description: 'Description here',
  total_gross_estimate: 100000,
  version_string: 'v1',
  supp_gross_estimate: 0,
  operator_wi: 10,
  partnerID: 'partner-1',
  partner_name: 'PartnerName',
  partner_wi: 25,
  partner_status: 'Rejected',
  op_status: 'IAPP',
  iapp_date: '2025-05-05',
  last_mod_date: '2025-06-03',
  legacy_chainID: 1,
  legacy_afeid: 2,
  chain_version: 1,
  source_system_id: 'system-1',
};

const mockEstimates = [
  {
    id: 1,
    amount_gross: 7777,
    partner_wi: 15,
    partner_net_amount: 1166.55,
    operator_account_number: '9210.212',
    operator_account_group: '1. DRILLING',
    operator_account_description: 'DRILLING RIG',
    partner_account_number: 'PA123',
  },
];

const mockHistoryData = [
  {
    id: 1,
    afe_id: mockAFE.id,
    created_at: new Date().toISOString(),
    description: 'Initial comment',
    type: 'action',
    user_id: {
      first_name: 'Test',
      last_name: 'User',
    },
  },
];

//Mock Supabase Context
vi.mock('../src/types/SupabaseContext', () => ({
  useSupabaseData: vi.fn(),
}));

// Mock transform functions
vi.mock('src/types/transform', () => ({
  transformEstimatesSupabase: vi.fn(data =>
    data.map((d: any) => ({
      ...d,
      amount_gross: d.amount_gross ?? 0,
      partner_net_amount: d.partner_net_amount ?? 0,
      operator_account_group: d.operator_account_group ?? 'Unknown',
      operator_account_description: d.operator_account_description ?? 'N/A',
      operator_account_number: d.operator_account_number ?? '0000',
      partner_account_number: d.partner_account_number ?? 'P-000',
    }))
  ),
  transformAFEHistorySupabase: vi.fn(data =>
    data.map((d: any) => ({
      ...d,
      user: `${d.user_id?.first_name ?? ''} ${d.user_id?.last_name ?? ''}`,
      created_at: d.created_at ?? new Date().toISOString(),
    }))
  ),
}));

// Mock Supabase fetches and context
vi.mock('../provider/fetch', () => ({
  fetchFromSupabaseMatchOnString: vi.fn(() => Promise.resolve(mockHistoryData)),
  fetchEstimatesFromSupabaseMatchOnAFEandPartner: vi.fn(() => Promise.resolve(mockEstimates)),
  addAFEHistorySupabase: vi.fn((afeID, comment, type) => {
    currentId++;
    return Promise.resolve({ id: currentId }); // Fake insert response
  }),
}));


vi.mock('src/helpers/styleHelpers', () => ({
  setStatusTextColor:vi.fn(),
  setStatusBackgroundColor: vi.fn(),
  setStatusRingColor: vi.fn(),
}));

vi.mock('../src/helpers/helpers', async () => {
  const actual = await vi.importActual<typeof import('../src/helpers/helpers')>('../src/helpers/helpers');
  return { ...actual, handlePartnerStatusChange: vi.fn() }
});



const useSupabaseDataMock = useSupabaseData as ReturnType<typeof vi.fn>;
const setAFEContext = (afe: any) => {
  useSupabaseDataMock.mockReturnValue({
    afes: [afe],
    refreshData: vi.fn(),
  });
};

describe('AFEDetailURL', () => {
beforeEach(() => {
  vi.resetAllMocks();
    useSupabaseDataMock.mockReset();
    setAFEContext(mockAFE);
  });

  it('renders AFE details and history comments', async () => {
    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // History comment
      expect(screen.getByText(/Initial comment/i)).toBeInTheDocument();

      // Estimate info
      expect(screen.getByText(/DRILLING RIG/i)).toBeInTheDocument();
      expect(screen.getByText(/\$7,777.00/)).toBeInTheDocument();
      expect(screen.getByText(/\$1,166.55/)).toBeInTheDocument();

      // AFE Header details
      expect(screen.getByText(/TESTNum1/i)).toBeInTheDocument();

      expect(setStatusTextColor).toBeCalledWith('Viewed');
      expect(setStatusBackgroundColor).toBeCalledWith('Viewed');
      expect(setStatusRingColor).toBeCalledWith('Viewed')
    });
    
  });

  it('lets the user add a new comment and updates the UI', async () => {
  render(
    <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
      <Routes>
        <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Wait for initial comment to render
  await waitFor(() => {
    expect(screen.getByText(/Initial comment/i)).toBeInTheDocument();
  });

  const textarea = screen.getByPlaceholderText(/add your comment/i);
  const commentButton = screen.getByRole('button', { name: /comment/i });

  // Type a new comment
  await user.type(textarea, 'This is a new test comment');

  // Click the "Comment" button
  await user.click(commentButton);

  // Wait for the new comment to appear
  await waitFor(() => {
    expect(
  screen.getAllByText(/This is a new test comment/i).some(
    el => el.tagName.toLowerCase() === 'p'
  )
).toBe(true);

  });

  // Confirm backend call
  expect(addAFEHistorySupabase).toHaveBeenCalledWith(
    mockAFE.id,
    'This is a new test comment',
    'comment'
  );
});
it('lets the user approve the AFE', async () => {
  render(
    <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
      <Routes>
        <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const approveButton = screen.getByRole('button', { name: /approve/i });

  // Click the "Comment" button
  await user.click(approveButton);

  // Confirm backend call
  expect(handlePartnerStatusChange).toHaveBeenCalledWith(
    mockAFE.id,
    'New',
    'Approved',
    'The partner marked the AFE as approved',
    'action'
  );
  expect(setStatusBackgroundColor).toHaveBeenCalledWith('Approved');
  expect(setStatusTextColor).toHaveBeenCalledWith('Approved');
  expect(setStatusRingColor).toHaveBeenCalledWith('Approved');
});

it('lets the user reject the AFE', async () => {
  render(
    <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
      <Routes>
        <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const rejectButton = screen.getByRole('button', { name: /reject/i });

  // Click the "Comment" button
  await user.click(rejectButton);

  // Confirm backend call
  expect(handlePartnerStatusChange).toHaveBeenCalledWith(
    mockAFE.id,
    'New',
    'Rejected',
    'The partner marked the AFE as rejected',
    'action'
  );
  expect(setStatusBackgroundColor).toHaveBeenCalledWith('Rejected');
  expect(setStatusTextColor).toHaveBeenCalledWith('Rejected');
  expect(setStatusRingColor).toHaveBeenCalledWith('Rejected');
});
});


describe('AFEDetailURL with Null AFE', () => {
  beforeEach(() => {
    useSupabaseDataMock.mockReset();
    setAFEContext({});
  });


  it('renders a blank screen without details', async () => {
    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // History comment
      expect(screen.getByText(/add your comment/i)).toBeInTheDocument();

      // AFE Header details
      expect(screen.getByText(/AFE Type/i)).toBeInTheDocument();

      expect(setStatusTextColor).toBeCalledWith('Viewed');
      expect(setStatusBackgroundColor).toBeCalledWith('Viewed');
      expect(setStatusRingColor).toBeCalledWith('Viewed')
    });
    
  });

  it('lets the user add a new comment and updates the UI even without an AFE', async () => {
  render(
    <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
      <Routes>
        <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Wait for initial comment to render
  const textarea = screen.getByPlaceholderText(/add your comment/i);
  const commentButton = screen.getByRole('button', { name: /comment/i });

  // Type a new comment
  await user.type(textarea, 'This is a new test comment');

  // Click the "Comment" button
  await user.click(commentButton);

  // Wait for the new comment to appear
  await waitFor(() => {
    expect(
  screen.getAllByText(/This is a new test comment/i).some(
    el => el.tagName.toLowerCase() === 'p'
  )
).toBe(true);

  });

  // Confirm backend call
  expect(addAFEHistorySupabase).toHaveBeenCalledWith(
    mockAFE.id,
    'This is a new test comment',
    'comment'
  );
});
});


describe('AFEDetailURL with Approved AFE', () => {
  beforeEach(() => {
    useSupabaseDataMock.mockReset();
    setAFEContext(mockAFEApproved);
  });

  it('Passes the status of Approved to determine css styling', async () => {
    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // History comment
      expect(screen.getByText(/Initial comment/i)).toBeInTheDocument();

      // Estimate info
      expect(screen.getByText(/DRILLING RIG/i)).toBeInTheDocument();
      expect(screen.getByText(/\$7,777.00/)).toBeInTheDocument();
      expect(screen.getByText(/\$1,166.55/)).toBeInTheDocument();

      // AFE Header details
      expect(screen.getByText(/TESTNum1/i)).toBeInTheDocument();

      expect(setStatusTextColor).toBeCalledWith('Approved');
      expect(setStatusBackgroundColor).toBeCalledWith('Approved');
      expect(setStatusRingColor).toBeCalledWith('Approved')
    });
    
  });

 
});


describe('AFEDetailURL with Rejected AFE', () => {
  beforeEach(() => {
    useSupabaseDataMock.mockReset();
    setAFEContext(mockAFERejected);
  });


  it('Passes the status of Rejected to determine css styling', async () => {
    render(
      <MemoryRouter initialEntries={['/mainscreen/afeDetail/123e4567-e89b-12d3-a456-426614174000']}>
        <Routes>
          <Route path="/mainscreen/afeDetail/:afeID" element={<AFEDetailURL />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // History comment
      expect(screen.getByText(/Initial comment/i)).toBeInTheDocument();

      // Estimate info
      expect(screen.getByText(/DRILLING RIG/i)).toBeInTheDocument();
      expect(screen.getByText(/\$7,777.00/)).toBeInTheDocument();
      expect(screen.getByText(/\$1,166.55/)).toBeInTheDocument();

      // AFE Header details
      expect(screen.getByText(/TESTNum1/i)).toBeInTheDocument();

      expect(setStatusTextColor).toBeCalledWith('Rejected');
      expect(setStatusBackgroundColor).toBeCalledWith('Rejected');
      expect(setStatusRingColor).toBeCalledWith('Rejected')
    });
    
  });

 
});
