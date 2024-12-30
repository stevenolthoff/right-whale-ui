import { useState } from 'react'
import { ParsedInjuryCase } from '../types/monitoring'

export function useInjuryYearRange(data: ParsedInjuryCase[]) {
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2024])

  const years = data?.map(item => item.year) || []
  const minYear = years.length ? Math.min(...years) : 2000
  const maxYear = years.length ? Math.max(...years) : 2024

  return { yearRange, setYearRange, minYear, maxYear }
} 
