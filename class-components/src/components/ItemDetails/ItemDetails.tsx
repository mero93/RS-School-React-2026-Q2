import { useSearchParams } from 'react-router-dom';
import './ItemDetails.css';
import { useComicDetail } from '../../hooks/useCache';

export default function ItemDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailId = searchParams.get('details');

  const { data: comic, isLoading, isError, error } = useComicDetail(detailId);

  const handleClose = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('details');
    setSearchParams(nextParams);
  };

  const formatDate = (year?: number, month?: number, day?: number): string => {
    if (!year) return 'N/A';
    return `${day ? day + '/' : ''}${month ? month + '/' : ''}${year}`;
  };

  if (!detailId) return null;

  const dateFrom = formatDate(
    comic?.publishedYearFrom,
    comic?.publishedMonthFrom,
    comic?.publishedDayFrom
  );
  const dateTo = formatDate(
    comic?.publishedYearTo,
    comic?.publishedMonthTo,
    comic?.publishedDayTo
  );
  const dateRange =
    dateFrom || dateTo
      ? `${dateFrom || 'N/A'} - ${dateTo || 'Present'}`
      : 'N/A';

  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>Comic Details</h2>
        <button
          type="button"
          className="close-btn"
          onClick={handleClose}
          aria-label="Close details panel"
        >
          &times;
        </button>
      </div>

      <div className="details-content">
        {isError && (
          <p className="details-status error">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        )}

        {isLoading && <p className="details-status">Loading details...</p>}

        {!isLoading && !isError && comic && (
          <div className="comic-info">
            <h3 className="comic-title">{comic.title}</h3>
            <div className="meta-group">
              <p>
                <strong>Published Range:</strong> {dateRange}
              </p>
              {!!comic.numberOfPages && (
                <p>
                  <strong>Length:</strong> {comic.numberOfPages} Pages
                </p>
              )}
            </div>
            <div className="uid-badge">
              <small>Catalog ID: {comic.uid}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
