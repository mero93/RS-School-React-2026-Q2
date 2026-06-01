import '@testing-library/jest-dom';
import React, { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import mockComics from './__tests__/comics.json';
import { MemoryRouter } from 'react-router-dom';
import GlobalProvider from './providers/GlobalProvider';

vi.mock('./services/api.service', () => {
  return {
    ApiService: {
      search: vi
        .fn()
        .mockImplementation(
          async (title = '', pageNumber = 0, pageSize = 10) => {
            const filtered = mockComics.filter((item) =>
              item.title.toLowerCase().includes(title.toLowerCase())
            );

            const totalElements = filtered.length;
            const totalPages = Math.ceil(totalElements / pageSize);
            const start = pageNumber * pageSize;
            const end = start + pageSize;
            const pagedItems = filtered.slice(start, end);

            return {
              comicStrips: pagedItems,
              page: {
                pageNumber,
                pageSize,
                numberOfElements: pagedItems.length,
                totalElements,
                totalPages,
              },
            };
          }
        ),
      getOne: vi.fn().mockImplementation(async (uid: string) => {
        const item = mockComics.find((c) => c.uid === uid);
        if (!item) throw new Error('Comic not found');
        return item;
      }),
    },
  };
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { initialEntries?: string[] }
) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });

  const Wrapper = ({ children }: { readonly children: ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <GlobalProvider>
        <MemoryRouter initialEntries={options?.initialEntries ?? ['/']}>
          {children}
        </MemoryRouter>
      </GlobalProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    queryClient: testQueryClient,
  };
}