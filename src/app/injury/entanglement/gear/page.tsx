'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import { WhaleInjury } from '@/app/types/whaleInjury'
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

const columnHelper = createColumnHelper<WhaleInjury>()

const GEAR_BINS_ORDER = ['No Gear', 'Gear Not Retrieved', 'Gear Retrieved']

const getGearBin = (item: WhaleInjury) => {
  if (item.InjuryAccountDescription === 'Gear') {
    return item.GearRetrieved === 'Y' ? 'Gear Retrieved' : 'Gear Not Retrieved'
  }
  if (item.InjuryAccountDescription === 'No Gear') {
    return 'No Gear'
  }
  return null
}

export default function EntanglementByGearPage() {
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
    undefined,
    1980
  )

  const chartData = useMemo(() => {
    if (!entanglementData.length) return []
    const yearFilteredData = entanglementData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

    const yearData = new Map<number, Record<string, number>>()

    yearFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const bin = getGearBin(item)

      if (!bin) return

      if (!yearData.has(year)) {
        const initialBins: Record<string, number> = {}
        GEAR_BINS_ORDER.forEach((b) => (initialBins[b] = 0))
        yearData.set(year, initialBins)
      }
      const yearCounts = yearData.get(year)!
      yearCounts[bin]++
    })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const initialBins: Record<string, number> = {}
      GEAR_BINS_ORDER.forEach((b) => (initialBins[b] = 0))
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
        title='Entanglement by Gear Status'
        chartRef={chartRef}
        exportFilename={`entanglement-gear-status-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalEntanglementsInView}
        loading={loading}
        error={error || undefined}
        description='Data represents entanglement cases of North Atlantic Right Whales, categorized by presence of fishing gear and whether it was retrieved.'
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
          stackId='gear'
          stacked={true}
          yAxisLabel='Number of Entanglements'
          customOrder={GEAR_BINS_ORDER}
          showTotal={false}
        />
      </ChartLayout>
      <InjuryTableFilters
        table={table}
        data={entanglementData || []}
        yearRange={yearRange}
        setYearRange={setYearRange}
        minYear={minYear}
        maxYear={maxYear}
      />
      <InjuryTable table={table} />
    </div>
  )
} 
