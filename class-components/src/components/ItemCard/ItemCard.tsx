import { Component } from 'react';
import type { ComicStrip } from '../../types/comic-strip';
import './ItemCard.css';

interface CardProps {
  item: ComicStrip;
}

class ItemCard extends Component<CardProps> {
  render() {
    const { item } = this.props;

    const dateRange = `Published: ${item.publishedYearFrom || 'N/A'} - ${
      item.publishedYearTo || 'Present'
    }`;
    const pages = item.numberOfPages ? ` | Pages: ${item.numberOfPages}` : '';
    const description = `${dateRange}${pages}`;

    return (
      <div className="item-card">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-text">{description}</p>
      </div>
    );
  }
}

export default ItemCard;
