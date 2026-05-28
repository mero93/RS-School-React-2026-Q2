import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTheme } from '../hooks/use-theme';
import ThemeProvider from './ThemeProvider';

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    delete document.documentElement.dataset.theme;
  });

  it('provides light theme as the initial default value and updates DOM elements', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('toggles context value and sets correct dark properties to document node elements', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle/i });

    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme-val').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset.theme).toBe('dark');

    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme-val').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
