'use client'
import React from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData.ts'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider.tsx'
import { DataChart } from '../../components/monitoring/DataChart.tsx'
import { useYearRange } from '../../hooks/useYearRange.ts'

const Active = () => {
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results,
    (item) => item.IsActiveCase === true
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const chartData = results
    .filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return item.IsActiveCase && year >= yearRange[0] && year <= yearRange[1]
    })
    .reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<number, number>)

  const formattedData = Object.entries(chartData)
    .map(([year, count]) => ({ year: parseInt(year), count: count as number }))
    .sort((a, b) => a.year - b.year)

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      <DataChart data={formattedData} />
    </div>
  )
}

export default Active
