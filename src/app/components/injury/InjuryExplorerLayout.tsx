'use client'

import React, { useMemo, useRef, useState } from 'react'
import { ColumnDef, Table as TanstackTable } from '@tanstack/react-table'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { useInjuryTable } from '@/app/hooks/useInjuryTable'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import { DataChart } from '@/app/components/monitoring/DataChart'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { InjuryDownloadButton } from './InjuryDownloadButton'
import { InjuryTableFilters } from './InjuryTableFilters'
import { InjuryTable } from './InjuryTable'
import InjuryDetailsPopup from './InjuryDetailsPopup'

interface ChartConfig {
  title: string
  stackId: string
  isPercentChart?: boolean
}

interface InjuryExplorerLayoutProps<T extends WhaleInjury> {
  pageTitle: string
  initialDataFilter: (item: WhaleInjury) => boolean
  dataProcessor: (data: WhaleInjury[]) => T[]
  tableColumns: (setSelectedInjury: (injury: WhaleInjury | null) => void) => ColumnDef<T, any>[]
  chartConfigs: ChartConfig[]
  chartDataTransformer: (data: T[]) => Record<string, any>[]
  chartFilterColumnId: string
  chartFilterColumnValues: readonly string[]
  popupContext: 'entanglement' | 'vessel-strike' | 'unknown-other' | 'total'
}

export default function InjuryExplorerLayout<T extends WhaleInjury>({
  pageTitle,
  initialDataFilter,
  dataProcessor,
  tableColumns,
  chartConfigs,
  chartDataTransformer,
  chartFilterColumnId,
  chartFilterColumnValues,
  popupContext,
}: InjuryExplorerLayoutProps<T>) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isSideBySide, setIsSideBySide] = useState(true)

  const { data: allData, loading, error } = useWhaleInjuryDataStore()

  const processedData = useMemo(() => {
    if (!allData) return []
    return dataProcessor(allData.filter(initialDataFilter))
  }, [allData, initialDataFilter, dataProcessor])

  const {
    table,
    tableFilteredData,
    yearRangeProps,
    selectedInjury,
    setSelectedInjury,
    hiddenSeries,
    handleHiddenSeriesChange,
    totalCountInView,
  } = useInjuryTable({
    initialData: processedData,
    columns: tableColumns(setSelectedInjury),
    chartFilterColumnId,
    chartFilterColumnValues,
  })

  const chartData = useMemo(
    () => chartDataTransformer(tableFilteredData),
    [tableFilteredData, chartDataTransformer]
  )

  if (loading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  const hasMultipleCharts = chartConfigs.length > 1

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
          <YearRangeSlider {...yearRangeProps} onChange={yearRangeProps.setYearRange} />
        </div>
        <ExportChart
          chartRef={chartRef}
          filename={`${popupContext}-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title={pageTitle}
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>{pageTitle}</h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRangeProps.yearRange[0]} to {yearRangeProps.yearRange[1]} • Total Count:{' '}
            {totalCountInView}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            hasMultipleCharts && isSideBySide
              ? 'lg:grid-cols-2'
              : 'lg:grid-cols-1'
          } gap-8 mt-4`}
        >
          {chartConfigs.map((config) => (
            <div key={config.title}>
              <h3 className='text-lg font-semibold text-center mb-2'>
                {config.title}
              </h3>
              <DataChart
                data={chartData}
                yAxisLabel='Number of Events'
                customOrder={chartFilterColumnValues}
                showTotal={false}
                stacked={true}
                {...config}
                hiddenSeries={hiddenSeries}
                onHiddenSeriesChange={handleHiddenSeriesChange}
              />
            </div>
          ))}
        </div>
        <ChartAttribution />
      </div>

      <div className='mt-8'>
        <InjuryDownloadButton
          table={table as TanstackTable<WhaleInjury>}
          filename={`${popupContext}-data-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table as TanstackTable<WhaleInjury>}
          data={processedData}
          {...yearRangeProps}
          setYearRange={yearRangeProps.setYearRange}
        />
        <div className='mt-4'>
          <InjuryTable table={table as TanstackTable<WhaleInjury>} />
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
