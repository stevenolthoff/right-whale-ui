'use client'
import React, { useRef } from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useInjuryYearRange } from '@/app/hooks/useInjuryYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

export default function InjuryTotal() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useInjuryData()
  const yearRangeProps = useInjuryYearRange(data)

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Create a map of year to count
    const yearCounts = new Map<number, number>()
    
    // Filter by year range and count occurrences
    data
      .filter(item => item.year >= yearRangeProps.yearRange[0] && item.year <= yearRangeProps.yearRange[1])
      .forEach(item => {
        yearCounts.set(item.year, (yearCounts.get(item.year) || 0) + 1)
      })

    // Create array with all consecutive years
    const formattedData = []
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart 
          chartRef={chartRef}
          filename={`injury-total-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title="Total Right Whale Injuries"
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>
      
      <div ref={chartRef} className='h-[700px] w-full'>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Total Right Whale Injuries</h2>
          <p className="text-sm text-gray-600 mb-4">
            Data from {yearRangeProps.yearRange[0]} to {yearRangeProps.yearRange[1]}
          </p>
        </div>
        <div className='h-[600px]'>
          <DataChart data={chartData} stacked={false} yAxisLabel='Number of Injuries' />
        </div>
      </div>
    </div>
  )
}
