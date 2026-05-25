import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import Results from './Results';
import type { ComicStrip } from '../../types/comic-strip';

let mockSelectedItems: ComicStrip[] = [];
const mockToggleItem = vi.fn();

vi.mock('../../store/check-item.store', () => ({
  useCheckItemStore: () => ({
    selectedItems: mockSelectedItems,
    toggleItem: mockToggleItem,
  }),
}));

describe('Results Component', () => {
  const mockItems: ComicStrip[] = [
    { uid: '1', title: 'Comic One', publishedYearFrom: 2020 },
    { uid: '2', title: 'Comic Two', publishedYearFrom: 2021 },
  ];

  let capturedParams: URLSearchParams;
  const ParamTracker = () => {
    const [searchParams] = useSearchParams();
    capturedParams = searchParams;
    return null;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedItems = [];
  });

  const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
        <ParamTracker />
      </MemoryRouter>
    );
  };

  it('renders the correct number of ItemCard components', () => {
    renderWithRouter(<Results items={mockItems} hasError={false} />);

    expect(screen.getByText('Comic One')).toBeInTheDocument();
    expect(screen.getByText('Comic Two')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /results area/i })
    ).toBeInTheDocument();
  });

  it('updates URL search parameters with the correct uid when an item card is clicked', () => {
    const { container } = renderWithRouter(
      <Results items={mockItems} hasError={false} />,
      ['/?page=2']
    );

    const cards = container.querySelectorAll('.item-card');
    if (!cards.length) throw new Error('No item cards found');

    fireEvent.click(cards[0]);

    expect(capturedParams.get('page')).toBe('2');
    expect(capturedParams.get('details')).toBe('1');
  });

  it('renders the empty state message when items array is empty', () => {
    renderWithRouter(<Results items={[]} hasError={false} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryByText('Comic One')).not.toBeInTheDocument();
  });

  it('renders the empty state message when items is undefined', () => {
    renderWithRouter(<Results items={undefined} hasError={false} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('throws an error when hasError is true', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderWithRouter(<Results items={mockItems} hasError={true} />);
    }).toThrow('Simulation: Results component crashed!');

    spy.mockRestore();
  });
});
