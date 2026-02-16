// test-utils/renderWithProviders.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { SupabaseProvider } from '../../src/types/SupabaseContext';

export interface RenderOptions {
  routePath?: string; 
  routes?: RouteObject[];
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { routePath = '/', routes }: RenderOptions = {}) => {
  const defaultRoutes = [
    { path: routePath, element: ui },
  ];

  const router = createMemoryRouter(routes ?? defaultRoutes, {
    initialEntries: [routePath],
  }); 

  return render(
    <SupabaseProvider>
      <RouterProvider router={router} />
    </SupabaseProvider>
  );
};
