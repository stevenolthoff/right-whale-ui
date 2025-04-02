'use client'
import { useState, useMemo } from 'react'
import { ParsedPopulationData } from '../types/population'

export const usePopulationYearRange = (
  data: ParsedPopulationData[] | undefined
) => {
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2023])

  const { minYear, maxYear } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minYear: 1990, maxYear: 2023 }
    }

    const years = data.map((item) => item.year)
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
    }
  }, [data])

  return {
    yearRange,
    setYearRange,
    minYear,
    maxYear,
  }
}
