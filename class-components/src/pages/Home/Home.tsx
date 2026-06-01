import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useSearchLocalStorage } from '../../hooks/use-local-storage';
import Search from '../../components/Search/Search';
import './Home.css';
import Pagination from '../../components/Pagination/Pagination';
import Results from '../../components/Result/Results';
import Loader from '../../components/Loader/Loader';
import CheckItemsFlyout from '../../components/CheckItemsFlyout/CheckItemsFlyout';
import { useComicSearch, useInvalidateComicCache } from '../../hooks/useCache';
import { LucideRefreshCcwDot } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedTerm, setStoredTerm] = useSearchLocalStorage();
  const { invalidateAll } = useInvalidateComicCache();

  const currentSearch = searchParams.get('search') ?? storedTerm;
  const currentPage = Number(searchParams.get('page') ?? '1');
  const detailId = searchParams.get('details');

  const targetPage = currentPage - 1;

  const { data, isLoading, isError, error, isFetching } = useComicSearch(
    currentSearch,
    targetPage
  );

  useEffect(() => {
    if (!searchParams.has('search') && currentSearch) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('search', currentSearch);
      setSearchParams(nextParams, { replace: true });
    }

    if (!searchParams.has('page')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('page', '1');
      setSearchParams(nextParams, { replace: true });
    }
  }, [currentSearch, searchParams, setSearchParams]);

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

  const items = data?.comicStrips ?? [];
  const pageMetadata = data?.page ?? {
    pageNumber: targetPage,
    pageSize: 10,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 1,
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <button
          className="refresh-btn"
          onClick={invalidateAll}
          disabled={isFetching}
          type="button"
        >
          <LucideRefreshCcwDot
            className={isFetching ? 'refresh-animate' : ''}
          />
          <span>Refresh</span>
        </button>
        <Search
          key={currentSearch}
          onSearch={handleSearchSubmit}
          initialValue={currentSearch}
          isLoading={isLoading}
          hasError={isError}
        />
      </header>

      <CheckItemsFlyout />

      <div className={`main-layout ${detailId ? 'has-details' : ''}`}>
        <section className="master-panel">
          {isError && (
            <p className="status-msg error">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          )}

          {isLoading && <p className="status-msg">Loading records...</p>}
          <Loader isLoading={isLoading} />

          {!isLoading && !isError && (
            <>
              <Results hasError={false} items={items} />
              <Pagination page={pageMetadata} onPageChange={handlePageChange} />
            </>
          )}
        </section>

        <section className="outlet-panel">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
