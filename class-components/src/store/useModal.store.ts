import { create } from 'zustand';

type ModalType = 'uncontrolled' | 'hook-form' | null;

interface ModalState {
  isOpen: boolean;
  view: ModalType;
  openModal: (view: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  view: null,
  openModal: (view) => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false, view: null }),
}));
