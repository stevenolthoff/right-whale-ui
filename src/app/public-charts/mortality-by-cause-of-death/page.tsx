'use client'
import React from 'react'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'

export default function MortalityByCause() {
  const { data, loading, error } = useMortalityData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Get unique causes
    const causes = Array.from(new Set(data.map(item => item.causeOfDeath)))
      .sort((a, b) => a.localeCompare(b))

    // Create year-by-year data
    const yearData = new Map<number, Record<string, number>>()
    
    // Filter and count occurrences
    data
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, Object.fromEntries(causes.map(c => [c, 0])))
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[item.causeOfDeath]++
      })

    // Convert to array format for Recharts
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(causes.map(c => [c, 0])))
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      <DataChart data={chartData} stacked={true} />
    </div>
  )
}
