'use client'
import React, { useRef } from 'react'
import { usePopulationData } from '@/app/hooks/usePopulationData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { usePopulationYearRange } from '@/app/hooks/usePopulationYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

export default function Population() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = usePopulationData()
  const yearRangeProps = usePopulationYearRange(data)

  const chartData = (() => {
    if (!data) return []

    return data
      .filter(
        (item) =>
          item.year >= yearRangeProps.yearRange[0] &&
          item.year <= yearRangeProps.yearRange[1]
      )
      .map((item) => ({
        year: item.year,
        total: item.estimate,
      }))
  })()

  return (
    <ChartLayout
      title='North Atlantic Right Whale Population Estimates'
      chartRef={chartRef}
      exportFilename={`population-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      description='Data represents estimated population of North Atlantic Right Whales over time. Click and drag on the chart to zoom into specific periods.'
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
        yAxisLabel='Population Estimate'
        showTotal={false}
      />
    </ChartLayout>
  )
}
