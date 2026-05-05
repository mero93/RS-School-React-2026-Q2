import type { ComicStrip } from './comic-strip';

export interface ApiResponse {
  comicStrips: ComicStrip[];
  page: PageData;
}

export interface PageData {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}
