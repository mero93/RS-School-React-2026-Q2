import { useSearchParams } from 'react-router-dom';
import { useCheckItemStore } from '../../store/check-item.store';
import type { ComicStrip } from '../../types/comic-strip';
import ItemCard from '../ItemCard/ItemCard';
import './Results.css';

interface ResultsProps {
  hasError: boolean;
  items: ComicStrip[] | undefined;
}

export default function Results(props: Readonly<ResultsProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedItems, toggleItem } = useCheckItemStore();

  const openCard = (uid: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('details', uid);
    setSearchParams(nextParams);
  };

  if (props.hasError) {
    throw new Error('Simulation: Results component crashed!');
  }

  const { items } = props;

  return (
    <div className="results-container">
      <h3 className="results-heading">Results Area</h3>

      <div className="results-grid">
        {!items || items.length === 0 ? (
          <p className="results-empty-state">
            No results found. Try a different search term.
          </p>
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
