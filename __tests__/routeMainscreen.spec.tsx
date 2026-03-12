
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/renderWithOptions';
import MainScreen from '../src/routes/mainScreen';
import supabase from 'provider/supabase';

import {
  loggedInUserNoAFEViewRights,
  loggedInUserRachelGreen,
  loggedInUserRachelGreenNoRole2,
  loggedInUserRachelGreenCannotEditUsersNoRole4or5,
  loggedInUserRachelGreenCannotEditUsersNoRole4or5or8or9
} from './test-utils/rachelGreenuser';
import { loggedInUser, loggedInUserIsSuperUser } from './test-utils/afeRecords';

vi.mock('provider/supabase');

const navItems = ['AFEs', 'Archived AFEs', 'AFE History'];
const afeNavigation = [
  { id: 1, name: 'AFEs', href: "afe", initial: 'A' },
  { id: 2, name: 'Archived AFEs', href: "afeArchived", initial: 'A' },
  { id: 3, name: 'AFE History', href: "notifications", initial: 'H'  },
]
    const userSettingsNavigation = [
  { id: 1, name: 'Manage User Access', href: "manageUsers", initial: 'A' },
  { id: 2, name: 'Manage User Permissions', href: "managePermissions", initial: 'P' },
  { id: 3, name: 'Create Users', href: "createUser", initial: 'C' },
    ]
    const libraryNavigation = [
  { id: 1, name: 'Manage Operator Addresses', href: "editOperator", initial: 'O' },
  { id: 2, name: 'Configurations', href: "configurations", initial: 'C' },
  { id: 3, name: 'System History', href: "systemhistory", initial: 'S' },
]
    const help = [
  { id: 1, name: 'Missing an Operated AFE?', href: "missingAFEsupport", initial: 'M' },
  { id: 3, name: 'Contact Support', href: "contactsupport", initial: 'C' },
  { id: 4, name: 'Support History', href: "supporthistory", initial: 'S' }
]
const onboarding = [
  { id: 1, name: 'Create Operator', href: "createOperator", initial: 'O' },
  { id: 3, name: 'Manage All Users', href: "manageUsersSystem", initial: 'M' },
  { id: 4, name: 'Manage All User Permissions', href: "manageUserPermissionsSystem", initial: 'P' },
]

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
            }
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
describe('Mainscreen User Experience with a role for ops 2,4,8 and partners 3,9,5,6', async () => {
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
            }
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
  it('renders all main navigation items', () => {
    
    navItems.forEach(name => {
      // getAllByText because items appear in both mobile + desktop sidebars
      const elements = screen.getAllByText(name);
      expect(elements.length).toBeGreaterThan(0);
      elements.forEach(el => expect(el).toBeInTheDocument());
    });
    userSettingsNavigation.forEach(name => {
      const elements = screen.getAllByText(name.name);
      expect(elements.length).toBeGreaterThan(0);
      elements.forEach(el => expect(el).toBeInTheDocument());
    })
    libraryNavigation.forEach(name => {
      const elements = screen.getAllByText(name.name);
      expect(elements.length).toBeGreaterThan(0);
      elements.forEach(el => expect(el).toBeInTheDocument());
    })
    help.forEach(name => {
      expect(screen.queryByText(name.name)).toBeInTheDocument();
    })
    onboarding.forEach(item => {
    expect(screen.queryByText(item.name)).not.toBeInTheDocument();
    });
  });
  
    });
describe('Sidebar visibility by permissions', () => {

  describe('Rachel Green with a role for ops 2,4,8 and partners 3,9,5,6', () => {
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
            }
      });
    });

    it('can see AFE navigation', () => {
      afeNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
    it('can see User Settings navigation', () => {
      userSettingsNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
    it('can see Library navigation', () => {
      libraryNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
    it('can see Help navigation', () => {
      help.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });

    it('cannot see onboarding section', () => {
      onboarding.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });
  });

  describe('Rachel Green with a role for ops 2,4,8 and partners 3,9,5,6 NO operator role 2 - Cannot see Operated AFEs', () => {
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserRachelGreenNoRole2,
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
            }
      });
    });

    it('can still see AFE navigation via partner roles', () => {
      afeNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
  });

  describe('User with no AFE view rights', () => {
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserNoAFEViewRights,
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
            }
      });
    });
    it('cannot see AFE navigation', () => {
      afeNavigation.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });

    it('cannot see onboarding section', () => {
      onboarding.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });

   
  });

  describe('User with no User Edit Rights', () => {
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserRachelGreenCannotEditUsersNoRole4or5,
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
            }
      });
    });
    it('can see AFE navigation', () => {
      afeNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
it('can see User Settings navigation', () => {
      userSettingsNavigation.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });
    it('can see Library navigation', () => {
      libraryNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
    it('can see Help navigation', () => {
      help.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });

    it('cannot see onboarding section', () => {
      onboarding.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });

   
  });

  describe('User with no User Edit Rights or Manage Address or Configurations Rights', () => {
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserRachelGreenCannotEditUsersNoRole4or5or8or9,
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
            }
      });
    });
    it('can see AFE navigation', () => {
      afeNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
    it('can see User Settings navigation', () => {
      userSettingsNavigation.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });
    it('can see Library navigation', () => {
      libraryNavigation.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });
    it('can see Help navigation', () => {
      help.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });

    it('cannot see onboarding section', () => {
      onboarding.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });

   
  });

  describe('Logged in Super User', () => {
    beforeEach(() => {
      renderWithProviders(<MainScreen />, {
        supabaseOverrides: {
                loggedInUser: loggedInUserIsSuperUser,
                loading: false,
                isSuperUser: true,
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
            }
      });
    });

    it('can see AFE navigation', () => {
      afeNavigation.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });

    it('can see onboarding section', () => {
      onboarding.forEach(item => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
      });
    });
  });

});
