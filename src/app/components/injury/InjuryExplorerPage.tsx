'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import { InjuryTable } from '@/app/components/injury/InjuryTable'
import { InjuryTableFilters } from '@/app/components/injury/InjuryTableFilters'
import { InjuryDownloadButton } from '@/app/components/injury/InjuryDownloadButton'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'
import InjuryDetailsPopup from '@/app/components/injury/InjuryDetailsPopup'
import { useInjuryYearRangeStore } from '@/app/stores/useInjuryYearRangeStore'

type ChartConfig = {
  title: string
  stackId?: string
  stacked?: boolean
  yAxisLabel?: string
  customOrder?: string[]
  isPercentChart?: boolean
  showTotal?: boolean
}

interface InjuryExplorerPageProps {
  pageTitle: string
  injuryFilter: (item: WhaleInjury) => boolean
  chartDataProcessor: (
    data: WhaleInjury[],
    yearRange: [number, number]
  ) => Record<string, any>[]
  charts: ChartConfig[]
  tableColumns: (
    setSelectedInjury: (injury: WhaleInjury | null) => void
  ) => any[]
  popupContext: 'entanglement' | 'vessel-strike' | 'unknown-other' | 'total'
  defaultSideBySide?: boolean
}

export default function InjuryExplorerPage({
  pageTitle,
  injuryFilter,
  chartDataProcessor,
  charts,
  tableColumns: getTableColumns,
  popupContext,
  defaultSideBySide = true,
}: InjuryExplorerPageProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()
  const { yearRange, setYearRange, minYear, maxYear, setMinMaxYears } =
    useInjuryYearRangeStore()

  const [isSideBySide, setIsSideBySide] = useState(defaultSideBySide)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const filteredData = useMemo(() => {
    if (!allData) return []
    return allData.filter(injuryFilter)
  }, [allData, injuryFilter])

  useEffect(() => {
    if (filteredData.length > 0) {
      setMinMaxYears(filteredData)
    }
  }, [filteredData, setMinMaxYears])

  const chartData = useMemo(() => {
    if (!filteredData.length) return []
    return chartDataProcessor(filteredData, yearRange)
  }, [filteredData, yearRange, chartDataProcessor])

  const totalCount = useMemo(() => {
    if (!chartData) return 0
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.entries(item)
          .filter(
            ([key]) =>
              key !== 'year' && key !== 'ageGroup' && !hiddenSeries.has(key)
          )
          .reduce(
            (rowSum, [, value]) =>
              rowSum + (typeof value === 'number' ? value : 0),
            0
          ),
      0
    )
  }, [chartData, hiddenSeries])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

  const columns = useMemo(
    () => getTableColumns(setSelectedInjury),
    [getTableColumns]
  )

  const table = useReactTable({
    data: filteredData || [],
    columns: columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    autoResetPageIndex: false,
  })

  useEffect(() => {
    table.getColumn('DetectionDate')?.setFilterValue(yearRange)
  }, [yearRange, table])

  if (loading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  const hasMultipleCharts = charts.length > 1
  const xAxisKey =
    chartData[0] && 'ageGroup' in chartData[0] ? 'ageGroup' : 'year'

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      {hasMultipleCharts && (
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
      )}

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
          filename={`${popupContext}-analysis-${yearRange[0]}-${yearRange[1]}.png`}
          title={pageTitle}
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>{pageTitle}</h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRange[0]} to {yearRange[1]} • Total Count:{' '}
            {totalCount}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            hasMultipleCharts && isSideBySide
              ? `lg:grid-cols-${charts.length}`
              : 'lg:grid-cols-1'
          } gap-8 mt-4`}
        >
          {charts.map((chartConfig) => (
            <div key={chartConfig.title}>
              <h3 className='text-lg font-semibold text-center mb-2'>
                {chartConfig.title}
              </h3>
              <DataChart
                data={chartData}
                xAxisDataKey={xAxisKey}
                xAxisInterval={xAxisKey === 'ageGroup' ? 0 : 4}
                xAxisTickAngle={xAxisKey === 'ageGroup' ? 0 : -45}
                xAxisTextAnchor={xAxisKey === 'ageGroup' ? 'middle' : 'end'}
                {...chartConfig}
                hiddenSeries={hiddenSeries}
                onHiddenSeriesChange={setHiddenSeries}
              />
            </div>
          ))}
        </div>
        <ChartAttribution />
      </div>

      <div className='mt-8'>
        <InjuryDownloadButton
          table={table}
          filename={`${popupContext}-data-${yearRange[0]}-${yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table}
          data={filteredData || []}
          yearRange={yearRange}
          setYearRange={setYearRange}
          minYear={minYear}
          maxYear={maxYear}
        />
        <div className='mt-4'>
          <InjuryTable table={table} />
        </div>
      </div>
      <InjuryDetailsPopup
        injuryData={selectedInjury}
        isOpen={selectedInjury !== null}
        onClose={() => setSelectedInjury(null)}
        context={popupContext}
      />
    </div>
  )
} 
