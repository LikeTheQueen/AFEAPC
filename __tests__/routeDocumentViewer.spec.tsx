import { vi, type Mock } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';

vi.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess }: { 
    children: React.ReactNode, 
    onLoadSuccess: (args: { numPages: number }) => void 
  }) => {
    useEffect(() => {
      onLoadSuccess({ numPages: 4 });
    }, []);
    return <div data-testid="pdf-document">{children}</div>;
  },
  Page: ({ pageNumber }: { pageNumber: number }) => (
    <div data-testid="pdf-page">Page {pageNumber}</div>
  ),
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: '',
    },
  },
}));

import DocumentBrowser from 'src/routes/afeDashboard/routes/documentViewer';
import { useEffect } from 'react';

const mockFile = 'https://example.com/test.pdf';

describe('Document Browser',() => {
     let user: ReturnType<typeof userEvent.setup>;
 
     beforeEach(() => {
     user = userEvent.setup();
     });
 
     afterEach(() => {
         vi.resetAllMocks();
         vi.clearAllMocks();
 
     });
        test('renders the document browser', async () => {
        renderWithProviders(<DocumentBrowser file={mockFile} />);
        
        await waitFor(() => {
            expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-page')).toBeInTheDocument();
            expect(screen.getByText(/Showing page 1 of 4 Pages/i)).toBeInTheDocument();
        });

        
        const firstButton = screen.getByRole('listitem', {name: 'page 1'});
        const secondTolastButton = screen.getByRole('listitem', {name: 'page 3'});
        const previousPageButton = screen.getByRole('listitem', {name: 'Previous Page'});
        const nextPageButton = screen.getByRole('listitem', {name: 'Next Page'});
        expect(secondTolastButton).toBeVisible();
        expect(previousPageButton).toBeVisible();
        expect(nextPageButton).toBeVisible();
        expect(firstButton).toBeVisible();

        await user.click(nextPageButton);

        await waitFor(() => {
            expect(screen.getByText(/Showing page 2 of 4 Pages/i)).toBeInTheDocument();
        });

        await user.click(secondTolastButton);

        await waitFor(() => {
            expect(screen.getByText(/Showing page 3 of 4 Pages/i)).toBeInTheDocument();
        });

        const lastButton = screen.getByRole('listitem', {name: 'page 4'});
        expect(lastButton).toBeVisible();

        await user.click(lastButton);

        expect(document.querySelector('[aria-label="page 1"]')).not.toBeVisible();

        await user.click(previousPageButton);
        await user.click(previousPageButton);

        expect(screen.getByRole('listitem', {name: 'page 1'})).toBeVisible();

        await user.click(nextPageButton);
        await user.click(nextPageButton);

        expect(document.querySelector('[aria-label="page 1"]')).not.toBeVisible();

        });

        test('renders loading', async () => {
        renderWithProviders(<DocumentBrowser file={''} />);
        
        await waitFor(() => {
            expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        });

        
        });
});