import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { ApiResponse } from '../types/api-response';
import type { ComicStrip } from '../types/comic-strip';

export const comicKeys = {
  all: ['comics'] as const,
  lists: () => [...comicKeys.all, 'list'] as const,
  list: (title: string, pageNumber: number) => [...comicKeys.lists(), title, pageNumber] as const,
  details: () => [...comicKeys.all, 'detail'] as const,
  detail: (uid: string | null) => [...comicKeys.details(), uid ?? ''] as const,
};

export function useComicSearch(title: string, pageNumber: number) {
  return useQuery<ApiResponse, Error>({
    queryKey: comicKeys.list(title, pageNumber),
    queryFn: () => ApiService.search(title, pageNumber),
  });
}

export function useComicDetail(uid: string | null) {
  return useQuery<ComicStrip, Error>({
    queryKey: comicKeys.detail(uid),
    queryFn: () => {
      if (!uid) {
        return Promise.reject(new Error('No UID provided'));
      }
      return ApiService.getOne(uid);
    },
    enabled: !!uid,
  });
}

export function useInvalidateComicCache() {
  const queryClient = useQueryClient();

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ 
      queryKey: comicKeys.all 
    });
  };

  return { invalidateAll };
}