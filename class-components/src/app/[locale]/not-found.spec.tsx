import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './not-found';

describe('NotFound Component', () => {
  it('renders the 404 error code and text content correctly', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /page not found/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /page not found\. return to home page and continue browsing comics/i
      )
    ).toBeInTheDocument();
  });

  it('renders a working navigation link pointing to the homepage', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const redirectLink = screen.getByRole('link', {
      name: /return to comics/i,
    });

    expect(redirectLink).toBeInTheDocument();
    expect(redirectLink).toHaveAttribute('href', '/');
  });
});
