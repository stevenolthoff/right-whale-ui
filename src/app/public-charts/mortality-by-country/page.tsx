'use client'
import React, { useRef } from 'react'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

export default function MortalityByCountry() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(
    loading ? null : data,
    item => item.country === 'US' || item.country === 'CA'
  )

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Get unique countries
    const countries = Array.from(new Set(data.map(item => item.country)))
      .sort((a, b) => a.localeCompare(b))

    // Create year-by-year data
    const yearData = new Map<number, Record<string, number>>()
    
    // Filter and count occurrences
    data
      .filter(item => item.year >= yearRangeProps.yearRange[0] && item.year <= yearRangeProps.yearRange[1])
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, Object.fromEntries(countries.map(c => [c, 0])))
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[item.country]++
      })

    // Convert to array format
    const formattedData = []
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(countries.map(c => [c, 0])))
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
          filename={`mortality-by-country-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title="Right Whale Mortalities by Country"
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>
      
      <div ref={chartRef} className='h-[700px] w-full'>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Right Whale Mortalities by Country</h2>
          <p className="text-sm text-gray-600 mb-4">
            Data from {yearRangeProps.yearRange[0]} to {yearRangeProps.yearRange[1]}
          </p>
        </div>
        <div className="h-[600px]">
          <DataChart data={chartData} stacked={true} />
        </div>
      </div>
    </div>
  )
}
