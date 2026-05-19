import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    RouterProvider: () => <div data-testid="mock-router">Router Active</div>,
  };
});

describe('App Component', () => {
  it('renders the application router provider within the shell without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('mock-router')).toBeInTheDocument();
  });
});
