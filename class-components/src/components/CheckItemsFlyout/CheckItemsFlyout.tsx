import { LucideDownload, LucideEraser } from 'lucide-react';
import { useCheckItemStore } from '../../store/check-item.store';
import type { ComicStrip } from '../../types/comic-strip';
import './CheckItemsFlyout.css';

export default function CheckItemsFlyout() {
  const { selectedItems, selectedCount, clearAll } = useCheckItemStore();

  if (!selectedCount) return null;

  const handleDownload = () => {
    const headers = [
      'uid',
      'title',
      'published year from',
      'published month from',
      'published day from',
      'published year to',
      'published month to',
      'published day to',
      'number of pages',
      'year from',
      'year to',
      'details url',
    ];

    const baseUrl = globalThis.location.origin;

    const rows = selectedItems.map((item: ComicStrip) => {
      return [
        `"${item.uid}"`,
        `"${item.title?.replaceAll('"', '""')}"`,
        item.publishedYearFrom ?? '...',
        item.publishedMonthFrom ?? '...',
        item.publishedDayFrom ?? '...',
        item.publishedYearTo ?? '...',
        item.publishedMonthTo ?? '...',
        item.publishedDayTo ?? '...',
        item.numberOfPages ?? '...',
        item.yearFrom ?? '...',
        item.yearTo ?? '...',
        `${baseUrl}/?details=${item.uid}`,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', `${selectedItems.length}_comic_strips.csv`);

    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout-container">
      <div className="flyout-content">
        <span className="item-counter-badge">{selectedCount}</span>
        <div className="action-buttons">
          <button onClick={handleDownload} className="download-button">
            <LucideDownload />
          </button>
          <button onClick={clearAll} className="erase-button">
            <LucideEraser />
          </button>
        </div>
      </div>
    </div>
  );
}
