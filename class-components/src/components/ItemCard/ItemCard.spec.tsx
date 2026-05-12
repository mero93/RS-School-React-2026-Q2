import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ItemCard from './ItemCard';
import type { ComicStrip } from '../../types/comic-strip';

describe('ItemCard', () => {
  const mockItem: ComicStrip = {
    uid: '123',
    title: 'Star Trek: Mirror Universe',
    publishedYearFrom: 1967,
    publishedYearTo: 1968,
    numberOfPages: 32,
  };

  it('renders the title correctly', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
  });

  it('renders full date range and page count when all data is provided', () => {
    render(<ItemCard item={mockItem} />);
    expect(
      screen.getByText(/Published: 1967 - 1968 | Pages: 32/i)
    ).toBeInTheDocument();
  });

  it('displays "N/A" if publishedYearFrom is missing', () => {
    const incompleteItem = { ...mockItem, publishedYearFrom: undefined };
    render(<ItemCard item={incompleteItem as unknown as ComicStrip} />);

    expect(screen.getByText(/Published: N\/A - 1968/i)).toBeInTheDocument();
  });

  it('displays "Present" if publishedYearTo is missing', () => {
    const currentItem = { ...mockItem, publishedYearTo: undefined };
    render(<ItemCard item={currentItem as unknown as ComicStrip} />);

    expect(screen.getByText(/Published: 1967 - Present/i)).toBeInTheDocument();
  });

  it('does not display page count section if numberOfPages is missing', () => {
    const noPagesItem = { ...mockItem, numberOfPages: undefined };
    render(<ItemCard item={noPagesItem as unknown as ComicStrip} />);

    const description = screen.getByText(/Published: 1967 - 1968/i);
    expect(description.textContent).not.toContain('| Pages:');
  });

  it('renders with only necessary data', () => {
    const minimalItem = { uid: '0', title: 'Empty Comic' };
    render(<ItemCard item={minimalItem} />);

    expect(screen.getByText('Empty Comic')).toBeInTheDocument();
    expect(screen.getByText(/Published: N\/A - Present/i)).toBeInTheDocument();
  });
});
