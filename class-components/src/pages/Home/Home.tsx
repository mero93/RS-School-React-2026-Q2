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
import { LucideRefreshCcwDot, LucideExternalLink } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import { useModalStore } from '../../store/useModal.store';
import UncontrolledForm from '../../components/Forms/UncontrolledForm';
import HookForm from '../../components/Forms/HookForm';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storedTerm, setStoredTerm] = useSearchLocalStorage();
  const { invalidateAll } = useInvalidateComicCache();

  const { isOpen, view, openModal, closeModal } = useModalStore();

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
        <div className="btn-group">
          <button
            className="accent-btn"
            onClick={() => openModal('uncontrolled')}
            type="button"
          >
            <LucideExternalLink />
            <span>Uncontrolled Form</span>
          </button>
          <button
            className="accent-btn"
            onClick={() => openModal('hook-form')}
            type="button"
          >
            <LucideExternalLink />
            <span>React Hook Form</span>
          </button>
          <button
            className="accent-btn"
            onClick={invalidateAll}
            disabled={isFetching}
            type="button"
          >
            <LucideRefreshCcwDot
              className={isFetching ? 'accent-animate' : ''}
            />
            <span>Refresh</span>
          </button>
        </div>

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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={
          view === 'uncontrolled'
            ? 'Uncontrolled Form Profile'
            : 'React Hook Form Profile'
        }
      >
        {view === 'uncontrolled' && <UncontrolledForm />}
        {view === 'hook-form' && <HookForm />}
      </Modal>
    </div>
  );
}
