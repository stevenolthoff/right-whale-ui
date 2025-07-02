'use client'

import React, { useMemo, useRef } from 'react'
import { usePaginatedWhaleInjuryData } from '@/app/hooks/usePaginatedWhaleInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'


// Helper function to categorize the injury timeframe into bins
const getTimeframeBin = (days: number | null): string => {
  if (days === null || typeof days !== 'number' || isNaN(days)) {
    return 'Unknown'
  }
  if (days < 90) return '<3m'
  if (days <= 180) return '3m-6m'
  if (days <= 365) return '>6m-1yr'
  if (days <= 730) return '>1yr-2yr'
  if (days <= 1095) return '>2yr-3yr'
  return '3+yr'
}

// Constant for bin order in the chart
const TIMEFRAME_BINS = [
  '<3m',
  '3m-6m',
  '>6m-1yr',
  '>1yr-2yr',
  '>2yr-3yr',
  '3+yr',
  'Unknown',
]

const InjuryTimeframeChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = usePaginatedWhaleInjuryData()

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    data,
    undefined, // No pre-filtering needed here
    1980
  )

  const chartData = useMemo(() => {
    if (!data.length) return []

    // 1. Filter data by the selected year range
    const yearFilteredData = data.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

    // 2. Group by year and timeframe bin
    const yearData = new Map<number, Record<string, number>>()

    yearFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const bin = getTimeframeBin(item.InjuryTimeFrame)

      if (!yearData.has(year)) {
        const initialBins: Record<string, number> = {}
        TIMEFRAME_BINS.forEach((b) => (initialBins[b] = 0))
        yearData.set(year, initialBins)
      }

      const yearCounts = yearData.get(year)!
      yearCounts[bin] = (yearCounts[bin] || 0) + 1
    })

    // 3. Format for the chart, ensuring all years in the range are present
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const initialBins: Record<string, number> = {}
      TIMEFRAME_BINS.forEach((b) => (initialBins[b] = 0))
      formattedData.push({
        year,
        ...(yearData.get(year) || initialBins),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [data, yearRange])

  const totalInjuriesInView = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.entries(item)
          .filter(([key]) => key !== 'year')
          .reduce((acc, [, value]) => acc + (value as number), 0),
      0
    )
  }, [chartData])

  return (
    <div className='space-y-4'>
      <ChartLayout
        title='Injury Timeframe Analysis'
        chartRef={chartRef}
        exportFilename={`injury-timeframe-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalInjuriesInView}
        loading={loading} // Only show big loader on initial load
        error={error || undefined}
        description="Injury timeframe is the duration from the last known 'clean' sighting to the first detection of the injury."
        controls={
          <div>
            <label className='block text-sm font-medium text-slate-600 mb-2'>
              Select Year Range
            </label>
            <YearRangeSlider
              yearRange={yearRange}
              minYear={minYear}
              maxYear={maxYear}
              onChange={setYearRange}
            />
          </div>
        }
      >
        <DataChart
          data={chartData}
          stacked={true}
          yAxisLabel='Number of Injuries'
          customOrder={TIMEFRAME_BINS}
        />
      </ChartLayout>
    </div>
  )
}

export default InjuryTimeframeChart
