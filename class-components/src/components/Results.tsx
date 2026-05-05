import { Component, type CSSProperties } from 'react';
import type { ComicStrip } from '../types/comic-strip';
import ItemCard from './ItemCard';

interface ResultsProps {
  hasError: boolean;
  items: ComicStrip[] | undefined;
}

class Results extends Component<ResultsProps> {
  render() {
    if (this.props.hasError) {
      throw new Error('Simulation: Results component crashed!');
    }

    const { items } = this.props;

    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>Results Area</h3>

        <div style={styles.grid}>
          {!items || items.length === 0 ? (
            <p style={styles.emptyState}>
              No results found. Try a different search term.
            </p>
          ) : (
            items.map((item) => <ItemCard key={item.uid} item={item} />)
          )}
        </div>
      </div>
    );
  }
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '20px',
    fontFamily: 'sans-serif',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    justifyItems: 'center',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#888',
    marginTop: '40px',
  },
};

export default Results;
