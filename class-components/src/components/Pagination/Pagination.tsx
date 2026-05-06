import { Component, type ReactNode } from 'react';
import type { PageData } from '../../types/api-response';
import './Pagination.css';

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
      <div className="pagination-container">
        <button
          className="nav-btn"
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
              className={`page-btn ${isActive ? 'active' : ''} ${
                isEllipsis ? 'ellipsis' : ''
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          className="nav-btn"
          disabled={pageNumber >= totalPages - 1}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    );
  }
}

export default Pagination;
