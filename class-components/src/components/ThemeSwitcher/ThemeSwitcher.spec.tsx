import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../../hooks/use-theme';

vi.mock('../../hooks/use-theme', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSwitcher Component', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders LucideSun icon when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    const { container } = render(<ThemeSwitcher />);

    expect(container.querySelector('.lucide-sun')).toBeInTheDocument();
    expect(
      container.querySelector('.lucide-moon-star')
    ).not.toBeInTheDocument();
  });

  it('renders LucideMoonStar icon when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    const { container } = render(<ThemeSwitcher />);

    expect(container.querySelector('.lucide-moon-star')).toBeInTheDocument();
    expect(container.querySelector('.lucide-sun')).not.toBeInTheDocument();
  });

  it('calls toggleTheme on click and enforces a 200ms cooldown rate limit', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeSwitcher />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
  });
});
