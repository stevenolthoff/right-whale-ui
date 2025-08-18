'use client'

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react'
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
  Table as TanstackTable,
} from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'
import InjuryDetailsPopup from '@/app/components/injury/InjuryDetailsPopup'

type ProcessedWhaleInjury = WhaleInjury & { gearBin: string }

const columnHelper = createColumnHelper<ProcessedWhaleInjury>()

const GEAR_BINS_ORDER = ['No Gear', 'Gear Not Retrieved', 'Gear Retrieved']

const getGearBin = (item: WhaleInjury): string => {
  if (item.InjuryAccountDescription === 'Gear') {
    return item.GearRetrieved === 'Y' ? 'Gear Retrieved' : 'Gear Not Retrieved'
  }
  if (item.InjuryAccountDescription === 'No Gear') {
    return 'No Gear'
  }
  return 'Unknown'
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

  const processedData = useMemo(() => {
    return entanglementData.map((item) => ({
      ...item,
      gearBin: getGearBin(item),
    }))
  }, [entanglementData])

  const yearRangeProps = useYearRange(
    loading ? null : entanglementData,
    undefined,
    1980
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(
    null
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => {
          const egNo = info.getValue()
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
      columnHelper.accessor('gearBin', {
        header: 'Gear Status',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Severity',
        filterFn: 'arrIncludesSome',
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
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Description',
        filterFn: 'arrIncludesSome',
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
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('GearComplexityDescription', {
        header: 'Gear Complexity',
        cell: (info) => info.getValue() || 'N/A',
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
    data: processedData,
    columns,
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
    table.getColumn('DetectionDate')?.setFilterValue(yearRangeProps.yearRange)
  }, [yearRangeProps.yearRange, table])

  const tableFilteredData = useMemo(
    () => table.getFilteredRowModel().rows.map((row) => row.original),
    [table.getFilteredRowModel().rows]
  )

  const chartData = useMemo(() => {
    const yearData = new Map<number, Record<string, number>>()
    tableFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const bin = item.gearBin
      if (!bin || bin === 'Unknown') return

      if (!yearData.has(year)) {
        const initialBins: Record<string, number> = {}
        GEAR_BINS_ORDER.forEach((b) => (initialBins[b] = 0))
        yearData.set(year, initialBins)
      }
      yearData.get(year)![bin]++
    })

    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      const initialBins: Record<string, number> = {}
      GEAR_BINS_ORDER.forEach((b) => (initialBins[b] = 0))
      formattedData.push({
        year,
        ...(yearData.get(year) || initialBins),
      })
    }
    return formattedData.sort((a, b) => a.year - b.year)
  }, [tableFilteredData, yearRangeProps.yearRange])

  const handleHiddenSeriesChange = useCallback(
    (hidden: Set<string>) => {
      const column = table.getColumn('gearBin')
      if (!column) return
      const visibleValues = GEAR_BINS_ORDER.filter((bin) => !hidden.has(bin))
      if (
        visibleValues.length === 0 ||
        visibleValues.length === GEAR_BINS_ORDER.length
      ) {
        column.setFilterValue(undefined)
      } else {
        column.setFilterValue(visibleValues)
      }
    },
    [table]
  )

  const gearBinColumnFilter = columnFilters.find(
    (f) => f.id === 'gearBin'
  )?.value as string[] | undefined

  const hiddenSeries = useMemo(() => {
    if (!gearBinColumnFilter || gearBinColumnFilter.length === 0) {
      return new Set<string>()
    }
    return new Set(
      GEAR_BINS_ORDER.filter((bin) => !gearBinColumnFilter.includes(bin))
    )
  }, [gearBinColumnFilter])

  const totalCount = useMemo(() => tableFilteredData.length, [
    tableFilteredData,
  ])

  if (loading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-slate-50 p-4 rounded-lg'>
        <div className='flex-grow max-w-2xl'>
          <label className='block text-sm font-medium text-slate-600 mb-2'>
            Select Year Range
          </label>
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart
          chartRef={chartRef}
          filename={`entanglement-gear-status-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Entanglement by Gear Status'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4 rounded-lg'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Entanglement by Gear Status
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRangeProps.yearRange[0]} to{' '}
            {yearRangeProps.yearRange[1]} • Total Count: {totalCount}
          </p>
        </div>
        <div className='h-[500px] mt-4'>
          <DataChart
            data={chartData}
            stackId='gear'
            stacked={true}
            yAxisLabel='Number of Entanglements'
            customOrder={GEAR_BINS_ORDER}
            showTotal={false}
            hiddenSeries={hiddenSeries}
            onHiddenSeriesChange={handleHiddenSeriesChange}
          />
        </div>
        <ChartAttribution />
      </div>

      <div className='mt-8'>
        <InjuryDownloadButton
          table={table as unknown as TanstackTable<WhaleInjury>}
          filename={`entanglement-by-gear-data-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table as unknown as TanstackTable<WhaleInjury>}
          data={processedData}
          yearRange={yearRangeProps.yearRange}
          setYearRange={yearRangeProps.setYearRange}
          minYear={yearRangeProps.minYear}
          maxYear={yearRangeProps.maxYear}
          defaultStartYear={yearRangeProps.minYear}
        />
        <div className='mt-4'>
          <InjuryTable table={table as unknown as TanstackTable<WhaleInjury>} />
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
