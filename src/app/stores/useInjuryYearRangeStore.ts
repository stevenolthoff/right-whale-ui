import { create } from 'zustand'
import { WhaleInjury } from '../types/whaleInjury'

interface InjuryYearRangeState {
  yearRange: [number, number]
  minYear: number
  maxYear: number
  setYearRange: (range: [number, number]) => void
  setMinMaxYears: (
    data: WhaleInjury[],
    filter?: (item: WhaleInjury) => boolean
  ) => void
  isUpdating: boolean
}

export const useInjuryYearRangeStore = create<InjuryYearRangeState>((set) => ({
  yearRange: [1980, new Date().getFullYear()], // Default range
  minYear: 1980,
  maxYear: new Date().getFullYear(),
  isUpdating: false,
  setYearRange: (range) => {
    set((state) => {
      if (
        !state.isUpdating &&
        (state.yearRange[0] !== range[0] || state.yearRange[1] !== range[1])
      ) {
        return { yearRange: range, isUpdating: true }
      }
      return state
    })
    setTimeout(() => {
      set({ isUpdating: false })
    }, 0)
  },
  setMinMaxYears: (data, filter) => {
    if (!data?.length) return

    const filteredData = filter ? data.filter(filter) : data
    if (!filteredData.length) return

    const years = filteredData
      .map((item) => new Date(item.DetectionDate).getUTCFullYear())
      .filter((year) => !isNaN(year))

    if (!years.length) return

    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    set((state) => {
      if (state.minYear !== minYear || state.maxYear !== maxYear) {
        return {
          minYear,
          maxYear,
          yearRange: [1980, maxYear], // Default to 1980 start
        }
      }
      return state
    })
  },
})) 