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

// Constant for bin order in the chart, bottom to top
const AGE_CLASS_ORDER = ['C', 'J', 'A', 'Unknown']

const mapAgeClassToAbbreviation = (ageClass: string | null): string => {
  if (!ageClass) return 'Unknown'
  const trimmedAgeClass = ageClass.trim().toLowerCase()
  switch (trimmedAgeClass) {
    case 'calf':
      return 'C'
    case 'juvenile':
      return 'J'
    case 'adult':
      return 'A'
    default:
      return 'Unknown'
  }
}

export default function VesselStrikeByAgePage() {
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
      const ageClass = mapAgeClassToAbbreviation(item.InjuryAgeClass)

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
  }, [vesselStrikeData, yearRange])

  const totalVesselStrikesInView = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.entries(item)
          .filter(([key]) => key !== 'year' && !hiddenSeries.has(key))
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
    () => [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => {
          const egNo = info.getValue()
          if (!egNo) return null

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
          filename={`vessel-strike-age-class-${yearRange[0]}-${yearRange[1]}.png`}
          title='Right Whale Vessel Strike by Age Class'
          caption={`Data from ${yearRange[0]} to ${yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Vessel Strike by Age Class
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
              Total Vessel Strikes by Age Class
            </h3>
            <DataChart
              data={chartData}
              stackId='total'
              stacked={true}
              yAxisLabel='Number of Vessel Strikes'
              customOrder={AGE_CLASS_ORDER}
              showTotal={true}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={setHiddenSeries}
            />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-center mb-2'>
              Percentage of Vessel Strikes by Age Class
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
      <div className='mt-8'>
        <InjuryDownloadButton
          table={table}
          filename={`vessel-strike-by-age-data-${yearRange[0]}-${yearRange[1]}.csv`}
        />
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
      <InjuryDetailsPopup
        injuryData={selectedInjury}
        isOpen={selectedInjury !== null}
        onClose={() => setSelectedInjury(null)}
        context='vessel-strike'
      />
    </div>
  )
} 
