'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart, StackedChartData } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { Loader } from '@/app/components/ui/Loader'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

const InjuryType = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(results, (item) => true)

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  const chartData = results
    .filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })
    .reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const injuryType = item.InjuryTypeDescription
      
      if (!acc[year]) {
        acc[year] = {}
      }
      acc[year][injuryType] = (acc[year][injuryType] || 0) + 1
      return acc
    }, {} as Record<number, Record<string, number>>)

  const formattedData = (() => {
    // Get min and max years from the data
    const years = Object.keys(chartData).map(Number)
    const minDataYear = Math.min(...years)
    const maxDataYear = Math.max(...years)
    
    // Get all unique injury types
    const injuryTypes = new Set<string>()
    Object.values(chartData).forEach(yearData => {
      Object.keys(yearData).forEach(type => injuryTypes.add(type))
    })
    
    // Create array with all consecutive years
    const allData = []
    for (let year = minDataYear; year <= maxDataYear; year++) {
      const yearData = { year } as Record<string, number>
      injuryTypes.forEach(type => {
        yearData[type] = chartData[year]?.[type] || 0
      })
      allData.push(yearData)
    }
    return allData.sort((a, b) => a.year - b.year)
  })()

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <YearRangeSlider
            yearRange={yearRange}
            minYear={minYear}
            maxYear={maxYear}
            onChange={setYearRange}
          />
        </div>
        <ExportChart 
          chartRef={chartRef}
          filename={`injury-types-${yearRange[0]}-${yearRange[1]}.png`}
          title="Right Whale Injury Types"
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>
      
      <div ref={chartRef} className='h-[700px] w-full'>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Right Whale Injury Types</h2>
          <p className="text-sm text-gray-600 mb-4">
            Data from {yearRange[0]} to {yearRange[1]}
          </p>
        </div>
        <div className='h-[600px]'>
          <DataChart data={formattedData as StackedChartData[]} stacked={true} />
        </div>
      </div>
    </div>
  )
}

export default InjuryType 
