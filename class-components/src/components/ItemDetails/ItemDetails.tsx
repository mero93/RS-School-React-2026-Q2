import { getTranslations } from 'next-intl/server';
import './ItemDetails.css';
import { ApiService } from '../../services/api.service';
import Link from 'next/link';

export default async function ItemDetails({ uid }: Readonly<{ uid: string }>) {
  const t = await getTranslations('Home.ItemDetails');
  const comic = await ApiService.getOne(uid);

  const formatDate = (y?: number, m?: number, d?: number) =>
    y ? `${d ? d + '/' : ''}${m ? m + '/' : ''}${y}` : 'N/A';

  const dateRange = `${formatDate(comic.publishedYearFrom, comic.publishedMonthFrom, comic.publishedDayFrom)} - ${
    formatDate(
      comic.publishedYearTo,
      comic.publishedMonthTo,
      comic.publishedDayTo
    ) || 'Present'
  }`;

  return (
    <div className="details-panel">
      <div className="details-header">
        <h2>{t('heading')}</h2>
        <Link href="?" className="close-btn">
          &times;
        </Link>
      </div>
      <div className="details-content">
        <div className="comic-info">
          <h3 className="comic-title">{comic.title}</h3>
          <p>
            <strong>{t('publishedRange')}</strong> {dateRange}
          </p>
          {!!comic.numberOfPages && (
            <p>
              <strong>{t('length')}</strong> {comic.numberOfPages} {t('pages')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
