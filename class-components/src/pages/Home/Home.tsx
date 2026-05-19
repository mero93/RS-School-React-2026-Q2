import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useSearchLocalStorage } from '../../hooks/use-local-storage';
import Search from '../../components/Search/Search';
import type { ComicStrip } from '../../types/comic-strip';
import type { ApiResponse, PageData } from '../../types/api-response';
import './Home.css';
import Pagination from '../../components/Pagination/Pagination';
import Results from '../../components/Result/Results';
import Loader from '../../components/Loader/Loader';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedTerm, setStoredTerm] = useSearchLocalStorage();

  const [items, setItems] = useState<ComicStrip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [pageMetadata, setPageMetadata] = useState<PageData>({
    pageNumber: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const currentSearch = searchParams.get('search') ?? storedTerm;
  const currentPage = Number(searchParams.get('page') ?? '1');
  const detailId = searchParams.get('details');

  useEffect(() => {
    if (!searchParams.has('page')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('page', '1');
      setSearchParams(nextParams, { replace: true });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetPage = currentPage - 1;
        const queryUrl = `https://stapi.co/api/v1/rest/comicStrip/search?pageNumber=${targetPage}&pageSize=10`;

        const response = await fetch(queryUrl, {
          method: currentSearch ? 'POST' : 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: currentSearch
            ? new URLSearchParams({ title: currentSearch }).toString()
            : undefined,
        });

        if (!response.ok) {
          throw new Error(`Data fetch failed with status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        setItems(data.comicStrips || []);
        if (data.page) {
          setPageMetadata(data.page);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentSearch, currentPage, searchParams, setSearchParams]);

  const handleSearchSubmit = (newTerm: string) => {
    setStoredTerm(newTerm);
    const nextParams = new URLSearchParams(searchParams);
    if (newTerm) {
      nextParams.set('search', newTerm);
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (zeroIndexedPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(zeroIndexedPage + 1));
    setSearchParams(nextParams);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Search
          onSearch={handleSearchSubmit}
          initialValue={currentSearch}
          isLoading={loading}
          hasError={!!error}
        />
      </header>

      <main className={`main-layout ${detailId ? 'has-details' : ''}`}>
        <section className="master-panel">
          {error && <p className="status-msg error">{error}</p>}
          {loading && <p className="status-msg">Loading records...</p>}
          <Loader isLoading={loading} />

          {!loading && !error && (
            <>
              <Results hasError={false} items={items} />
              <Pagination page={pageMetadata} onPageChange={handlePageChange} />
            </>
          )}
        </section>

        <section className="outlet-panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
