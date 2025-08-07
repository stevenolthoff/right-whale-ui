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
  ColumnDef,
} from '@tanstack/react-table'

import InjuryDetailsPopup from '@/app/components/injury/InjuryDetailsPopup'

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

  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

  const getTableColumns = (
    setSelectedInjury: (injury: WhaleInjury | null) => void
  ): ColumnDef<WhaleInjury>[] => [
    columnHelper.accessor('EGNo', {
      header: 'EG No',
      cell: (info) => {
        const egNo = info.getValue() as string
        if (!egNo) return null

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
    columnHelper.accessor('CaseId', {
      header: 'Case ID',
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
  ]

  const columns = useMemo(
    () => getTableColumns(setSelectedInjury),
    [setSelectedInjury]
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
      <div className='mt-8'>
        <InjuryDownloadButton
          table={table}
          filename={`entanglement-by-gear-data-${yearRange[0]}-${yearRange[1]}.csv`}
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
