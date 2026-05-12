import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test Error');
  }
  return <div>Safe Content</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('renders fallback UI when a child component crashes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    expect(screen.queryByText('Safe Content')).not.toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
