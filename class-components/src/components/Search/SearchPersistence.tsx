'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const SEARCH_STORAGE_KEY = 'search_term';

export default function SearchPersistence() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasSearchParam = searchParams.has('search');
    const savedSearch = localStorage.getItem(SEARCH_STORAGE_KEY);

    if (!hasSearchParam && savedSearch) {
      router.replace(`?search=${encodeURIComponent(savedSearch)}&page=1`);
    }
  }, [router, searchParams]);

  return null;
}
