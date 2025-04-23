import { create } from 'zustand'
import { InjuryCase } from '../types/monitoring'

interface YearRangeState {
  yearRange: [number, number]
  minYear: number
  maxYear: number
  setYearRange: (range: [number, number]) => void
  setMinMaxYears: (
    data: InjuryCase[],
    filter?: (item: InjuryCase) => boolean
  ) => void
  isUpdating: boolean
}

export const useYearRangeStore = create<YearRangeState>((set) => ({
  yearRange: [2000, 2024], // Default range
  minYear: 2000,
  maxYear: 2024,
  isUpdating: false,
  setYearRange: (range) => {
    set((state) => {
      // Only update if the range is different and we're not already updating
      if (
        !state.isUpdating &&
        (state.yearRange[0] !== range[0] || state.yearRange[1] !== range[1])
      ) {
        return { yearRange: range, isUpdating: true }
      }
      return state
    })
    // Reset the updating flag after a short delay
    setTimeout(() => {
      set({ isUpdating: false })
    }, 0)
  },
  setMinMaxYears: (data, filter) => {
    if (!data?.length) return

    // Apply filter if provided
    const filteredData = filter ? data.filter(filter) : data
    if (!filteredData.length) return

    const years = filteredData
      .map((item) => new Date(item.DetectionDate).getFullYear())
      .filter((year) => !isNaN(year))

    if (!years.length) return

    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    set((state) => {
      // Only update if the values are different
      if (state.minYear !== minYear || state.maxYear !== maxYear) {
        // Also update the year range if it's outside the new bounds
        const newYearRange = [...state.yearRange] as [number, number]
        if (newYearRange[0] < minYear) newYearRange[0] = minYear
        if (newYearRange[1] > maxYear) newYearRange[1] = maxYear

        return {
          minYear,
          maxYear,
          yearRange: newYearRange,
        }
      }
      return state
    })
  },
}))
