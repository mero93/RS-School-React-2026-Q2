import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from './services/api.service';
import { searchStorageKey } from './components/Search/Search';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('performs initial search on mount using term from localStorage', async () => {
    localStorage.setItem(searchStorageKey, 'Kirk');

    render(<App />);

    await waitFor(() => {
      expect(ApiService.search).toHaveBeenCalledWith('Kirk', 0);
    });
  });

  it('updates results when a search is performed', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Search Star Trek Comics/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Picard' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(ApiService.search).toHaveBeenCalledWith('Picard', 0);
    });
  });

  it('shows loader while fetching data', async () => {
    vi.mocked(ApiService.search).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                comicStrips: [],
                page: {
                  pageNumber: 0,
                  totalPages: 1,
                  totalElements: 0,
                  pageSize: 10,
                  numberOfElements: 0,
                },
              }),
            100
          )
        )
    );

    render(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('changes page when pagination is clicked', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());

    const pageTwoButton = screen.getByText('2');
    fireEvent.click(pageTwoButton);

    await waitFor(() => {
      expect(ApiService.search).toHaveBeenCalledWith(expect.any(String), 1);
    });
  });

  it('triggers error boundary when "Trigger Error" button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    const errorBtn = screen.getByRole('button', { name: /trigger error/i });
    fireEvent.click(errorBtn);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles API failure gracefully', async () => {
    vi.mocked(ApiService.search).mockRejectedValueOnce(new Error('API Down'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
