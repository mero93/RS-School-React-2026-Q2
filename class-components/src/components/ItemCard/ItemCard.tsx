'use client';

import type { ComicStrip } from '../../types/comic-strip';
import './ItemCard.css';
import { LucideSquare, LucideSquareCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CardProps {
  item: ComicStrip;
  openCard: (uid: string) => void;
  toggleCard: (event: React.MouseEvent) => void;
  isSelected: boolean;
}

export default function ItemCard({
  item,
  openCard,
  toggleCard,
  isSelected,
}: Readonly<CardProps>) {
  const t = useTranslations('Home.Results.ItemCard');

  const handleCardClick = () => {
    openCard(item.uid);
  };

  const dateRange = `${t('published')} ${item.publishedYearFrom || 'N/A'} - ${
    item.publishedYearTo || t('present')
  }`;
  const pages = item.numberOfPages
    ? ` | ${t('pages')} ${item.numberOfPages}`
    : '';
  const description = `${dateRange}${pages}`;

  return (
    <div
      className="item-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      <h3 className="item-card-title">{item.title}</h3>
      <p className="item-card-text">{description}</p>

      <button className="checkbox" onClick={(e) => toggleCard(e)} type="button">
        {isSelected ? <LucideSquareCheckBig /> : <LucideSquare />}
      </button>
    </div>
  );
}
