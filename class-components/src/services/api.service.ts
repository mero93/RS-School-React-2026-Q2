import type { ApiResponse } from '../types/api-response';

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
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
