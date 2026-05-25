import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from './use-theme';
import type { ReactNode } from 'react';
import ThemeProvider from '../providers/ThemeProvider';

describe('useTheme Hook', () => {
  it('returns context fallback configuration when executed outside of an explicit Provider wrapper', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('reads and interacts cleanly with provider state mutations when inside context trees', () => {
    const wrapper = ({ children }: { children: ReactNode }) => {
      return <ThemeProvider>{children}</ThemeProvider>
    }

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});