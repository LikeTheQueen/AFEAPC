import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { SupabaseContext } from '../../src/types/SupabaseContext';
import type { SupabaseContextType } from '../../src/types/SupabaseContext';

export interface RenderOptions {
  routePath?: string; 
  routes?: RouteObject[];
  supabaseOverrides?: Partial<SupabaseContextType>;
}

// 👉 Test-only SupabaseProvider
const TestSupabaseProvider = ({
  children,
  overrides = {},
}: {
  children: React.ReactNode;
  overrides: Partial<SupabaseContextType>;
}) => {
  const defaultValue: SupabaseContextType = {
    afes: undefined,
    loggedInUser: null,
    isSuperUser: false,
    loading: false,
    session: null,
    refreshData: async()=>{},
    ...overrides, // <-- inject your test values here
  };
  console.log('Rendering TestSupabaseProvider with value:', defaultValue);

  return (
    <SupabaseContext.Provider value={defaultValue}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  { routePath = '/', routes, supabaseOverrides = {} }: RenderOptions = {}
) => {
  const defaultRoutes = [
    { path: routePath, element: ui },
  ];

  const router = createMemoryRouter(routes ?? defaultRoutes, {
    initialEntries: [routePath],
  });

  return render(
    <TestSupabaseProvider overrides={supabaseOverrides}>
      <RouterProvider router={router} />
    </TestSupabaseProvider>
  );
};
