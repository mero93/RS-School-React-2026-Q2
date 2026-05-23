import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  it('renders Home as plain text (active) and About as a link when on the home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink.tagName).toBe('SPAN');
    expect(homeLink).toHaveClass('active');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).not.toHaveClass('active');
  });

  it('renders About as plain text (active) and Home as a link when on the /about page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).not.toHaveClass('active');

    const aboutLink = screen.getByText('About');
    expect(aboutLink.tagName).toBe('SPAN');
    expect(aboutLink).toHaveClass('active');
  });

  it('renders Home as a link if there are search params on the home root path', () => {
    render(
      <MemoryRouter initialEntries={['/?search=test']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).not.toHaveClass('active');
  });
});
