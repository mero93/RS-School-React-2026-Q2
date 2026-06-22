'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCheckItemStore } from '../../store/check-item.store';
import type { ComicStrip } from '../../types/comic-strip';
import ItemCard from '../ItemCard/ItemCard';
import { useTranslations } from 'next-intl';
import './Results.css';

interface ResultsProps {
  hasError: boolean;
  items: ComicStrip[];
}

export default function Results(props: Readonly<ResultsProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Home.Results');

  const { selectedItems, toggleItem } = useCheckItemStore();

  const openCard = (uid: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('details', uid);
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  if (props.hasError) {
    throw new Error(t('crashSimulation'));
  }

  const items = props.items ?? [];

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
                openCard={openCard}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
