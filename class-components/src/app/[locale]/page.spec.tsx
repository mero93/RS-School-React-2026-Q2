import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import type { UseQueryResult } from '@tanstack/react-query';
import Home from './page';
import * as cacheModule from '../../hooks/useCache';
import { renderWithProviders } from '../../setupTests';

interface ComicSearchPageMetadata {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

interface ComicSearchStripItem {
  uid: string;
  title: string;
}

interface ComicSearchResultData {
  comicStrips: ComicSearchStripItem[];
  page: ComicSearchPageMetadata;
}

const mockSetStoredTerm = vi.fn();
vi.mock('../../hooks/use-local-storage', () => ({
  useSearchLocalStorage: () => ['', mockSetStoredTerm],
}));

vi.mock('../../store/check-item.store', () => ({
  useCheckItemStore: () => ({
    selectedItems: [],
    toggleItem: vi.fn(),
  }),
}));

function createMockSuccessQuery(
  data: ComicSearchResultData
): UseQueryResult<ComicSearchResultData, Error> {
  return {
    data,
    isLoading: false,
    isPending: false,
    isError: false,
    error: null,
    isFetching: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: 'success',
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
  } as unknown as UseQueryResult<ComicSearchResultData, Error>;
}

function createMockErrorQuery(
  error: Error
): UseQueryResult<ComicSearchResultData, Error> {
  return {
    data: undefined,
    isLoading: false,
    isPending: false,
    isError: true,
    error,
    isFetching: false,
    isLoadingError: true,
    isRefetchError: false,
    isSuccess: false,
    status: 'error',
    dataUpdatedAt: 0,
    errorUpdatedAt: Date.now(),
    failureCount: 1,
    failureReason: error,
    errorUpdateCount: 1,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
  } as unknown as UseQueryResult<ComicSearchResultData, Error>;
}

describe('Home Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    vi.spyOn(cacheModule, 'useInvalidateComicCache').mockReturnValue({
      invalidateAll: vi.fn(),
    });
  });

  const mockApiResponse: ComicSearchResultData = {
    comicStrips: [
      { uid: '1', title: 'Star Trek Issue #1' },
      { uid: '2', title: 'Star Trek Issue #2' },
    ],
    page: {
      pageNumber: 0,
      pageSize: 10,
      numberOfElements: 2,
      totalElements: 2,
      totalPages: 1,
    },
  };

  const renderHomeWithRoutes = (initialEntries = ['/']) => {
    return renderWithProviders(
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="details-outlet"
            element={<div>Mocked Outlet Content</div>}
          />
        </Route>
      </Routes>,
      { initialEntries }
    );
  };

  it('automatically appends the default page param to url if missing', async () => {
    const mockSuccess = createMockSuccessQuery(mockApiResponse);
    vi.spyOn(cacheModule, 'useComicSearch').mockReturnValue(mockSuccess);

    renderHomeWithRoutes(['/']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });
  });

  it('fetches records with correct arguments when search term is empty', async () => {
    const mockSuccess = createMockSuccessQuery(mockApiResponse);
    const useComicSearchSpy = vi
      .spyOn(cacheModule, 'useComicSearch')
      .mockReturnValue(mockSuccess);

    renderHomeWithRoutes(['/?page=1']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });

    expect(useComicSearchSpy).toHaveBeenCalledWith('', 0);
  });

  it('fetches records with correct payload when search parameter is present', async () => {
    const mockSuccess = createMockSuccessQuery(mockApiResponse);
    const useComicSearchSpy = vi
      .spyOn(cacheModule, 'useComicSearch')
      .mockReturnValue(mockSuccess);

    renderHomeWithRoutes(['/?page=1&search=Spock']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });

    expect(useComicSearchSpy).toHaveBeenCalledWith('Spock', 0);
  });

  it('renders status indicators during network errors', async () => {
    const mockError = createMockErrorQuery(
      new Error('Data fetch failed with status: 500')
    );
    vi.spyOn(cacheModule, 'useComicSearch').mockReturnValue(mockError);

    renderHomeWithRoutes(['/?page=1']);

    await waitFor(() => {
      expect(
        screen.getByText('Data fetch failed with status: 500')
      ).toBeInTheDocument();
    });
  });

  it('applies explicit context layout classes when details parameter is found', async () => {
    const mockSuccess = createMockSuccessQuery(mockApiResponse);
    vi.spyOn(cacheModule, 'useComicSearch').mockReturnValue(mockSuccess);

    const { container } = renderHomeWithRoutes(['/?page=1&details=123']);

    const mainLayout = container.querySelector('.main-layout');
    expect(mainLayout).toHaveClass('has-details');
  });

  it('triggers search updates and shifts page parameter when query submission fires', async () => {
    const mockSuccess = createMockSuccessQuery(mockApiResponse);
    vi.spyOn(cacheModule, 'useComicSearch').mockReturnValue(mockSuccess);

    renderHomeWithRoutes(['/?page=2']);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Kirk' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockSetStoredTerm).toHaveBeenCalledWith('Kirk');
    });
  });
});
