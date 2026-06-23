import type { ApiResponse } from '../types/api-response';
import type { ComicStrip } from '../types/comic-strip';

const BASE_URL = 'https://stapi.co/api/v1/rest';

export const ApiService = {
  async search(
    title: string = '',
    pageNumber: number = 0,
    pageSize: number = 10
  ): Promise<ApiResponse> {
    const body = new URLSearchParams();
    if (title) body.append('title', title);

    const response = await fetch(
      `${BASE_URL}/comicStrip/search?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        cache: 'no-store',
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },

  async getOne(uid: string): Promise<ComicStrip> {
    const response = await fetch(`${BASE_URL}/comicStrip?uid=${uid}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok)
      throw new Error(`API Single Fetch Error: ${response.statusText}`);
    const data = (await response.json()) as { comicStrip: ComicStrip };
    return data.comicStrip;
  },
};
