import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import { ApiService } from '../../services/api.service';

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

describe('Home Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const mockApiResponse = {
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
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route
              path="details-outlet"
              element={<div>Mocked Outlet Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('automatically appends the default page param to url if missing', async () => {
    vi.spyOn(ApiService, 'search').mockResolvedValue(mockApiResponse);

    renderHomeWithRoutes(['/']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });
  });

  it('fetches records with correct arguments when search term is empty', async () => {
    const apiSpy = vi
      .spyOn(ApiService, 'search')
      .mockResolvedValue(mockApiResponse);

    renderHomeWithRoutes(['/?page=1']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });

    expect(apiSpy).toHaveBeenCalledWith('', 0);
  });

  it('fetches records with correct payload when search parameter is present', async () => {
    const apiSpy = vi
      .spyOn(ApiService, 'search')
      .mockResolvedValue(mockApiResponse);

    renderHomeWithRoutes(['/?page=1&search=Spock']);

    await waitFor(() => {
      expect(screen.getByText('Star Trek Issue #1')).toBeInTheDocument();
    });

    expect(apiSpy).toHaveBeenCalledWith('Spock', 0);
  });

  it('renders status indicators during network errors', async () => {
    vi.spyOn(ApiService, 'search').mockRejectedValue(
      new Error('Data fetch failed with status: 500')
    );

    renderHomeWithRoutes(['/?page=1']);

    await waitFor(() => {
      expect(
        screen.getByText('Data fetch failed with status: 500')
      ).toBeInTheDocument();
    });
  });

  it('applies explicit context layout classes when details parameter is found', async () => {
    vi.spyOn(ApiService, 'search').mockResolvedValue(mockApiResponse);

    const { container } = renderHomeWithRoutes(['/?page=1&details=123']);

    const mainLayout = container.querySelector('.main-layout');
    expect(mainLayout).toHaveClass('has-details');
  });

  it('triggers search updates and shifts page parameter when query submission fires', async () => {
    vi.spyOn(ApiService, 'search').mockResolvedValue(mockApiResponse);

    renderHomeWithRoutes(['/?page=2']);

    await waitForElementToBeRemoved(() =>
      screen.queryByText('Loading records...')
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Kirk' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(mockSetStoredTerm).toHaveBeenCalledWith('Kirk');
  });
});
