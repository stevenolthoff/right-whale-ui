'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
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

const Entanglement = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()

  const entanglementData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Entanglement'
    )
  }, [allData])

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    entanglementData,
    undefined, // The data is already filtered
    1980
  )

  const chartData = (() => {
    if (!entanglementData) return []

    const yearData = new Map<number, Record<string, number>>()

    entanglementData
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return year >= yearRange[0] && year <= yearRange[1]
      })
      .forEach((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        const gearType = item.InjuryAccountDescription

        if (!yearData.has(year)) {
          yearData.set(year, {
            Gear: 0,
            'No Gear': 0,
          })
        }
        const counts = yearData.get(year)!
        counts[gearType] = (counts[gearType] || 0) + 1
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        Gear: yearData.get(year)?.['Gear'] || 0,
        'No Gear': yearData.get(year)?.['No Gear'] || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalEntanglements = chartData.reduce(
    (sum, item) => sum + item['Gear'] + item['No Gear'],
    0
  )

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
    data: entanglementData || [],
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

  return (
    <div className='space-y-6'>
      <ChartLayout
        title='Right Whale Entanglement by Gear Type'
        chartRef={chartRef}
        exportFilename={`entanglement-gear-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalEntanglements}
        loading={loading}
        error={error || undefined}
        description='Data represents entanglement cases of North Atlantic Right Whales, categorized by presence of fishing gear. Click and drag on the chart to zoom into specific periods.'
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
          yAxisLabel='Number of Entanglements'
        />
      </ChartLayout>
      <div className='mt-8'>
        <InjuryTableFilters
          table={table}
          data={entanglementData || []}
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

export default Entanglement
