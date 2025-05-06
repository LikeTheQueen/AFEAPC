import { render } from '@testing-library/react';
import { SupabaseProvider } from '../src/types/SupabaseContext';
import React from 'react';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <SupabaseProvider>{children}</SupabaseProvider>
);

export * from '@testing-library/react';
export const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllProviders, ...options });

