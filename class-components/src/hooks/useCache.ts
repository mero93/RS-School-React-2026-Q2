import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api.service';
import type { ApiResponse } from '../types/api-response';
import type { ComicStrip } from '../types/comic-strip';

export function useComicSearch(title: string, pageNumber: number) {
  return useQuery<ApiResponse, Error>({
    queryKey: ['comic-list', title, pageNumber],
    queryFn: () => ApiService.search(title, pageNumber),
  });
}

export function useComicDetail(uid: string | null) {
  return useQuery<ComicStrip, Error>({
    queryKey: ['comic-detail', uid ?? ''],
    queryFn: () => {
      if (!uid) throw new Error('No UID provided');
      return ApiService.getOne(uid);
    },
    enabled: !!uid,
  });
}

export function useInvalidateComicCache() {
  const queryClient = useQueryClient();

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['comic-list'] });
    await queryClient.invalidateQueries({ queryKey: ['comic-detail'] });
  };

  return { invalidateAll };
}