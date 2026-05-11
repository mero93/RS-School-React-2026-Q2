import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ApiService } from './api.service';

describe('ApiService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should call fetch with correct URL and parameters', async () => {
    const fetchMock = fetch as Mock;

    const mockResponse = { comicStrips: [], page: {} };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await ApiService.search('Star Trek', 1, 5);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comicStrip/search?pageNumber=1&pageSize=5'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );

    const lastCallBody = fetchMock.mock.calls[0][1].body;
    expect(lastCallBody).toContain('title=Star+Trek');

    expect(result).toEqual(mockResponse);
  });

  it('should handle empty title correctly', async () => {
    const fetchMock = fetch as Mock;

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await ApiService.search('', 0, 10);

    const lastCallBody = fetchMock.mock.calls[0][1].body;
    expect(lastCallBody).toBe('');
  });

  it('should throw an error when the response is not ok', async () => {
    const fetchMock = fetch as Mock;

    fetchMock.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(ApiService.search('test')).rejects.toThrow(
      'API Error: Not Found'
    );
  });

  it('should throw an error if the network request fails', async () => {
    const fetchMock = fetch as Mock;

    fetchMock.mockRejectedValue(new Error('Network string'));

    await expect(ApiService.search('test')).rejects.toThrow('Network string');
  });
});
