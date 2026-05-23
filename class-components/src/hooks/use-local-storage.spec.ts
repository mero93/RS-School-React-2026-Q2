import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSearchLocalStorage, SEARCH_STORAGE_KEY } from './use-local-storage';

describe('useSearchLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return an empty string if initial localStorage value is empty', () => {
    const { result } = renderHook(() => useSearchLocalStorage());

    expect(result.current[0]).toBe('');
  });

  it('should initialize with the value found in localStorage', () => {
    localStorage.setItem(SEARCH_STORAGE_KEY, 'Deep Space Nine');

    const { result } = renderHook(() => useSearchLocalStorage());

    expect(result.current[0]).toBe('Deep Space Nine');
  });

  it('should set and trim values in both state and localStorage', () => {
    const { result } = renderHook(() => useSearchLocalStorage());
    const [, setValue] = result.current;

    act(() => {
      setValue('   Discovery   ');
    });

    expect(result.current[0]).toBe('Discovery');
    expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('Discovery');
  });

  it('should handle localStorage read crashes gracefully and fall back to empty string', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Storage locked');
    });

    const { result } = renderHook(() => useSearchLocalStorage());

    expect(result.current[0]).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading search_term from localStorage:',
      expect.any(Error)
    );
  });

  it('should catch write exceptions when setting data fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useSearchLocalStorage());
    const [, setValue] = result.current;

    act(() => {
      setValue('Lower Decks');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting search_term in localStorage:',
      expect.any(Error)
    );
  });
});
