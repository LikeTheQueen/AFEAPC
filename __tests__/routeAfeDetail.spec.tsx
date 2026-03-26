import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AFEDetailURL from '../src/routes/afeDashboard/routes/afeDetail';
import userEvent from '@testing-library/user-event';
import { setStatusBackgroundColor, setStatusRingColor, setStatusTextColor } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import { renderWithProviders } from './test-utils/renderWithOptions';
import * as XLSX from 'xlsx';
import { 
  singleAFEResultSupabase, 
  singleAFEEstimatesResponse, 
  singleAFEWellResponse, 
  loggedInUserRachelGreen, 
  singleAFEHistoryResponse,
  loggedInUserRossGeller,
  singleAFEAttachmentResponse,
  singleAFEDocResponse,
  singleAFESignedResponse } from './test-utils/rachelGreenuser';
// ─── Route config ─────────────────────────────────────────────────────────────
const afeID = '4b6cebbf-ca88-4e9e-8479-dd50cc13e03W';
const afeDetailRoute = `/mainscreen/afeDetail/${afeID}`;
const afeDetailPath = '/mainscreen/afeDetail/:afeID';

// ─── Supabase session ─────────────────────────────────────────────────────────
const mockSession = {
  access_token: 'fake-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    app_metadata: [],
    user_metadata: {},
  },
};

// ─── Mocks ───────────────────────────────────────────────────────────────────
 
vi.mock('../provider/fetch', () => ({
  fetchAFEDetails: vi.fn(),
  fetchAFEHistory: vi.fn(),
  fetchAFEEstimates: vi.fn(),
  fetchAFEDocs: vi.fn(),
  fetchAFEAttachments: vi.fn(),
  fetchAFESignedNonOp: vi.fn(),
  fetchAFEWells: vi.fn(),
  fetchRelatedDocuments: vi.fn(),
  addAFEHistorySupabase: vi.fn(() => Promise.resolve({ id: 999 })),
}));
 
vi.mock('src/routes/afeDashboard/routes/helpers/styleHelpers', () => ({
  setStatusTextColor: vi.fn((status) => status),
  setStatusBackgroundColor: vi.fn((status) => status),
  setStatusRingColor: vi.fn((status) => status),
}));
 
vi.mock('src/routes/afeDashboard/routes/helpers/helpers', () => ({
  handleOperatorArchiveStatusChange: vi.fn(),
  handlePartnerArchiveStatusChange: vi.fn(),
  usePartnerStatusChange: vi.fn(() => ({
    handlePartnerStatusChange: vi.fn(),
  })),
}));

vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

// ─── Render helper ────────────────────────────────────────────────────────────
 
import { fetchAFEDetails, fetchAFEHistory, fetchAFEEstimates, fetchAFEDocs, fetchAFEAttachments, fetchAFESignedNonOp, fetchAFEWells, fetchRelatedDocuments } from '../provider/fetch';
 
const setupFetchMocks = () => {
  vi.mocked(fetchAFEDetails).mockResolvedValue({ ok: true, data: singleAFEResultSupabase });
  vi.mocked(fetchAFEHistory).mockResolvedValue({ ok: true, data: singleAFEHistoryResponse });
  vi.mocked(fetchAFEEstimates).mockResolvedValue({ ok: true, data: singleAFEEstimatesResponse });
  vi.mocked(fetchAFEDocs).mockResolvedValue({ ok: true, data: singleAFEDocResponse });
  vi.mocked(fetchAFEAttachments).mockResolvedValue({ ok: true, data: singleAFEAttachmentResponse });
  vi.mocked(fetchAFESignedNonOp).mockResolvedValue({ ok: true, data: singleAFESignedResponse });
  vi.mocked(fetchAFEWells).mockResolvedValue({ ok: true, data: singleAFEWellResponse });
};

const setupFetchMocksNull = () => {
  vi.mocked(fetchAFEDetails).mockResolvedValue({ ok: false, message: 'Nothing here' });
  vi.mocked(fetchAFEHistory).mockResolvedValue({ ok: true, data: [] });
  vi.mocked(fetchAFEEstimates).mockResolvedValue({ ok: true, data: [] });
  vi.mocked(fetchAFEDocs).mockResolvedValue({ ok: true, data: [] });
  vi.mocked(fetchAFEAttachments).mockResolvedValue({ ok: true, data: [] });
  vi.mocked(fetchAFESignedNonOp).mockResolvedValue({ ok: true, data: [] });
  vi.mocked(fetchAFEWells).mockResolvedValue({ ok: true, data: [] });
};
 
const renderAFEDetail = () => {
  setupFetchMocks();
  return renderWithProviders(<AFEDetailURL />, {
    routePath: afeDetailRoute,
    routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
    supabaseOverrides: {
      loggedInUser: loggedInUserRachelGreen,
      loading: false,
      isSuperUser: false,
      session: mockSession as any,
    },
  });
};

const renderAFEDetailNull = () => {
  setupFetchMocksNull();
  return renderWithProviders(<AFEDetailURL />, {
    routePath: afeDetailRoute,
    routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
    supabaseOverrides: {
      loggedInUser: loggedInUserRachelGreen,
      loading: false,
      isSuperUser: false,
      session: mockSession as any,
    },
  });
};

const renderAFEDetailPartner = () => {
  setupFetchMocks();
  return renderWithProviders(<AFEDetailURL />, {
    routePath: afeDetailRoute,
    routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
    supabaseOverrides: {
      loggedInUser: loggedInUserRossGeller,
      loading: false,
      isSuperUser: false,
      session: mockSession as any,
    },
  });
};

describe('AFEDetailURL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
 
  it('renders You do not have permission to view this AFE', async () => {
    renderAFEDetailNull();
   
 await waitFor(() => {
      expect(screen.queryByText(/AFE Number/i)).not.toBeVisible();
    });
    
    const approveButton = document.querySelector('button[name="partnerApprove"]');
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).not.toBeVisible();
    const rejectButton = document.querySelector('button[name="partnerReject"]');
    expect(rejectButton).toBeInTheDocument();
    expect(rejectButton).not.toBeVisible();
    const partnerArchiveButton = document.querySelector('button[name="partnerArchive"]');
    expect(partnerArchiveButton).toBeInTheDocument();
    expect(partnerArchiveButton).not.toBeVisible();
    const operatorArchiveButton = document.querySelector('button[name="operatorArchive"]');
    expect(operatorArchiveButton).toBeInTheDocument();
    expect(operatorArchiveButton).not.toBeVisible();
    expect(screen.getByText(/You do not have permission to view this AFE/i)).toBeInTheDocument();
  });

  it('renders AFE details and history comments', async () => {
    renderAFEDetail();
 
    await waitFor(() => {
      expect(screen.getByText(/Yes I did/i)).toBeInTheDocument();
      expect(screen.getByText(/1. DRILLING/i)).toBeInTheDocument();
      expect(screen.getAllByText(/\$275,000.00/)[0]).toBeInTheDocument();
      expect(screen.getByText(/DR26NAVAT/i)).toBeInTheDocument();
      expect(screen.getAllByText(/DRAKE SURVEY-MASON #1/i)[0]).toBeInTheDocument();
    });
    const approveButton = document.querySelector('button[name="partnerApprove"]');
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).not.toBeVisible();
    const rejectButton = document.querySelector('button[name="partnerReject"]');
    expect(rejectButton).toBeInTheDocument();
    expect(rejectButton).not.toBeVisible();
    const partnerArchiveButton = document.querySelector('button[name="partnerArchive"]');
    expect(partnerArchiveButton).toBeInTheDocument();
    expect(partnerArchiveButton).not.toBeVisible();
    const operatorArchiveButton = document.querySelector('button[name="operatorArchive"]');
    expect(operatorArchiveButton).toBeInTheDocument();
    expect(operatorArchiveButton).toBeVisible();
    expect(screen.queryByText(/You do not have permission to view this AFE/i)).not.toBeVisible();
  });
 
  it('lets the user add a new comment and updates the UI', async () => {
    renderAFEDetail();
    const user = userEvent.setup();
 
    await waitFor(() => {
      expect(screen.getByText(/Yes I did/i)).toBeInTheDocument();
    });
 
    const textarea = screen.getAllByPlaceholderText(/add your comment/i);
    const commentButton = screen.getByRole('button', { name: /comment/i });
 
    await user.type(textarea[0], 'This is a new test comment');
    await user.click(commentButton);
 
    await waitFor(() => {
      expect(screen.getAllByText(/This is a new test comment/i).length).toBeGreaterThan(0);
    });
 
    
  });

  it('renders AFE details and history comments for the Partner', async () => {
    renderAFEDetailPartner();
 
    await waitFor(() => {
      expect(screen.getByText(/Yes I did/i)).toBeInTheDocument();
      expect(screen.getByText(/1. DRILLING/i)).toBeInTheDocument();
      expect(screen.getAllByText(/\$275,000.00/)[0]).toBeInTheDocument();
      expect(screen.getByText(/DR26NAVAT/i)).toBeInTheDocument();
      expect(screen.getAllByText(/DRAKE SURVEY-MASON #1/i)[0]).toBeInTheDocument();
    });
    const approveButton = document.querySelector('button[name="partnerApprove"]');
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).toBeVisible();
    const rejectButton = document.querySelector('button[name="partnerReject"]');
    expect(rejectButton).toBeInTheDocument();
    expect(rejectButton).toBeVisible();
    const partnerArchiveButton = document.querySelector('button[name="partnerArchive"]');
    expect(partnerArchiveButton).toBeInTheDocument();
    expect(partnerArchiveButton).toBeVisible();
    const operatorArchiveButton = document.querySelector('button[name="operatorArchive"]');
    expect(operatorArchiveButton).toBeInTheDocument();
    expect(operatorArchiveButton).not.toBeVisible();
    expect(screen.queryByText(/You do not have permission to view this AFE/i)).not.toBeVisible();
  });

  it('shows the Approve button and calls status functions when clicked', async () => {
  renderAFEDetailPartner();
  const user = userEvent.setup();

  await waitFor(() => {
    const approveButton = document.querySelector('button[name="partnerApprove"]');
    expect(approveButton).toBeVisible();
  });

  const approveButton = document.querySelector('button[name="partnerApprove"]')!;
  await user.click(approveButton as HTMLElement);

  expect(setStatusTextColor).toHaveBeenCalledWith('Approved');
  expect(setStatusBackgroundColor).toHaveBeenCalledWith('Approved');
  expect(setStatusRingColor).toHaveBeenCalledWith('Approved');
});

it('shows the Reject button and calls status functions when clicked', async () => {
  renderAFEDetailPartner();
  const user = userEvent.setup();

  await waitFor(() => {
    const rejectButton = document.querySelector('button[name="partnerReject"]');
    expect(rejectButton).toBeVisible();
  });

  const rejectButton = document.querySelector('button[name="partnerReject"]')!;
  await user.click(rejectButton as HTMLElement);

  expect(setStatusTextColor).toHaveBeenCalledWith('Rejected');
  expect(setStatusBackgroundColor).toHaveBeenCalledWith('Rejected');
  expect(setStatusRingColor).toHaveBeenCalledWith('Rejected');
});

  });
describe('AFEDetailURL documents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the document list when documents are returned', async () => {
    
    renderAFEDetail();

    await waitFor(() => {
      expect(screen.getByText(/Navigator Corporation AFE for John Ross Exploration Inc/i)).toBeInTheDocument();
    });
  });

  it('shows the no documents message when there are no documents', async () => {
    renderAFEDetail(); // default mocks return []

    await waitFor(() => {
      expect(screen.getByText(/There are no documents for this AFE/i)).toBeVisible();
    });
  });

  it('shows Download and View links for pdf documents', async () => {
    renderAFEDetail();

    await waitFor(() => {
      expect(screen.getAllByText(/Download/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/View/i).length).toBeGreaterThan(0);
    });
  });

  it('does not show View link for non-pdf documents', async () => {

    renderAFEDetail();

    await waitFor(() => {
      expect(screen.getByText(/Book1/i)).toBeInTheDocument();
    });
    const book1Item = screen.getByText(/Book1/i).closest('li');
  const viewLink = book1Item?.querySelector('li[hidden]');
  expect(viewLink).toBeInTheDocument();
  });
});
describe('AFEDetailURL document actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchRelatedDocuments when View is clicked on a pdf', async () => {
    vi.mocked(fetchAFEDocs).mockResolvedValue({ ok: true, data: singleAFEDocResponse } as any);
    vi.mocked(fetchAFEAttachments).mockResolvedValue({ ok: true, data: singleAFEAttachmentResponse } as any);
    vi.mocked(fetchAFESignedNonOp).mockResolvedValue({ ok: true, data: singleAFESignedResponse } as any);
    vi.mocked(fetchAFEDetails).mockResolvedValue({ ok: true, data: singleAFEResultSupabase } as any);
    vi.mocked(fetchAFEHistory).mockResolvedValue({ ok: true, data: singleAFEHistoryResponse } as any);
    vi.mocked(fetchAFEEstimates).mockResolvedValue({ ok: true, data: singleAFEEstimatesResponse } as any);
    vi.mocked(fetchAFEWells).mockResolvedValue({ ok: true, data: singleAFEWellResponse } as any);
    vi.mocked(fetchRelatedDocuments).mockResolvedValue({ ok: true, data: [{ uri: 'https://example.com/doc.pdf' }] } as any);

    renderWithProviders(<AFEDetailURL />, {
      routePath: afeDetailRoute,
      routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
      supabaseOverrides: {
        loggedInUser: loggedInUserRachelGreen,
        loading: false,
        isSuperUser: false,
        session: mockSession as any,
      },
    });

    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/Navigator Corporation AFE for John Ross Exploration Inc/i)).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText(/^View$/i);
    await user.click(viewLinks[0]);
    expect(fetchRelatedDocuments).toHaveBeenCalled();
  });

  it('calls fetchRelatedDocuments when Download is clicked', async () => {
    vi.mocked(fetchAFEDocs).mockResolvedValue({ ok: true, data: singleAFEDocResponse } as any);
    vi.mocked(fetchAFEAttachments).mockResolvedValue({ ok: true, data: [] } as any);
    vi.mocked(fetchAFESignedNonOp).mockResolvedValue({ ok: true, data: [] } as any);
    vi.mocked(fetchAFEDetails).mockResolvedValue({ ok: true, data: singleAFEResultSupabase } as any);
    vi.mocked(fetchAFEHistory).mockResolvedValue({ ok: true, data: singleAFEHistoryResponse } as any);
    vi.mocked(fetchAFEEstimates).mockResolvedValue({ ok: true, data: singleAFEEstimatesResponse } as any);
    vi.mocked(fetchAFEWells).mockResolvedValue({ ok: true, data: singleAFEWellResponse } as any);
    vi.mocked(fetchRelatedDocuments).mockResolvedValue({ ok: true, data: [{ uri: 'https://example.com/doc.pdf' }] } as any);

    renderWithProviders(<AFEDetailURL />, {
      routePath: afeDetailRoute,
      routes: [{ path: afeDetailPath, element: <AFEDetailURL /> }],
      supabaseOverrides: {
        loggedInUser: loggedInUserRachelGreen,
        loading: false,
        isSuperUser: false,
        session: mockSession as any,
      },
    });

    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getAllByText(/Download/i).length).toBeGreaterThan(0);
    });

    const downloadLinks = screen.getAllByText(/^Download$/i);
    await user.click(downloadLinks[0]);

    expect(fetchRelatedDocuments).toHaveBeenCalled();
  });

  it('calls XLSX writeFile when Export is clicked', async () => {
  renderAFEDetail();
  const user = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByText(/Export Line Items to Excel/i)).toBeInTheDocument();
  });

  await user.click(screen.getByText(/Export Line Items to Excel/i));

  expect(XLSX.writeFile).toHaveBeenCalledWith(expect.anything(), 'export.xlsx');
});
});
