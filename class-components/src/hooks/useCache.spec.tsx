import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useComicSearch,
  useComicDetail,
  useInvalidateComicCache,
} from './useCache';
import { ApiService } from '../services/api.service';
import type { ApiResponse } from '../types/api-response';
import type { ComicStrip } from '../types/comic-strip';

interface WrapperProps {
  children: React.ReactNode;
}

describe('useCache Integration Hooks', () => {
  let queryClient: QueryClient;

  const mockComicList: ApiResponse = {
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

  const mockSingleComic: ComicStrip = {
    uid: 'COMIC999',
    title: 'The Space Between',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 300000,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => {
    const TestWrapper = ({ children }: WrapperProps) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    TestWrapper.displayName = 'TestWrapper';
    return TestWrapper;
  };

  it('resolves successful query evaluations for lists', async () => {
    const searchSpy = vi
      .spyOn(ApiService, 'search')
      .mockResolvedValue(mockComicList);
    const { result } = renderHook(() => useComicSearch('Star Trek', 0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockComicList);
    expect(searchSpy).toHaveBeenCalledWith('Star Trek', 0);
  });

  it('resolves successful query evaluations for standalone item details', async () => {
    const detailSpy = vi
      .spyOn(ApiService, 'getOne')
      .mockResolvedValue(mockSingleComic);
    const { result } = renderHook(() => useComicDetail('COMIC999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSingleComic);
    expect(detailSpy).toHaveBeenCalledWith('COMIC999');
  });

  it('bypasses api execution when detail uid argument is omitted or null', async () => {
    const detailSpy = vi.spyOn(ApiService, 'getOne');
    const { result } = renderHook(() => useComicDetail(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEnabled).toBe(false);
    expect(detailSpy).not.toHaveBeenCalled();
  });

  it('reuses active cache balances to prevent additional network roundtrips', async () => {
    const searchSpy = vi
      .spyOn(ApiService, 'search')
      .mockResolvedValue(mockComicList);
    const wrapper = createWrapper();

    const { result: firstRun } = renderHook(
      () => useComicSearch('Star Trek', 0),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(firstRun.current.isSuccess).toBe(true);
    });

    const { result: secondRun } = renderHook(
      () => useComicSearch('Star Trek', 0),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(secondRun.current.isSuccess).toBe(true);
    });

    expect(secondRun.current.data).toEqual(mockComicList);
    expect(searchSpy).toHaveBeenCalledTimes(1);
  });

  it('registers structural validation responses when handling api errors', async () => {
    vi.spyOn(ApiService, 'search').mockRejectedValue(
      new Error('Network drop detected')
    );

    const { result } = renderHook(() => useComicSearch('Star Trek', 0), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('wipes cached records on demand when invalidation triggers are executed', async () => {
    const searchSpy = vi
      .spyOn(ApiService, 'search')
      .mockResolvedValue(mockComicList);
    const wrapper = createWrapper();

    const { result: queryHook } = renderHook(
      () => useComicSearch('Star Trek', 0),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(queryHook.current.isSuccess).toBe(true);
    });

    const { result: managerHook } = renderHook(
      () => useInvalidateComicCache(),
      {
        wrapper,
      }
    );

    await managerHook.current.invalidateAll();

    renderHook(() => useComicSearch('Star Trek', 0), {
      wrapper,
    });

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledTimes(2);
    });
  });
});
