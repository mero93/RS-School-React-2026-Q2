import { describe, it, expect, beforeEach } from 'vitest';
import type { ComicStrip } from '../types/comic-strip';
import { useCheckItemStore } from './check-item.store';

describe('useCheckItemStore', () => {
  const mockItem1: ComicStrip = { uid: '1', title: 'Comic One' };
  const mockItem2: ComicStrip = { uid: '2', title: 'Comic Two' };

  beforeEach(() => {
    useCheckItemStore.getState().clearAll();
  });

  it('should initialize with default values', () => {
    const state = useCheckItemStore.getState();
    expect(state.selectedItems).toEqual([]);
    expect(state.selectedCount).toBe(0);
  });

  it('should add an item to selectedItems and increment selectedCount when not present', () => {
    useCheckItemStore.getState().toggleItem(mockItem1);

    const state = useCheckItemStore.getState();
    expect(state.selectedItems).toEqual([mockItem1]);
    expect(state.selectedCount).toBe(1);
  });

  it('should remove an item from selectedItems and decrement selectedCount when already present', () => {
    useCheckItemStore.getState().toggleItem(mockItem1);
    useCheckItemStore.getState().toggleItem(mockItem2);
    useCheckItemStore.getState().toggleItem(mockItem1);

    const state = useCheckItemStore.getState();
    expect(state.selectedItems).toEqual([mockItem2]);
    expect(state.selectedCount).toBe(1);
  });

  it('should reset state completely when clearAll is called', () => {
    useCheckItemStore.getState().toggleItem(mockItem1);
    useCheckItemStore.getState().toggleItem(mockItem2);
    useCheckItemStore.getState().clearAll();

    const state = useCheckItemStore.getState();
    expect(state.selectedItems).toEqual([]);
    expect(state.selectedCount).toBe(0);
  });
});
