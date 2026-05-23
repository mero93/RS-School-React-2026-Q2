import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ComicStrip } from '../../types/comic-strip';
import './ItemDetails.css';

interface SingleApiResponse {
  comicStrip: ComicStrip;
}

export default function ItemDetails() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [comic, setComic] = useState<ComicStrip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const detailId = searchParams.get('details');

  useEffect(() => {
    if (!detailId) {
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://stapi.co/api/v1/rest/comicStrip?uid=${detailId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch comic details');
        }

        const data: SingleApiResponse = await response.json();
        setComic(data.comicStrip);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [detailId]);

  const handleClose = () => {
    setComic(null);
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
        {error && <p className="details-status error">{error}</p>}

        {!loading && !error && comic && (
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
