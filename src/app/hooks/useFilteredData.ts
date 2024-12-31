'use client'
import { create } from 'zustand'
import { InjuryCase } from '../types/monitoring'

interface FilteredDataStore {
  filteredData: InjuryCase[]
  setFilteredData: (data: InjuryCase[]) => void
}

export const useFilteredData = create<FilteredDataStore>((set) => ({
  filteredData: [],
  setFilteredData: (data) => set({ filteredData: data }),
})) 
