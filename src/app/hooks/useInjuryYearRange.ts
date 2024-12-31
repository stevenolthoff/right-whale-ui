'use client'
import { useState, useMemo, useEffect } from 'react'
import { ParsedInjuryCase } from '../types/injury'

export function useInjuryYearRange(
  data: ParsedInjuryCase[] | null,
  filter?: (item: ParsedInjuryCase) => boolean
) {
  const { minYear, maxYear } = useMemo(() => {
    if (!data?.length) return { minYear: 2000, maxYear: 2024 }
    const filteredData = filter ? data.filter(filter) : data
    const years = filteredData.map(item => item.year)
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    }
  }, [data, filter])

  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear])

  useEffect(() => {
    setYearRange([minYear, maxYear])
  }, [minYear, maxYear])

  return { yearRange, setYearRange, minYear, maxYear }
} 
