// __tests__/LandingPage.spec.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithProviders';
import Configurations from '../src/routes/parentPages/routes/configurations';

describe('Configurations', () => {
  const user = userEvent.setup();
    beforeEach(() => {
      renderWithProviders(<Configurations />, {
        routePath: '/mainscreen/configurations',
        routes: [
          { path: '/mainscreen/configurations', element: <Configurations /> },
          { path: '/mainscreen/configurations/systemConfigurations', element: <div>System Connections Outlet</div> },
          { path: '/mainscreen/configurations/executeafefilters', element: <div>Data Integration Outlet</div> },
          { path: '/mainscreen/configurations/glmapping', element: <div>GL Mapping Outlet</div> },
          { path: '/mainscreen/configurations/partnermapping', element: <div>Partner Mapping Outlet</div> }
        ],
      });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

  it('Displays /systemConfigurations in the Outlet when clicked', async () => {
    const systemConnections = screen.getByRole('link', { name: /System Connections/i });
    await user.click(systemConnections);
    const systemConnectionsSublistOption1 = screen.getByRole('link', { name: /Quorum Execute/i });
    await user.click(systemConnectionsSublistOption1);
    expect(await screen.findByText('System Connections Outlet')).toBeInTheDocument();

  });

  it('Displays /executeafefilters in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Data Integration Parameters/i }));

    const systemConnectionsSublistOption1 = screen.getByRole('link', { name: /Quorum Execute/i });
    await user.click(systemConnectionsSublistOption1);
    expect(await screen.findByText('Data Integration Outlet')).toBeInTheDocument();
  });

  it('Displays /glmapping in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /GL Library/i }));

    const systemConnectionsSublistOption1 = screen.getByRole('link', { name: /Map GL Codes/i });
    await user.click(systemConnectionsSublistOption1);
    expect(await screen.findByText('GL Mapping Outlet')).toBeInTheDocument();
  });

  it('Displays /partnermaping in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Partner Library/i }));

    const systemConnectionsSublistOption1 = screen.getByRole('link', { name: /Map Partner Library/i });
    await user.click(systemConnectionsSublistOption1);
    expect(await screen.findByText('Partner Mapping Outlet')).toBeInTheDocument();
  });
});
