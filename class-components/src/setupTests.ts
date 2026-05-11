import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('./services/ApiService', () => {
  return {
    ApiService: {
      search: vi.fn().mockResolvedValue({
        items: [
          {
            uid: '1',
            title: 'Mock Comic 1',
            publishedYearFrom: 2020,
            publishedYearTo: 2021,
            numberOfPages: 32,
          },
        ],
        page: {
          pageNumber: 0,
          pageSize: 10,
          numberOfElements: 1,
          totalElements: 1,
          totalPages: 1,
        },
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

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
