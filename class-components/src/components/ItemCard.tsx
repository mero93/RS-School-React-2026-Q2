import { Component } from 'react';
import type { ComicStrip } from '../types/comic-strip';

interface CardProps {
  item: ComicStrip;
}

class ItemCard extends Component<CardProps> {
  render() {
    const { item } = this.props;

    const dateRange = `Published: ${item.publishedYearFrom || 'N/A'} - ${item.publishedYearTo || 'Present'}`;
    const pages = item.numberOfPages ? ` | Pages: ${item.numberOfPages}` : '';
    const description = `${dateRange}${pages}`;

    return (
      <div className="result-card">
        <h3>{item.title}</h3>
        <p>{description}</p>
      </div>
    );
  }
}

export default ItemCard;
