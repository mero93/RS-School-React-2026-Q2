import { create } from 'zustand';
import type { ComicStrip } from '../types/comic-strip';

type CheckItemState = {
  selectedItems: ComicStrip[],
  selectedCount: number,
  toggleItem: (item: ComicStrip) => void,
  clearAll: () => void,
}

export const useCheckItemStore = create<CheckItemState>((set) => ({
  selectedItems: [],
  selectedCount: 0,

  toggleItem: (item: ComicStrip) => set((state) => {
    const isAlreadySelected = state.selectedItems.some((i) => i.uid === item.uid);
    
    let updatedItems;
    if (isAlreadySelected) {
      updatedItems = state.selectedItems.filter((i) => i.uid !== item.uid);
    } else {
      updatedItems = [...state.selectedItems, item];
    }

    return {
      selectedItems: updatedItems,
      selectedCount: updatedItems.length,
    };
  }),

  clearAll: () => set({
    selectedItems: [],
    selectedCount: 0,
  }),
}));