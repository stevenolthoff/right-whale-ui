'use client'
import { useState, useMemo, useEffect } from 'react'

interface HasYear {
  year?: number;
  DetectionDate?: string;  // For InjuryCase
}

export function useYearRange<T extends HasYear>(
  data: T[] | null,
  filter?: (item: T) => boolean
) {
  const { minYear, maxYear } = useMemo(() => {
    if (!data?.length) return { minYear: 2000, maxYear: 2024 }
    const filteredData = filter ? data.filter(filter) : data
    const years = filteredData.map(item => 
      item.year || new Date(item.DetectionDate!).getFullYear()
    )
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    }
  }, [data, filter])

  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear])

  // Update yearRange when minYear/maxYear change
  useEffect(() => {
    setYearRange([minYear, maxYear])
  }, [minYear, maxYear])

  return { yearRange, setYearRange, minYear, maxYear }
}
