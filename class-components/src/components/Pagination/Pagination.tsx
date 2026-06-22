'use client';

import { Link } from '../../i18n/routing';
import { useSearchParams } from 'next/navigation';
import type { PageData } from '../../types/api-response';
import './Pagination.css';

interface PaginationProps {
  page: PageData;
}

export default function Pagination({ page }: Readonly<PaginationProps>) {
  const { pageNumber, totalPages } = page;
  const searchParams = useSearchParams();

  const getPageHref = (p: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    return `?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <Link
        href={getPageHref(pageNumber)}
        className={`nav-btn ${pageNumber === 0 ? 'disabled' : ''}`}
      >
        Prev
      </Link>

      {getPageNumbers().map((p) => (
        <Link
          key={p}
          href={getPageHref(p)}
          className={`page-btn ${p === pageNumber + 1 ? 'active' : ''}`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={getPageHref(pageNumber + 2)}
        className={`nav-btn ${pageNumber >= totalPages - 1 ? 'disabled' : ''}`}
      >
        Next
      </Link>
    </div>
  );
}
