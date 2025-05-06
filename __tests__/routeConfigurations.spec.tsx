// __tests__/LandingPage.spec.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithProviders';
import Configurations from '../src/routes/configurations';

describe('Configurations', () => {
  const user = userEvent.setup();
    beforeEach(() => {
      renderWithProviders(<Configurations />, {
        routePath: '/mainscreen/configurations',
        routes: [
          { path: '/mainscreen/configurations', element: <Configurations /> },
          { path: '/mainscreen/configurations/systemConfigurations', element: <div>System Connections</div> },
          { path: '/mainscreen/configurations/dataexport', element: <div>Data Export</div> },
          { path: '/mainscreen/configurations/gllibrary', element: <div>GL Library</div> },
          { path: '/mainscreen/configurations/partnerlibrary', element: <div>Partner Library</div> }
        ],
      });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

  it('Displays /systemConfigurations in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /System Connections/i }));

    expect(await screen.findByText('System Connections')).toBeInTheDocument();
  });

  it('Displays /dataexport in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Data Export/i }));

    expect(await screen.findByText('Data Export')).toBeInTheDocument();
  });

  it('Displays /gllibrary in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /GL Library/i }));

    expect(await screen.findByText('GL Library')).toBeInTheDocument();
  });

  it('Displays /partnerLibrary in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Partner Library/i }));

    expect(await screen.findByText('Partner Library')).toBeInTheDocument();
  });
});
