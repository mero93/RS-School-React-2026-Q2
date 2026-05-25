import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CheckItemsFlyout from './CheckItemsFlyout';
import type { ComicStrip } from '../../types/comic-strip';

const mockClearAll = vi.fn();
let mockSelectedItems: ComicStrip[] = [];
let mockSelectedCount = 0;

vi.mock('../../store/check-item.store', () => ({
  useCheckItemStore: () => ({
    selectedItems: mockSelectedItems,
    selectedCount: mockSelectedCount,
    clearAll: mockClearAll,
  }),
}));

describe('CheckItemsFlyout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedItems = [];
    mockSelectedCount = 0;

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when selectedCount is 0', () => {
    const { container } = render(<CheckItemsFlyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders badge counter and action buttons when selectedCount is greater than 0', () => {
    mockSelectedCount = 3;
    mockSelectedItems = [
      { uid: '1', title: 'Comic One' },
      { uid: '2', title: 'Comic Two' },
      { uid: '3', title: 'Comic Three' },
    ];

    const { container } = render(<CheckItemsFlyout />);

    expect(container.querySelector('.item-counter-badge')?.textContent).toBe('3');
    expect(container.querySelector('.download-button')).toBeInTheDocument();
    expect(container.querySelector('.erase-button')).toBeInTheDocument();
  });

  it('calls clearAll when the erase button is clicked', () => {
    mockSelectedCount = 1;
    mockSelectedItems = [{ uid: '1', title: 'Comic One' }];

    const { container } = render(<CheckItemsFlyout />);
    const eraseButton = container.querySelector('.erase-button');

    if (!eraseButton) throw new Error('Erase button not found');
    fireEvent.click(eraseButton);

    expect(mockClearAll).toHaveBeenCalledTimes(1);
  });

  it('calls URL.createObjectURL and URL.revokeObjectURL on download click', () => {
    mockSelectedCount = 1;
    mockSelectedItems = [{ uid: '1', title: 'Comic One' }];

    const { container } = render(<CheckItemsFlyout />);
    const downloadButton = container.querySelector('.download-button');

    if (!downloadButton) throw new Error('Download button not found');
    fireEvent.click(downloadButton);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});