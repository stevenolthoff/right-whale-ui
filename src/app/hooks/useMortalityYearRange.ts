'use client'
import { useState, useMemo, useEffect } from 'react'
import { ParsedMortalityCase } from '../types/mortality'

export const useMortalityYearRange = (
  data: ParsedMortalityCase[] | null,
  filter?: (item: ParsedMortalityCase) => boolean
) => {
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

  // Update yearRange when minYear/maxYear change
  useEffect(() => {
    setYearRange([1980, maxYear])
  }, [minYear, maxYear])

  return { yearRange, setYearRange, minYear, maxYear }
} 
