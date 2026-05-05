import { Component, type ReactNode, type CSSProperties } from 'react';
import type { PageData } from '../types/api-response';

interface PaginationProps {
  page: PageData;
  onPageChange: (index: number) => void;
}

class Pagination extends Component<PaginationProps> {
  getPageNumbers = (): (number | string)[] => {
    const { pageNumber, totalPages } = this.props.page;
    const pages: (number | string)[] = [];
    const currentPage = pageNumber + 1;

    pages.push(1);
    if (totalPages >= 2) pages.push(2);

    if (totalPages <= 5) {
      for (let i = 3; i <= totalPages; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      return pages;
    }

    let start = Math.max(3, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 3) pages.push('...');

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  render(): ReactNode {
    const { page, onPageChange } = this.props;
    const { pageNumber, totalPages } = page;
    const currentPage = pageNumber + 1;

    return (
      <div style={styles.container}>
        <button
          style={styles.navBtn}
          disabled={pageNumber === 0}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Prev
        </button>

        {this.getPageNumbers().map((p, idx) => {
          const isActive = p === currentPage;
          const isEllipsis = p === '...';

          return (
            <button
              key={`${p}-${idx}`}
              disabled={isEllipsis}
              onClick={() => typeof p === 'number' && onPageChange(p - 1)}
              style={{
                ...styles.pageBtn,
                backgroundColor: isActive ? '#5d85ff' : '#fff',
                color: isActive ? '#fff' : '#000',
                borderColor: isActive ? '#5d85ff' : '#ccc',
                cursor: isEllipsis ? 'default' : 'pointer',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          style={styles.navBtn}
          disabled={pageNumber >= totalPages - 1}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    );
  }
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    justifyItems: 'center',
    gap: '8px',
    marginTop: '30px',
    marginBottom: '30px',
    alignItems: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  navBtn: {
    padding: '8px 14px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  pageBtn: {
    minWidth: '36px',
    height: '36px',
    padding: '0 5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
};

export default Pagination;
