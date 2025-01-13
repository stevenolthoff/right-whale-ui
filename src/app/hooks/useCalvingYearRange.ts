'use client'
import { useState, useEffect } from 'react'
import { ParsedCalvingCase } from '../types/calving'

export const useCalvingYearRange = (data: ParsedCalvingCase[]) => {
  const [yearRange, setYearRange] = useState<[number, number]>([0, 0])
  const [minYear, setMinYear] = useState(0)
  const [maxYear, setMaxYear] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const years = data.map((item) => item.year)
      const min = Math.min(...years)
      const max = Math.max(...years)
      setMinYear(min)
      setMaxYear(max)
      setYearRange([1980, max])
    }
  }, [data])

  return {
    yearRange,
    setYearRange,
    minYear,
    maxYear,
  }
}
