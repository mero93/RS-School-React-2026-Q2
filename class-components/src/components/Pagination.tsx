import type { PageData } from '../types/api-response';

interface PaginationProps {
  page: PageData;
  onPageChange: (index: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange }) => {
  const { pageNumber, totalPages } = page;
  const currentPage = pageNumber + 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { pageNumber, totalPages } = page;
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

    if (start > 3) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '5px',
        marginTop: '20px',
        alignItems: 'center',
      }}
    >
      <button
        disabled={pageNumber === 0}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Prev
      </button>

      {getPageNumbers().map((p) => (
        <button
          key={p}
          disabled={p === '...'}
          onClick={() => typeof p === 'number' && onPageChange(p - 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: p === currentPage ? '#007bff' : '#fff',
            color: p === currentPage ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: p === '...' ? 'default' : 'pointer',
            fontWeight: p === currentPage ? 'bold' : 'normal',
          }}
        >
          {p}
        </button>
      ))}

      <button
        disabled={pageNumber >= totalPages - 1}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
