import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Results from './Results';
import type { ComicStrip } from '../../types/comic-strip';

describe('Results Component', () => {
  const mockItems: ComicStrip[] = [
    { uid: '1', title: 'Comic One', publishedYearFrom: 2020 },
    { uid: '2', title: 'Comic Two', publishedYearFrom: 2021 },
  ];

  it('renders the correct number of ItemCard components', () => {
    render(<Results items={mockItems} hasError={false} />);

    expect(screen.getByText('Comic One')).toBeInTheDocument();
    expect(screen.getByText('Comic Two')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /results area/i })
    ).toBeInTheDocument();
  });

  it('renders the empty state message when items array is empty', () => {
    render(<Results items={[]} hasError={false} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByText('Comic One')).not.toBeInTheDocument();
  });

  it('renders the empty state message when items is undefined', () => {
    render(<Results items={undefined} hasError={false} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('throws an error when hasError is true', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<Results items={mockItems} hasError={true} />);
    }).toThrow('Simulation: Results component crashed!');

    spy.mockRestore();
  });
});
