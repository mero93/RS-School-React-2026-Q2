import type { PageData } from '../../types/api-response';
import './Pagination.css';

interface PaginationProps {
  page: PageData;
  onPageChange: (index: number) => void;
}

export default function Pagination(props: Readonly<PaginationProps>) {
  const { page, onPageChange } = props;
  const { pageNumber, totalPages } = page;
  const currentPage = pageNumber + 1;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        type="button"
        className="nav-btn"
        disabled={pageNumber === 0}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Prev
      </button>

      {getPageNumbers(pageNumber, totalPages).map((p, idx) => {
        const isActive = p === currentPage;
        const isEllipsis = p === '...';

        return (
          <button
            key={`page-nav-${p}-${idx}`}
            type="button"
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
        type="button"
        className="nav-btn"
        disabled={pageNumber >= totalPages - 1}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
      </button>
    </div>
  );
}

const getPageNumbers = (
  pageNumber: number,
  totalPages: number
): (number | string)[] => {
  const current = pageNumber + 1;
  const pages: (number | string)[] = [];

  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < totalPages - 2) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
