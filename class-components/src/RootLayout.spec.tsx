import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './RootLayout';

describe('RootLayout Component', () => {
  it('renders the header and the active child route content through the outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route
              index
              element={<div data-testid="child-content">Active Route View</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Active Route View')).toBeInTheDocument();
  });
});
