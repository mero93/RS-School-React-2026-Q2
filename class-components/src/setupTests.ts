import '@testing-library/jest-dom';
import { vi } from 'vitest';
import mockComics from './__tests__/comics.json';

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
