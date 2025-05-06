// __tests__/LandingPage.spec.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithProviders';
import MainScreen from '../src/routes/mainScreen';

describe('Mainscreen', async () => {
  const user = userEvent.setup();
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        routePath: '/mainscreen',
        routes: [
          { path: '/mainscreen', element: <MainScreen /> },
          { path: '/mainscreen/afe', element: <div>AFEs</div> },
          { path: '/mainscreen/afeHistory', element: <div>AFE History</div> },
          { path: '/mainscreen/configurations', element: <div>Configurations</div> }
        ],
      });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

  it('Displays /afe in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /AFEs/i }));

    expect(await screen.findByText('AFEs')).toBeInTheDocument();
  });
  it('Displays /afeHistory in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /AFE Histories/i }));

    expect(await screen.findByText('AFE History')).toBeInTheDocument();
  });
  it('Displays /configurations in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Configurations/i }));

    expect(await screen.findByText('Configurations')).toBeInTheDocument();
  });
});
