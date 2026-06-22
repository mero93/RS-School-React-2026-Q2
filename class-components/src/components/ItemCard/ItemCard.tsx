'use client';

import type { ComicStrip } from '../../types/comic-strip';
import './ItemCard.css';
import { LucideSquare, LucideSquareCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

interface CardProps {
  item: ComicStrip;
  toggleCard: (event: React.MouseEvent) => void;
  isSelected: boolean;
  renderLink: (children: ReactNode) => ReactNode;
}

export default function ItemCard({
  item,
  toggleCard,
  isSelected,
  renderLink,
}: Readonly<CardProps>) {
  const t = useTranslations('Home.Results.ItemCard');

  const dateRange = `${t('published')} ${item.publishedYearFrom || 'N/A'} - ${
    item.publishedYearTo || t('present')
  }`;
  const pages = item.numberOfPages
    ? ` | ${t('pages')} ${item.numberOfPages}`
    : '';
  const description = `${dateRange}${pages}`;

  return (
    <div className="item-card">
      {renderLink(
        <div className="item-card-content">
          <h3 className="item-card-title">{item.title}</h3>
          <p className="item-card-text">{description}</p>
        </div>
      )}
      <button className="checkbox" onClick={toggleCard} type="button">
        {isSelected ? <LucideSquareCheckBig /> : <LucideSquare />}
      </button>
    </div>
  );
}
