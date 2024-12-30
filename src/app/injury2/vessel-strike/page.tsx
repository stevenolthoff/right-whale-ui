'use client'
import React from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart, StackedChartData } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { InjuryCase } from '@/app/types/monitoring'

const VesselStrike = () => {
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results as InjuryCase[],
    (item) => item.InjuryTypeDescription === 'Vessel Strike'
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const chartData = results
    .filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return (
        item.InjuryTypeDescription === 'Vessel Strike' &&
        year >= yearRange[0] && 
        year <= yearRange[1]
      )
    })
    .reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const accountType = item.InjuryAccountDescription
      
      if (!acc[year]) {
        acc[year] = {}
      }
      acc[year][accountType] = (acc[year][accountType] || 0) + 1
      return acc
    }, {} as Record<number, Record<string, number>>)

  const formattedData = (() => {
    // Get min and max years from the data
    const years = Object.keys(chartData).map(Number)
    const minDataYear = Math.min(...years)
    const maxDataYear = Math.max(...years)
    
    // Get all unique account types
    const accountTypes = new Set<string>()
    Object.values(chartData).forEach(yearData => {
      Object.keys(yearData).forEach(type => accountTypes.add(type))
    })
    
    // Create array with all consecutive years
    const allData = []
    for (let year = minDataYear; year <= maxDataYear; year++) {
      const yearData = { year } as Record<string, number>
      accountTypes.forEach(type => {
        yearData[type] = chartData[year]?.[type] || 0
      })
      allData.push(yearData)
    }
    return allData.sort((a, b) => a.year - b.year)
  })()

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      <DataChart data={formattedData as StackedChartData[]} stacked={true} />
    </div>
  )
}

export default VesselStrike
