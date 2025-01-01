'use client'
import { create } from 'zustand'
import { InjuryCase } from '../types/monitoring'
import { ColumnDef } from '@tanstack/react-table'

interface FilteredDataStore {
  filteredData: InjuryCase[]
  columns: ColumnDef<InjuryCase, any>[]
  setFilteredData: (data: InjuryCase[]) => void
  setColumns: (columns: ColumnDef<InjuryCase, any>[]) => void
}

export const useFilteredData = create<FilteredDataStore>((set) => ({
  filteredData: [],
  columns: [],
  setFilteredData: (data) => set({ filteredData: data }),
  setColumns: (columns) => set({ columns }),
})) 
