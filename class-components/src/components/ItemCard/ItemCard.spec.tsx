import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import ItemCard from './ItemCard';
import type { ComicStrip } from '../../types/comic-strip';

describe('ItemCard - Additional Interactivity Tests', () => {
  const mockItem: ComicStrip = {
    uid: '123',
    title: 'Star Trek: Mirror Universe',
    publishedYearFrom: 1967,
    publishedYearTo: 1968,
    numberOfPages: 32,
  };

  let capturedParams: URLSearchParams;

  const ParamTracker = () => {
    const [searchParams] = useSearchParams();
    capturedParams = searchParams;
    return null;
  };

  const renderWithTracker = (
    ui: React.ReactElement,
    initialEntries = ['/']
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
        <ParamTracker />
      </MemoryRouter>
    );
  };

  it('updates search parameters with the comic uid when clicked', () => {
    renderWithTracker(<ItemCard item={mockItem} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(capturedParams.get('details')).toBe('123');
  });

  it('updates search parameters when the Enter key is pressed', () => {
    renderWithTracker(<ItemCard item={mockItem} />);

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    expect(capturedParams.get('details')).toBe('123');
  });

  it('does not update search parameters when other keys are pressed', () => {
    renderWithTracker(<ItemCard item={mockItem} />);

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Space', code: 'Space' });

    expect(capturedParams.get('details')).toBeNull();
  });

  it('preserves existing search parameters when updating the details ID', () => {
    renderWithTracker(<ItemCard item={mockItem} />, ['/?search=Spock&page=2']);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(capturedParams.get('search')).toBe('Spock');
    expect(capturedParams.get('page')).toBe('2');
    expect(capturedParams.get('details')).toBe('123');
  });
});
