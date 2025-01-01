'use client'
import React, { useRef } from 'react'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

export default function MortalityByCountry() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(
    loading ? null : data,
    item => item.country === 'US' || item.country === 'CA'
  )

  const chartData = (() => {
    if (!data) return []

    const countries = Array.from(new Set(data.map(item => item.country)))
      .sort((a, b) => a.localeCompare(b))

    const yearData = new Map<number, Record<string, number>>()
    
    data
      .filter(item => item.year >= yearRangeProps.yearRange[0] && item.year <= yearRangeProps.yearRange[1])
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, Object.fromEntries(countries.map(c => [c, 0])))
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[item.country]++
      })

    const formattedData = []
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(countries.map(c => [c, 0])))
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalMortalities = chartData.reduce((sum, item) => 
    sum + Object.values(item).reduce((a, b) => typeof b === 'number' ? a + b : a, 0) - item.year
  , 0)

  return (
    <ChartLayout
      title="Right Whale Mortalities by Country"
      chartRef={chartRef}
      exportFilename={`mortality-by-country-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalMortalities}
      loading={loading}
      error={error}
      description="Data represents confirmed mortalities of North Atlantic Right Whales by country. Click and drag on the chart to zoom into specific periods."
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
        stacked={true}
        yAxisLabel="Number of Mortalities"
      />
    </ChartLayout>
  )
}
