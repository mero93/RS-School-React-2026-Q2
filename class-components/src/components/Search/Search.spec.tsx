import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from './Search';

describe('Search Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the initial value from props', () => {
    render(
      <Search
        initialValue="Spock"
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Spock');
  });

  it('updates input value on change', () => {
    render(
      <Search
        initialValue=""
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    const input = screen.getByPlaceholderText(
      /Search Star Trek Comics/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Enterprise' } });
    expect(input.value).toBe('Enterprise');
  });

  it('calls onSearch with trimmed term on button click', () => {
    render(
      <Search
        initialValue=""
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Voyager  ' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Voyager');
  });

  it('does not trigger search if the term is the same as initialValue and no error exists', () => {
    render(
      <Search
        initialValue="Picard"
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('disables input and button when isLoading is true', () => {
    render(
      <Search
        initialValue=""
        onSearch={mockOnSearch}
        isLoading={true}
        hasError={false}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('...');
  });

  it('updates local state when initialValue prop changes (componentDidUpdate)', () => {
    const { rerender } = render(
      <Search
        key="initial-key"
        initialValue="Initial"
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    rerender(
      <Search
        key="updated-key"
        initialValue="Updated"
        onSearch={mockOnSearch}
        isLoading={false}
        hasError={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Updated');
  });
});
