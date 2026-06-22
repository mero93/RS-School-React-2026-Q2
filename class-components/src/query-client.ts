'use client';

import { QueryClient } from '@tanstack/react-query';

const CACHE_TTL = Number(process.env.NEXT_PUBLIC_VITE_CACHE_TTL) || 300000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TTL,
      gcTime: CACHE_TTL,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
