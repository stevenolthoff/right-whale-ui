'use client'
import React, { useRef } from 'react'
import { useInjuryData } from '../../hooks/useInjuryData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useInjuryYearRange } from '../../hooks/useInjuryYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

const VesselStrike = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useInjuryYearRange(
    data,
    (item) => item.type === 'Vessel Strike',
    1980
  )

  const chartData = (() => {
    if (!data) return []

    // Get all unique severity types
    const severityTypes = new Set<string>()
    data
      .filter((item) => item.type === 'Vessel Strike')
      .forEach((item) => {
        if (item.severity) {
          severityTypes.add(item.severity)
        }
      })

    // Create year-by-year data with counts for each severity type
    const yearData = new Map<number, Record<string, number>>()

    data
      .filter(
        (item) =>
          item.type === 'Vessel Strike' &&
          item.year >= yearRange[0] &&
          item.year <= yearRange[1]
      )
      .forEach((item) => {
        if (!yearData.has(item.year)) {
          yearData.set(
            item.year,
            Object.fromEntries([...severityTypes].map((type) => [type, 0]))
          )
        }
        const counts = yearData.get(item.year)!
        if (item.severity) {
          counts[item.severity]++
        }
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) ||
          Object.fromEntries([...severityTypes].map((type) => [type, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalStrikes = chartData.reduce(
    (sum, item) =>
      sum +
      Object.entries(item)
        .filter(([key]) => key !== 'year')
        .reduce((acc, [, value]) => acc + value, 0),
    0
  )

  return (
    <ChartLayout
      title='Right Whale Vessel Strike Analysis'
      chartRef={chartRef}
      exportFilename={`vessel-strike-${yearRange[0]}-${yearRange[1]}.png`}
      yearRange={yearRange}
      totalCount={totalStrikes}
      loading={loading}
      error={error || undefined}
      description='Data represents vessel strike incidents involving North Atlantic Right Whales, categorized by severity. Click and drag on the chart to zoom into specific periods.'
      controls={
        <>
          <label className='block text-sm font-medium text-slate-600 mb-2'>
            Select Year Range
          </label>
          <YearRangeSlider
            yearRange={yearRange}
            minYear={minYear}
            maxYear={maxYear}
            onChange={setYearRange}
          />
        </>
      }
    >
      <DataChart
        data={chartData}
        stacked={true}
        yAxisLabel='Number of Vessel Strikes'
      />
    </ChartLayout>
  )
}

export default VesselStrike
