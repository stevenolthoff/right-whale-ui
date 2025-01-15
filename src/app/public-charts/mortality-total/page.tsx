'use client'
import React, { useRef } from 'react'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

export default function MortalityTotal() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(data)

  const chartData = (() => {
    if (!data) return []

    // Create a map to store total mortalities per year
    const yearTotals = new Map<number, number>()

    // Filter and count total mortalities per year
    data
      .filter(
        (item) =>
          item.year >= yearRangeProps.yearRange[0] &&
          item.year <= yearRangeProps.yearRange[1]
      )
      .forEach((item) => {
        yearTotals.set(item.year, (yearTotals.get(item.year) || 0) + 1)
      })

    // Convert to the format needed for the chart
    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      formattedData.push({
        year,
        total: yearTotals.get(year) || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalMortalities = chartData.reduce((sum, item) => sum + item.total, 0)

  return (
    <ChartLayout
      title='Total Right Whale Mortalities'
      chartRef={chartRef}
      exportFilename={`mortality-total-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalMortalities}
      description='Data represents confirmed mortalities of North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods.'
      loading={loading}
      error={error}
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
        yAxisLabel='Number of Mortalities'
      />
    </ChartLayout>
  )
}
