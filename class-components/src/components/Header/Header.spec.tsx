import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  it('renders Home as active/disabled and About as a normal link when on the home page (page 1)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('active');
    expect(homeLink).toHaveClass('no-click');
    expect(homeLink).toHaveAttribute('aria-disabled', 'true');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).not.toHaveClass('active');
    expect(aboutLink).not.toHaveClass('no-click');
    expect(aboutLink).toHaveAttribute('aria-disabled', 'false');
  });

  it('renders About as active/disabled and Home as a normal link when on the /about page', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).not.toHaveClass('active');
    expect(homeLink).not.toHaveClass('no-click');
    expect(homeLink).toHaveAttribute('aria-disabled', 'false');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('active');
    expect(aboutLink).toHaveClass('no-click');
    expect(aboutLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('removes no-click/disabled from Home if there are search params other than page=1 on the home root path', () => {
    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Header />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass('active');
    
    expect(homeLink).not.toHaveClass('no-click');
    expect(homeLink).toHaveAttribute('aria-disabled', 'false');
  });
});