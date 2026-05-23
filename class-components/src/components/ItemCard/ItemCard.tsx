import { useSearchParams } from 'react-router-dom';
import type { ComicStrip } from '../../types/comic-strip';
import './ItemCard.css';
import { LucideSquare, LucideSquareCheckBig } from 'lucide-react';

interface CardProps {
  item: ComicStrip;
  toggleCard: (event: React.MouseEvent) => void;
  isSelected: boolean;
}

export default function ItemCard({
  item,
  toggleCard,
  isSelected,
}: Readonly<CardProps>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCardClick = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('details', item.uid);
    setSearchParams(nextParams);
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
