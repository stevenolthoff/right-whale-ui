import { useState, useEffect } from 'react'
import { ParsedMortalityCase } from '../types/mortality'

export const useMortalityYearRange = (data: ParsedMortalityCase[]) => {
  const [years, setYears] = useState<{
    min: number
    max: number
    range: [number, number]
  }>({
    min: 0,
    max: 0,
    range: [0, 0],
  })

  useEffect(() => {
    if (data.length > 0) {
      const years = data.map(item => item.year)
      const min = Math.min(...years)
      const max = Math.max(...years)
      setYears({
        min,
        max,
        range: [min, max],
      })
    }
  }, [data])

  return {
    yearRange: years.range,
    setYearRange: (range: [number, number]) =>
      setYears((prev) => ({ ...prev, range })),
    minYear: years.min,
    maxYear: years.max,
  }
} 
