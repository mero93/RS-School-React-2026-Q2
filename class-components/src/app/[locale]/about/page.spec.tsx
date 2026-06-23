import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './page';

describe('About Component', () => {
  it('renders the heading and description texts correctly', () => {
    render(<About />);

    expect(
      screen.getByRole('heading', { name: /about this project/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/star trek comic strip archive explorer/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/rs school react course/i)).toBeInTheDocument();
  });

  it('renders the external course link with secure attributes', () => {
    render(<About />);

    const link = screen.getByRole('link', { name: /view course details/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
