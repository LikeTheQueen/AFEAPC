vi.mock('src/blocks/TextAnimations/FuzzyText/FuzzyText', () => ({
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}));

import { vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils/renderWithOptions';
import PageNotFound from 'src/routes/pageNotFound';
import { RachelGreen_AllPermissions_CW_NonOpCW } from './test-utils/afeRecords';

const mockProps = {
  message: "404 Not Found", 
  details: "The page you are looking for does not exist.",
  stack: "Error: Not Found\n    at router.tsx:42:5"
};

const supabaseOverrides = {
  loggedInUser: RachelGreen_AllPermissions_CW_NonOpCW,
  loading: false,
  isSuperUser: false,
  session: {
    access_token: 'test-token',
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
      user_metadata: {}
    }
  }
};

afterEach(() => cleanup());

describe('Page not Found', () => {
  test('Displays the stack trace when provided', () => {
    renderWithProviders(
      <PageNotFound message={mockProps.message} details={mockProps.details} stack={mockProps.stack} />,
      { supabaseOverrides }
    );
    // Match just the first line since \n breaks the text across elements
    expect(screen.getByText(/Error: Not Found/i)).toBeVisible();
  });

  
  test('Displays message via FuzzyText when stack is undefined', () => {
    renderWithProviders(
      <PageNotFound message={mockProps.message} details={mockProps.details} stack={undefined} />,
      { supabaseOverrides }
    );
    expect(screen.getByText(/404 Not Found/i)).toBeVisible();
    expect(screen.getByText(/The page you are looking for/i)).toBeVisible();
    // Stack pre element should not be present
    expect(screen.queryByRole('code')).not.toBeInTheDocument();
  });
});