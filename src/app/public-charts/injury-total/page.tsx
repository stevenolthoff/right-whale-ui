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

    // Create a map to store counts by year and type
    const yearTypeMap = new Map<string, number>()
    const types = new Set<string>()

    // Filter and count data
    data
      .filter(
        (item) =>
          item.year >= yearRangeProps.yearRange[0] &&
          item.year <= yearRangeProps.yearRange[1]
      )
      .forEach((item) => {
        const key = `${item.year}-${item.type}`
        yearTypeMap.set(key, (yearTypeMap.get(key) || 0) + 1)
        types.add(item.type)
      })

    // Format data for stacked chart
    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      const dataPoint: any = { year }
      types.forEach((type) => {
        dataPoint[type] = yearTypeMap.get(`${year}-${type}`) || 0
      })
      formattedData.push(dataPoint)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalInjuries = chartData.reduce((sum, yearData) => {
    // Sum all values except the year property
    const yearTotal = Object.entries(yearData)
      .filter(([key]) => key !== 'year')
      .reduce((yearSum, [_, count]) => yearSum + (count as number), 0)
    return sum + yearTotal
  }, 0)

  return (
    <ChartLayout
      title='Right Whale Injury Events'
      chartRef={chartRef}
      exportFilename={`injury-total-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalInjuries}
      loading={loading}
      error={error || undefined}
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
        stacked={true}
        yAxisLabel='Number of Injuries'
      />
    </ChartLayout>
  )
}
