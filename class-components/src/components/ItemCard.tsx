import { Component, type CSSProperties } from 'react';
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
      <div style={styles.card}>
        <h3 style={styles.title}>{item.title}</h3>
        <p style={styles.text}>{description}</p>
      </div>
    );
  }
}

const styles: { [key: string]: CSSProperties } = {
  card: {
    width: '280px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e1e1e1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#1a1a1a',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  text: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#636363',
    lineHeight: 1.4,
  },
};

export default ItemCard;
