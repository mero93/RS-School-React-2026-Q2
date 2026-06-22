'use client';

import { useCheckItemStore } from '../../store/check-item.store';
import type { ComicStrip } from '../../types/comic-strip';
import type { PageData } from '../../types/api-response';
import ItemCard from '../ItemCard/ItemCard';
import Pagination from '../Pagination/Pagination';
import { useTranslations } from 'next-intl';
import './Results.css';
import { Link } from '../../i18n/routing';

interface ResultsProps {
  items: ComicStrip[];
  page: PageData;
}

export default function Results({ items, page }: Readonly<ResultsProps>) {
  const t = useTranslations('Home.Results');
  const { selectedItems, toggleItem } = useCheckItemStore();

  return (
    <div className="results-container">
      <h3 className="results-heading">{t('heading')}</h3>
      <div className="results-grid">
        {items.length === 0 ? (
          <p className="results-empty-state">{t('emptyState')}</p>
        ) : (
          items.map((item) => {
            const isSelected = selectedItems.some((i) => i.uid === item.uid);
            return (
              <ItemCard
                key={item.uid}
                item={item}
                toggleCard={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  toggleItem(item);
                }}
                isSelected={isSelected}
                renderLink={(children) => (
                  <Link href={`?details=${item.uid}`}>{children}</Link>
                )}
              />
            );
          })
        )}
      </div>

      <Pagination page={page} />
    </div>
  );
}
