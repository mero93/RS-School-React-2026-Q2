import { Component } from 'react';
import type { ComicStrip } from '../../types/comic-strip';
import ItemCard from '../ItemCard/ItemCard';
import './Results.css';

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
      <div className="results-container">
        <h3 className="results-heading">Results Area</h3>

        <div className="results-grid">
          {!items || items.length === 0 ? (
            <p className="results-empty-state">
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

export default Results;
