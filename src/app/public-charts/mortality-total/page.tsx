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

    // Create a map to store year -> cause of death -> count
    const yearData = new Map<number, Map<string, number>>()

    // Filter and group the data
    data
      .filter(
        (item) =>
          item.year >= yearRangeProps.yearRange[0] &&
          item.year <= yearRangeProps.yearRange[1]
      )
      .forEach((item) => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, new Map())
        }
        const causeMap = yearData.get(item.year)!
        causeMap.set(
          item.causeOfDeath,
          (causeMap.get(item.causeOfDeath) || 0) + 1
        )
      })

    // Convert to the format needed for the stacked chart
    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      const entry: any = { year }
      const causeCounts = yearData.get(year) || new Map()

      // Add all causes of death, defaulting to 0 if not present
      ;(
        [
          'Vessel Strike',
          'Entanglement',
          'Neonate',
          'Unknown',
          'Other',
        ] as const
      ).forEach((cause) => {
        entry[cause] = causeCounts.get(cause) || 0
      })

      formattedData.push(entry)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalMortalities = chartData.reduce((sum, item) => {
    return (
      sum +
      Object.entries(item)
        .filter(([key]) => key !== 'year')
        .reduce((yearSum, [, count]) => yearSum + (count as number), 0)
    )
  }, 0)

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
        stacked={true}
        yAxisLabel='Number of Mortalities'
      />
    </ChartLayout>
  )
}
