import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ItemDetails from './ItemDetails';

describe('ItemDetails Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockComicData = {
    comicStrip: {
      uid: 'COMIC999',
      title: 'The Next Generation: The Space Between',
      publishedYearFrom: 2006,
      publishedMonthFrom: 10,
      publishedDayFrom: 25,
      publishedYearTo: 2007,
      publishedMonthTo: 2,
      publishedDayTo: 14,
      numberOfPages: 120,
    },
  };

  it('renders nothing when "details" search param is missing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('fetches and displays comic details successfully when "details" param is present', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockComicData,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=COMIC999']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /comic details/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText('The Next Generation: The Space Between')
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Published Range:/i)).toBeInTheDocument();
    expect(screen.getByText('25/10/2006 - 14/2/2007')).toBeInTheDocument();
    expect(screen.getByText('120 Pages')).toBeInTheDocument();
    expect(screen.getByText('Catalog ID: COMIC999')).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://stapi.co/api/v1/rest/comicStrip?uid=COMIC999'
    );
  });

  it('displays an error message when the API fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    const { container } = render(
      <MemoryRouter initialEntries={['/?details=BROKEN_ID']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch comic details')
      ).toBeInTheDocument();
    });

    expect(container.querySelector('.comic-info')).not.toBeInTheDocument();
  });

  it('displays a fallback error message on network/catch block crash', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter initialEntries={['/?details=CRASH_ID']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });

  it('removes the "details" param from URL when close button is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockComicData,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=COMIC999']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('The Next Generation: The Space Between')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', {
      name: /close details panel/i,
    });
    fireEvent.click(closeButton);

    expect(
      screen.queryByText('The Next Generation: The Space Between')
    ).not.toBeInTheDocument();
  });

  it('formats dates correctly when day or month fields are omitted', async () => {
    const incompleteDatesComic = {
      comicStrip: {
        uid: 'COMIC111',
        title: 'Partial Dates Comic',
        publishedYearFrom: 1995,
        publishedYearTo: 2000,
        publishedMonthTo: 5,
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => incompleteDatesComic,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=COMIC111']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1995 - 5/2000')).toBeInTheDocument();
    });
  });

  it('falls back to default labels when entire year arrays are missing from response objects', async () => {
    const missingYearsComic = {
      comicStrip: {
        uid: 'COMIC222',
        title: 'No Years Comic',
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => missingYearsComic,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=COMIC222']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('N/A - N/A')).toBeInTheDocument();
    });
  });

  it('displays a fallback generic message when catch block intercepts a non-Error throw', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw 'Raw string syntax error crash';
    });

    render(
      <MemoryRouter initialEntries={['/?details=STRING_CRASH']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
