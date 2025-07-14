'use client'

import React, { useRef, useState, useMemo } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

// Constant for bin order in the chart, bottom to top
const AGE_CLASS_ORDER = ['C', 'J', 'A', 'Unknown']

export default function EntanglementByAgePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const entanglementData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Entanglement'
    )
  }, [allData])

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    entanglementData,
    undefined,
    1980
  )

  const [isSideBySide, setIsSideBySide] = useState(true)

  const chartData = useMemo(() => {
    if (!entanglementData.length) return []
    const yearFilteredData = entanglementData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

    const yearData = new Map<number, Record<string, number>>()

    yearFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      let ageClass = item.InjuryAgeClass || 'Unknown'
      if (!AGE_CLASS_ORDER.includes(ageClass)) {
        ageClass = 'Unknown'
      }

      if (!yearData.has(year)) {
        const initialBins: Record<string, number> = {}
        AGE_CLASS_ORDER.forEach((b) => (initialBins[b] = 0))
        yearData.set(year, initialBins)
      }
      const yearCounts = yearData.get(year)!
      yearCounts[ageClass]++
    })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const initialBins: Record<string, number> = {}
      AGE_CLASS_ORDER.forEach((b) => (initialBins[b] = 0))
      const row: Record<string, number> & { year: number } = {
        year,
        ...(yearData.get(year) || initialBins),
      }
      formattedData.push(row)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [entanglementData, yearRange])

  const totalEntanglementsInView = useMemo(() => {
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
          filename={`entanglement-age-class-${yearRange[0]}-${yearRange[1]}.png`}
          title='Right Whale Entanglement by Age Class'
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Entanglement by Age Class
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRange[0]} to {yearRange[1]} • Total Count:{' '}
            {totalEntanglementsInView}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            isSideBySide ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-8 mt-4`}
        >
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Total Entanglements by Age Class
            </h3>
            <DataChart
              data={chartData}
              stackId='total'
              stacked={true}
              yAxisLabel='Number of Entanglements'
              customOrder={AGE_CLASS_ORDER}
              showTotal={true}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={setHiddenSeries}
            />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Percentage of Entanglements by Age Class
            </h3>
            <DataChart
              data={chartData}
              stackId='percentage'
              stacked={true}
              isPercentChart={true}
              customOrder={AGE_CLASS_ORDER}
              showTotal={true}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={setHiddenSeries}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
    </div>
  )
} 
