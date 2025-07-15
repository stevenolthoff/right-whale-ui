'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import { InjuryTable } from '@/app/components/injury/InjuryTable'
import { InjuryTableFilters } from '@/app/components/injury/InjuryTableFilters'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  Row,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'

const columnHelper = createColumnHelper<WhaleInjury>()

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

export default function VesselStrikeTimeframePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const vesselStrikeData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Vessel Strike'
    )
  }, [allData])

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    vesselStrikeData,
    undefined,
    1980
  )

  const [isSideBySide, setIsSideBySide] = useState(true)

  const chartData = useMemo(() => {
    if (!vesselStrikeData.length) return []
    const yearFilteredData = vesselStrikeData.filter((item) => {
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
  }, [vesselStrikeData, yearRange])

  const totalVesselStrikesInView = useMemo(() => {
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

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('EGNo', { header: 'EG No' }),
      columnHelper.accessor('InjuryTypeDescription', {
        header: 'Injury Type',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Severity',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('DetectionDate', {
        header: 'Detection Year',
        cell: (info) => new Date(info.getValue()).getFullYear(),
        filterFn: (
          row: Row<WhaleInjury>,
          columnId: string,
          value: [number, number]
        ) => {
          if (!value) return true
          const year = new Date(row.getValue(columnId)).getFullYear()
          const [min, max] = value
          return year >= min && year <= max
        },
      }),
      columnHelper.accessor('InjuryAgeClass', {
        header: 'Age Class',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('GenderDescription', {
        header: 'Sex',
        filterFn: 'equalsString',
      }),
    ],
    []
  )

  const table = useReactTable({
    data: vesselStrikeData || [],
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
    autoResetPageIndex: false,
  })

  useEffect(() => {
    table.getColumn('DetectionDate')?.setFilterValue(yearRange)
  }, [yearRange, table])

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
          filename={`vessel-strike-timeframe-analysis-${yearRange[0]}-${yearRange[1]}.png`}
          title='Right Whale Vessel Strike Timeframe Analysis'
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Vessel Strike Timeframe Analysis
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRange[0]} to {yearRange[1]} • Total Count:{' '}
            {totalVesselStrikesInView}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            isSideBySide ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-8 mt-4`}
        >
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Total Vessel Strikes by Timeframe
            </h3>
            <DataChart
              data={chartData}
              stackId='total'
              stacked={true}
              yAxisLabel='Number of Vessel Strikes'
              customOrder={TIMEFRAME_BINS}
              showTotal={true}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={setHiddenSeries}
            />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Percentage of Vessel Strikes by Timeframe
            </h3>
            <DataChart
              data={chartData}
              stackId='percentage'
              stacked={true}
              isPercentChart={true}
              customOrder={TIMEFRAME_BINS}
              showTotal={true}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={setHiddenSeries}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
      <div className='mt-8'>
        <InjuryTableFilters
          table={table}
          data={vesselStrikeData || []}
          yearRange={yearRange}
          setYearRange={setYearRange}
          minYear={minYear}
          maxYear={maxYear}
        />
        <div className='mt-4'>
          <InjuryTable table={table} />
        </div>
      </div>
    </div>
  )
}
