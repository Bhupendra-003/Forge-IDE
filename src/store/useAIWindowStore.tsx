import { create } from "zustand";

interface AIWindowState {
  isOpen: boolean;
  toggleAIWindow: () => void;
  openAIWindow: () => void;
  closeAIWindow: () => void;
}

export const useAIWindowStore = create<AIWindowState>((set) => ({
  isOpen: false,
  toggleAIWindow: () => set((state) => ({ isOpen: !state.isOpen })),
  openAIWindow: () => set({ isOpen: true }),
  closeAIWindow: () => set({ isOpen: false }),
}));
