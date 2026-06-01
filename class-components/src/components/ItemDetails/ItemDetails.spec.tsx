import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UseQueryResult } from '@tanstack/react-query';
import ItemDetails from './ItemDetails';
import { renderWithProviders } from '../../setupTests';
import * as cacheModule from '../../hooks/useCache';
import type { ComicStrip } from '../../types/comic-strip';

describe('ItemDetails Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const mockComicData: ComicStrip = {
    uid: 'COMIC999',
    title: 'The Next Generation: The Space Between',
    publishedYearFrom: 2006,
    publishedMonthFrom: 10,
    publishedDayFrom: 25,
    publishedYearTo: 2007,
    publishedMonthTo: 2,
    publishedDayTo: 14,
    numberOfPages: 120,
  };

  it('renders nothing when "details" search param is missing', () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      data: mockComicData,
    } as UseQueryResult<ComicStrip, Error>);

    const { container } = renderWithProviders(<ItemDetails />, {
      initialEntries: ['/'],
    });

    expect(container.firstChild).toBeNull();
  });

  it('fetches and displays comic details successfully when "details" param is present', async () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      data: mockComicData,
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=COMIC999'],
    });

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
  });

  it('displays an error message when the API fetch fails', async () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      isError: true,
      error: new Error('Failed to fetch comic details'),
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=BROKEN_ID'],
    });

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch comic details')
      ).toBeInTheDocument();
    });
  });

  it('displays a fallback error message on network/catch block crash', async () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      isError: true,
      error: new Error('Network Error'),
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=CRASH_ID'],
    });

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });

  it('removes the "details" param from URL when close button is clicked', async () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      data: mockComicData,
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=COMIC999'],
    });

    await waitFor(() => {
      expect(
        screen.getByText('The Next Generation: The Space Between')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', {
      name: /close details panel/i,
    });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText('The Next Generation: The Space Between')
      ).not.toBeInTheDocument();
    });
  });

  it('formats dates correctly when day or month fields are omitted', async () => {
    const incompleteDatesComic: ComicStrip = {
      uid: 'COMIC111',
      title: 'Partial Dates Comic',
      publishedYearFrom: 1995,
      publishedYearTo: 2000,
      publishedMonthTo: 5,
    };

    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      data: incompleteDatesComic,
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=COMIC111'],
    });

    await waitFor(() => {
      expect(screen.getByText('1995 - 5/2000')).toBeInTheDocument();
    });
  });

  it('falls back to default labels when entire year arrays are missing from response objects', async () => {
    const missingYearsComic: ComicStrip = {
      uid: 'COMIC222',
      title: 'No Years Comic',
    };

    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      data: missingYearsComic,
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=COMIC222'],
    });

    await waitFor(() => {
      expect(screen.getByText(/N\/A\s*-\s*N\/A/)).toBeInTheDocument();
    });
  });

  it('displays a fallback generic message when catch block intercepts a non-Error throw', async () => {
    vi.spyOn(cacheModule, 'useComicDetail').mockReturnValue({
      isError: true,
      error: new Error('An error occurred'),
    } as UseQueryResult<ComicStrip, Error>);

    renderWithProviders(<ItemDetails />, {
      initialEntries: ['/?details=STRING_CRASH'],
    });

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
