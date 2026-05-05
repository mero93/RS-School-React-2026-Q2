import type { ComicStrip } from './comic-strip';

export interface ApiResponse {
  comicStrips: ComicStrip[];
  page: {
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
  };
}