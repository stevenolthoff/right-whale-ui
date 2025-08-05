'use client'
import { create } from 'zustand'
import { InjuryCase } from '../types/monitoring'
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table'

interface FilteredDataStore {
  filteredData: InjuryCase[]
  columns: ColumnDef<InjuryCase, any>[]
  columnFilters: ColumnFiltersState
  setFilteredData: (data: InjuryCase[]) => void
  setColumns: (columns: ColumnDef<InjuryCase, any>[]) => void
  setColumnFilters: (filters: ColumnFiltersState) => void
}

export const useFilteredData = create<FilteredDataStore>((set) => ({
  filteredData: [],
  columns: [],
  columnFilters: [],
  setFilteredData: (data) => set({ filteredData: data }),
  setColumns: (columns) => set({ columns }),
  setColumnFilters: (filters) => set({ columnFilters: filters }),
})) 
