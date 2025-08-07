'use client'
import { create } from 'zustand'
import { WhaleInjury } from '../types/whaleInjury'

interface FilteredInjuryDataState {
  filteredData: WhaleInjury[]
  setFilteredData: (data: WhaleInjury[]) => void
}

export const useFilteredInjuryDataStore = create<FilteredInjuryDataState>((set) => ({
  filteredData: [],
  setFilteredData: (data) => set({ filteredData: data }),
})) 