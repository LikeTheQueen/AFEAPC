
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import MainScreen from '../src/routes/mainScreen';
import supabase from 'provider/supabase';

import {
  loggedInUserRachelGreen
} from './test-utils/rachelGreenuser';

vi.mock('provider/supabase');

describe('Mainscreen', async () => {
  const user = userEvent.setup();
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        routePath: '/mainscreen',
        routes: [
    {
      path: '/mainscreen',
      element: <MainScreen />,
      children: [
        { path: 'afe', element: <h1>AFEs</h1> },
        { path: 'afeArchived', element: <h1>AFE History</h1> },
        { path: 'configurations', element: <h1>Configurations</h1> },
        { path: 'notifications', element: <h1>Notifications</h1> },
      ],
    },
  ],
      });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

  it('Displays /afe in the Outlet when clicked', async () => {
    const afeLink = screen.getAllByRole('link', { name: /AFEs$/i });
    await user.click(afeLink[0]);

    expect(
      await screen.findByRole('heading', { name: /^AFEs$/ })
    ).toBeInTheDocument()

    //expect(await screen.findByText('AFEs')).toBeInTheDocument();
  });
  it('Displays /afeHistory in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Archived AFEs/i }));

    expect(
      await screen.findByRole('heading', { name: /^AFE History$/ })
    ).toBeInTheDocument()
    
  });
  it('Displays /configurations in the Outlet when clicked', async () => {
    await user.click(screen.getByRole('link', { name: /Configurations/i }));

    expect(
      await screen.findByRole('heading', { name: /^Configurations$/ })
    ).toBeInTheDocument()

  });
  it('Opens the sidebar when the hamburger button is clicked', async () => {
  await user.click(screen.getByRole('button', { name: /Open sidebar/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('Closes the sidebar when the X button is clicked', async () => {
    await user.click(screen.getByRole('button', { name: /Open sidebar/i }));
    await user.click(screen.getByRole('button', { name: /Close sidebar/i }));

    await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  it('Closes the sidebar when a nav link is clicked', async () => {
    await user.click(screen.getByRole('button', { name: /Open sidebar/i }));
    const afeLink = screen.getAllByRole('link', { name: /AFEs$/i });
    await user.click(afeLink[0]);
    await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  });
describe('Mainscreen User Experience', async () => {
  const user = userEvent.setup();
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserRachelGreen,
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
                  app_metadata:[],
                  user_metadata:{}
                }
              },
            },
        routePath: '/mainscreen',
        routes: [
    {
      path: '/mainscreen',
      element: <MainScreen />,
      children: [
        { path: 'afe', element: <h1>AFEs</h1> },
        { path: 'afeArchived', element: <h1>AFE History</h1> },
        { path: 'configurations', element: <h1>Configurations</h1> },
        { path: 'notifications', element: <h1>Notifications</h1> },
      ],
    },
  ],
      });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
  
  it('Displays the logged in users name in the header', async () => {
  expect(screen.getByText('Rachel Green')).toBeInTheDocument();
});
  it('Calls supabase signOut when Sign out is clicked', async () => {
  
  await user.click(screen.getByRole('button', { name: /open user menu/i }));
  await user.click(screen.getByRole('menuitem', { name: /sign out/i }));
 
  await waitFor(() => {
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
  
});
    });
