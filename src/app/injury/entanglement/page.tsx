'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import { InjuryTable } from '@/app/components/injury/InjuryTable'
import { InjuryTableFilters } from '@/app/components/injury/InjuryTableFilters'
import { InjuryDownloadButton } from '@/app/components/injury/InjuryDownloadButton'
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
import { WhaleInjury } from '@/app/types/whaleInjury'

import InjuryDetailsPopup from '@/app/components/injury/InjuryDetailsPopup'

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

  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => {
          const egNo = info.getValue() as string
          if (!egNo) return 'N/A'

          const isFourDigit = /^\d{4}$/.test(egNo)

          if (isFourDigit) {
            return (
              <a
                href={`https://rwcatalog.neaq.org/#/whales/${egNo}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md'
              >
                {egNo}
              </a>
            )
          }

          return <span>{egNo}</span>
        },
        filterFn: 'includesString',
      }),
      columnHelper.accessor((row) => row.CaseId ?? row.InjuryId, {
        id: 'caseId',
        header: 'Injury/Case ID',
        cell: (info) => (
          <button
            onClick={() => setSelectedInjury(info.row.original)}
            className='text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md'
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Description',
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Injury Severity',
        cell: (info) => info.getValue() || 'N/A',
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
      columnHelper.accessor('InjuryTimeFrame', {
        header: 'Timeframe',
        cell: (info) => info.getValue() || 'N/A',
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
        <InjuryDownloadButton
          table={table}
          filename={`entanglement-data-${yearRange[0]}-${yearRange[1]}.csv`}
        />
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
      <InjuryDetailsPopup
        injuryData={selectedInjury}
        isOpen={selectedInjury !== null}
        onClose={() => setSelectedInjury(null)}
        context='entanglement'
      />
    </div>
  )
}

export default Entanglement
