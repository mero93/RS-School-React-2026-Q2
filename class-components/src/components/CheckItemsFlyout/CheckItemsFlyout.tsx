'use client';

import { LucideDownload, LucideEraser } from 'lucide-react';
import { useCheckItemStore } from '../../store/check-item.store';
import './CheckItemsFlyout.css';
import { generateCsv } from '../../actions/export-csv';

export default function CheckItemsFlyout() {
  const { selectedItems, selectedCount, clearAll } = useCheckItemStore();

  if (!selectedCount) return null;

  const handleDownload = async () => {
    const baseUrl = globalThis.location.origin;

    const csvContent = await generateCsv(selectedItems, baseUrl);

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
