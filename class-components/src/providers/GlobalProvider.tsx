import type { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
import { queryClient } from '../query-client';
import { QueryClientProvider } from '@tanstack/react-query';

export default function GlobalProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
