import { useState } from 'react';

export const SEARCH_STORAGE_KEY = 'search_term';

export function useSearchLocalStorage(): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    if (typeof globalThis === 'undefined') {
      return '';
    }

    try {
      const item = globalThis.localStorage.getItem(SEARCH_STORAGE_KEY);
      return item ?? '';
    } catch (error) {
      console.error('Error reading search_term from localStorage:', error);
      return '';
    }
  });

  const setValue = (value: string) => {
    try {
      const trimmedValue = value.trim();
      setStoredValue(trimmedValue);
      globalThis.localStorage.setItem(SEARCH_STORAGE_KEY, trimmedValue);
    } catch (error) {
      console.error('Error setting search_term in localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
