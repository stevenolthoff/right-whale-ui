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
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<WhaleInjury>()

export default function UnknownOtherInjuriesPage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()

  // Filter for injuries that are NOT Entanglement or Vessel Strike
  const unknownOtherData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item: WhaleInjury) =>
        item.InjuryTypeDescription !== 'Entanglement' &&
        item.InjuryTypeDescription !== 'Vessel Strike'
    )
  }, [allData])

  // Use the year range hook with a default start of 1980
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    unknownOtherData,
    undefined,
    1980
  )

  const chartData = useMemo(() => {
    if (!unknownOtherData.length) return []

    const yearFilteredData = unknownOtherData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

    const yearCounts = new Map<number, number>()
    yearFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
    })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [unknownOtherData, yearRange])

  const totalInjuriesInView = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0)
  }, [chartData])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('InjuryTypeDescription', {
        header: 'Injury Type',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Account',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Severity',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('DetectionDate', {
        header: 'Detection Year',
        cell: (info) => new Date(info.getValue()).getFullYear(),
        filterFn: (row, id, value) => {
          if (!value) return true
          const year = new Date(row.getValue(id)).getFullYear()
          const [min, max] = value as [number, number]
          return year >= min && year <= max
        },
      }),
      columnHelper.accessor('InjuryAge', {
        header: 'Age',
        filterFn: (row, id, value) => {
          if (!value) return true
          const ageValue = row.getValue(id) as string | null
          const age = ageValue ? parseInt(ageValue, 10) : null
          if (age === null || isNaN(age)) return false
          const [min, max] = value as [number, number]
          return age >= min && age <= max
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
      columnHelper.accessor('Cow', {
        header: 'Reproductive Female',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        filterFn: (row, id, value) => {
          const rowValue = row.getValue(id) ? 'Yes' : 'No'
          return rowValue === value
        },
      }),
      columnHelper.accessor('UnusualMortalityEventDescription', {
        header: 'UME Status',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('CountryOriginDescription', {
        header: 'Injury Country Origin',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('GearOriginDescription', {
        header: 'Gear Origin',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('GearComplexityDescription', {
        header: 'Gear Complexity',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('ConstrictingWrap', {
        header: 'Constricting Wrap',
        cell: (info) =>
          info.getValue() === 'Y'
            ? 'Yes'
            : info.getValue() === 'N'
            ? 'No'
            : 'Unknown',
        filterFn: (row, id, value) => {
          const val = row.getValue(id)
          const strVal = val === 'Y' ? 'Yes' : val === 'N' ? 'No' : 'Unknown'
          return strVal === value
        },
      }),
      columnHelper.accessor('Disentangled', {
        header: 'Disentangled',
        cell: (info) =>
          info.getValue() === 'Y'
            ? 'Yes'
            : info.getValue() === 'N'
            ? 'No'
            : 'Unknown',
        filterFn: (row, id, value) => {
          const val = row.getValue(id)
          const strVal = val === 'Y' ? 'Yes' : val === 'N' ? 'No' : 'Unknown'
          return strVal === value
        },
      }),
      columnHelper.accessor('GearRetrieved', {
        header: 'Gear Retrieved',
        cell: (info) =>
          info.getValue() === 'Y'
            ? 'Yes'
            : info.getValue() === 'N'
            ? 'No'
            : 'Unknown',
        filterFn: (row, id, value) => {
          const val = row.getValue(id)
          const strVal = val === 'Y' ? 'Yes' : val === 'N' ? 'No' : 'Unknown'
          return strVal === value
        },
      }),
      columnHelper.accessor('InjuryTimeFrame', {
        header: 'Timeframe (days)',
        filterFn: (row, id, value) => {
          if (!value) return true
          const timeframe = row.getValue(id) as number | null
          if (timeframe === null || timeframe === undefined) return false
          const [min, max] = value as [number, number]
          return timeframe >= min && timeframe <= max
        },
      }),
      columnHelper.accessor('LastSightedAliveDate', {
        header: 'Last Sighted Alive Year',
        cell: (info) =>
          info.getValue() ? new Date(info.getValue()).getFullYear() : 'N/A',
        filterFn: (row, id, value) => {
          if (!value) return true
          const dateVal = row.getValue(id) as string | null
          if (!dateVal) return false
          const year = new Date(dateVal).getFullYear()
          const [min, max] = value as [number, number]
          return year >= min && year <= max
        },
      }),
      columnHelper.accessor('IsDead', {
        header: 'Is Dead from Injury',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        filterFn: (row, id, value) => {
          const rowValue = row.getValue(id) ? 'Yes' : 'No'
          return rowValue === value
        },
      }),
      columnHelper.accessor('DeathCauseDescription', {
        header: 'Cause of Death',
        filterFn: 'equalsString',
      }),
    ],
    []
  )

  const table = useReactTable({
    data: unknownOtherData || [],
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
        title='Unknown/Other Injuries'
        chartRef={chartRef}
        exportFilename={`unknown-other-injuries-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalInjuriesInView}
        loading={loading}
        error={error || undefined}
        description='Data represents injuries from unknown or other causes (not classified as Entanglement or Vessel Strike).'
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
          stacked={false}
          yAxisLabel='Number of Injuries'
        />
      </ChartLayout>
      <InjuryTableFilters
        table={table}
        data={unknownOtherData || []}
        yearRange={yearRange}
        setYearRange={setYearRange}
        minYear={minYear}
        maxYear={maxYear}
      />
      <InjuryTable table={table} />
    </div>
  )
} 
