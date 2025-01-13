'use client'
import React, { useRef } from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useInjuryYearRange } from '@/app/hooks/useInjuryYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

export default function InjuryTotal() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useInjuryData()
  const yearRangeProps = useInjuryYearRange(data)

  const chartData = (() => {
    if (!data) return []

    const yearCounts = new Map<number, number>()

    data
      .filter(
        (item) =>
          item.year >= yearRangeProps.yearRange[0] &&
          item.year <= yearRangeProps.yearRange[1]
      )
      .forEach((item) => {
        yearCounts.set(item.year, (yearCounts.get(item.year) || 0) + 1)
      })

    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalInjuries = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <ChartLayout
      title='Right Whale Injury Events'
      chartRef={chartRef}
      exportFilename={`injury-total-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalInjuries}
      loading={loading}
      error={error}
      description='Data represents confirmed injury events of North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods.'
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
        yAxisLabel='Number of Injuries'
      />
    </ChartLayout>
  )
}
