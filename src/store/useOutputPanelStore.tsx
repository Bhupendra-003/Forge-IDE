import { create } from "zustand";

interface OutputPanelState {
  isVisible: boolean;
  toggleOutputPanel: () => void;
  openOutputPanel: () => void;
  closeOutputPanel: () => void;
}

export const useOutputPanelStore = create<OutputPanelState>((set) => ({
  isVisible: true,
  toggleOutputPanel: () => set((state) => ({ isVisible: !state.isVisible })),
  openOutputPanel: () => set({ isVisible: true }),
  closeOutputPanel: () => set({ isVisible: false }),
}));
