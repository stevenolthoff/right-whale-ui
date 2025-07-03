'use client'

import React, { useRef, useState, useMemo, useCallback } from 'react'
import { usePaginatedWhaleInjuryData } from '@/app/hooks/usePaginatedWhaleInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

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

export default function InjuryTimeframePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = usePaginatedWhaleInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    data,
    undefined,
    1980
  )

  const [isSideBySide, setIsSideBySide] = useState(true)

  const chartData = useMemo(() => {
    if (!data.length) return []
    const yearFilteredData = data.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

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
      yearCounts[bin]++
    })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const initialBins: Record<string, number> = {}
      TIMEFRAME_BINS.forEach((b) => (initialBins[b] = 0))
      const row: Record<string, number> & { year: number } = {
        year,
        ...(yearData.get(year) || initialBins),
      }
      // Only include years where the total is > 0 and at least one bin other than 'Unknown' is > 0
      const total = TIMEFRAME_BINS.reduce(
        (sum, bin) => sum + (row[bin] || 0),
        0
      )
      const knownTotal = TIMEFRAME_BINS.filter((b) => b !== 'Unknown').reduce(
        (sum, bin) => sum + (row[bin] || 0),
        0
      )
      if (total > 0 && knownTotal > 0) {
        formattedData.push(row)
      }
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [data, yearRange])

  const handleFilterChange = useCallback((_filters: Set<string>) => {
    // Filter changes are handled by the DataChart component internally
  }, [])

  const totalInjuriesInView = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.values(item).reduce(
          (acc: number, val) => (typeof val === 'number' ? acc + val : acc),
          0
        ) -
        item.year,
      0
    )
  }, [chartData])

  if (loading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <div className='flex justify-center mb-4'>
        <button
          onClick={() => setIsSideBySide(!isSideBySide)}
          className='hidden lg:block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {isSideBySide
            ? 'Switch to Vertical Layout'
            : 'Switch to Side by Side'}
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-slate-50 p-4 rounded-lg'>
        <div className='flex-grow max-w-2xl'>
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
        <ExportChart
          chartRef={chartRef}
          filename={`injury-timeframe-analysis-${yearRange[0]}-${yearRange[1]}.png`}
          title='Right Whale Injury Timeframe Analysis'
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Injury Timeframe Analysis
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRange[0]} to {yearRange[1]} • Total Count:{' '}
            {totalInjuriesInView}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            isSideBySide ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-8 mt-4`}
        >
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Total Injuries by Timeframe
            </h3>
            <DataChart
              data={chartData}
              stacked={true}
              yAxisLabel='Number of Injuries'
              customOrder={TIMEFRAME_BINS}
              onFilterChange={handleFilterChange}
              showTotal={true}
            />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Percentage of Injuries by Timeframe
            </h3>
            <DataChart
              data={chartData}
              stacked={true}
              isPercentChart={true}
              customOrder={TIMEFRAME_BINS}
              onFilterChange={handleFilterChange}
              showTotal={true}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
    </div>
  )
}
