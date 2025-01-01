'use client'
import React, { useRef } from 'react'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

export default function Calving() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(data)

  const chartData = (() => {
    if (!data) return []
    
    const yearCounts = new Map<number, number>()
    
    data
      .filter(item => item.year >= yearRangeProps.yearRange[0] && item.year <= yearRangeProps.yearRange[1])
      .forEach(item => {
        yearCounts.set(item.year, (yearCounts.get(item.year) || 0) + 1)
      })

    const formattedData = []
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalCalvings = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <ChartLayout
      title="Right Whale Calving Events"
      chartRef={chartRef}
      exportFilename={`calving-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalCalvings}
      loading={loading}
      error={error}
      description="Data represents confirmed calving events of North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods."
      controls={
        <>
          <label className='block text-sm font-medium text-slate-600 mb-2'>
            Select Year Range
          </label>
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </>
      }
    >
      <DataChart 
        data={chartData} 
        stacked={false}
        yAxisLabel="Number of Calving Events"
      />
    </ChartLayout>
  )
}
