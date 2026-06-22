'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useComicDetail } from '../../hooks/useCache';
import { useTranslations } from 'next-intl';
import './ItemDetails.css';

export default function ItemDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Home.ItemDetails');

  const detailId = searchParams.get('details');
  const { data: comic, isLoading, isError, error } = useComicDetail(detailId);

  const handleClose = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('details');
    router.push(`${pathname}?${nextParams.toString()}`);
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
        <h2>{t('heading')}</h2>
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
            {error instanceof Error ? error.message : t('error')}
          </p>
        )}

        {isLoading && <p className="details-status">{t('loading')}</p>}

        {!isLoading && !isError && comic && (
          <div className="comic-info">
            <h3 className="comic-title">{comic.title}</h3>
            <div className="meta-group">
              <p>
                <strong>{t('publishedRange')}</strong> {dateRange}
              </p>
              {!!comic.numberOfPages && (
                <p>
                  <strong>{t('length')}</strong> {comic.numberOfPages}{' '}
                  {t('pages')}
                </p>
              )}
            </div>
            <div className="uid-badge">
              <small>
                {t('catalogId')} {comic.uid}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
