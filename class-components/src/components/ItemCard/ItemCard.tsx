import type { ComicStrip } from '../../types/comic-strip';
import './ItemCard.css';
import { LucideSquare, LucideSquareCheckBig } from 'lucide-react';

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
  const handleCardClick = () => {
    openCard(item.uid);
  };

  const dateRange = `Published: ${item.publishedYearFrom || 'N/A'} - ${
    item.publishedYearTo || 'Present'
  }`;
  const pages = item.numberOfPages ? ` | Pages: ${item.numberOfPages}` : '';
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

      <button className="checkbox" onClick={(e) => toggleCard(e)}>
        {isSelected ? <LucideSquareCheckBig /> : <LucideSquare />}
      </button>
    </div>
  );
}
