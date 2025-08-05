import { create } from 'zustand'

interface PopupExpandState {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
}

export const usePopupExpandStore = create<PopupExpandState>((set) => ({
  isExpanded: false,
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
})) 
