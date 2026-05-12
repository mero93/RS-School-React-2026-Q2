import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pagination from './Pagination';
import type { PageData } from '../../types/api-response';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  const createPageData = (current: number, total: number): PageData => ({
    pageNumber: current,
    totalPages: total,
    pageSize: 10,
    totalElements: total * 10,
    numberOfElements: 10,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with small number of pages', () => {
    const page = createPageData(0, 3);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('renders ellipses when there are many pages', () => {
    const page = createPageData(0, 10);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables "Prev" button on the first page', () => {
    const page = createPageData(0, 5);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables "Next" button on the last page', () => {
    const page = createPageData(4, 5);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with correct index when a number is clicked', () => {
    const page = createPageData(0, 5);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const pageTwo = screen.getByText('2');
    fireEvent.click(pageTwo);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when "Next" is clicked', () => {
    const page = createPageData(1, 5);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('does not call onPageChange when ellipsis is clicked', () => {
    const page = createPageData(4, 10);
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const ellipses = screen.getAllByText('...');
    expect(ellipses[0]).toBeDisabled();

    fireEvent.click(ellipses[0]);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('highlights the active page', () => {
    const page = createPageData(2, 5); // Page 3
    render(<Pagination page={page} onPageChange={mockOnPageChange} />);

    const activeBtn = screen.getByText('3');
    expect(activeBtn).toHaveClass('active');
  });
});
