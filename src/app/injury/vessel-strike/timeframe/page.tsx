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

type ProcessedWhaleInjury = WhaleInjury & { timeframeBin: string }

const columnHelper = createColumnHelper<ProcessedWhaleInjury>()

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
  const [isSideBySide, setIsSideBySide] = useState(true)

  const vesselStrikeData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Vessel Strike'
    )
  }, [allData])

  const processedData = useMemo(() => {
    return vesselStrikeData.map((item) => ({
      ...item,
      timeframeBin: getTimeframeBin(item.InjuryTimeFrame),
    }))
  }, [vesselStrikeData])

  const yearRangeProps = useYearRange(
    loading ? null : vesselStrikeData,
    undefined,
    1980
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

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
      columnHelper.accessor('timeframeBin', {
        header: 'Timeframe',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjuryTimeFrame', {
        header: 'Timeframe (days)',
        cell: (info) => info.getValue() ?? 'N/A',
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
      columnHelper.accessor('InjuryTypeDescription', {
        header: 'Injury Type',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Description',
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Severity',
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('InjuryAge', {
        header: 'Age',
        cell: (info) => info.getValue() || 'N/A',
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
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'arrIncludesSome',
      }),
      columnHelper.accessor('GenderDescription', {
        header: 'Sex',
        cell: (info) => info.getValue() || 'N/A',
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
        cell: (info) => info.getValue() || 'N/A',
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('CountryOriginDescription', {
        header: 'Injury Country Origin',
        cell: (info) => info.getValue() || 'N/A',
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
      columnHelper.accessor('ForensicsCompleted', {
        header: 'Forensics Completed',
        cell: (info) =>
          info.getValue() === 'Y'
            ? 'Yes'
            : info.getValue() === 'N'
            ? 'No'
            : 'Unknown',
        filterFn: (row, id, value) => {
          const val = row.getValue(id) as string
          const strVal = val === 'Y' ? 'Yes' : val === 'N' ? 'No' : 'Unknown'
          return strVal === value
        },
      }),
      columnHelper.accessor('VesselSizeDescription', {
        header: 'Vessel Size',
        filterFn: 'equalsString',
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
        cell: (info) => info.getValue() || 'N/A',
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
      const bin = item.timeframeBin
      if (!yearData.has(year)) {
        const initialBins: Record<string, number> = {}
        TIMEFRAME_BINS.forEach((b) => (initialBins[b] = 0))
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
      TIMEFRAME_BINS.forEach((b) => (initialBins[b] = 0))
      formattedData.push({
        year,
        ...(yearData.get(year) || initialBins),
      })
    }
    return formattedData.sort((a, b) => a.year - b.year)
  }, [tableFilteredData, yearRangeProps.yearRange])

  const handleHiddenSeriesChange = useCallback(
    (hidden: Set<string>) => {
      const column = table.getColumn('timeframeBin')
      if (!column) return
      const visibleValues = TIMEFRAME_BINS.filter((bin) => !hidden.has(bin))
      if (
        visibleValues.length === 0 ||
        visibleValues.length === TIMEFRAME_BINS.length
      ) {
        column.setFilterValue(undefined)
      } else {
        column.setFilterValue(visibleValues)
      }
    },
    [table]
  )

  const timeframeBinColumnFilter = columnFilters.find(
    (f) => f.id === 'timeframeBin'
  )?.value as string[] | undefined

  const hiddenSeries = useMemo(() => {
    if (!timeframeBinColumnFilter || timeframeBinColumnFilter.length === 0) {
      return new Set<string>()
    }
    return new Set(
      TIMEFRAME_BINS.filter((bin) => !timeframeBinColumnFilter.includes(bin))
    )
  }, [timeframeBinColumnFilter])

  const totalCount = useMemo(
    () => tableFilteredData.length,
    [tableFilteredData]
  )

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
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart
          chartRef={chartRef}
          filename={`vessel-strike-timeframe-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Vessel Strike Timeframe Analysis'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Vessel Strike Timeframe Analysis
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRangeProps.yearRange[0]} to{' '}
            {yearRangeProps.yearRange[1]} • Total Count: {totalCount}
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
              showTotal={false}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={handleHiddenSeriesChange}
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
              showTotal={false}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={handleHiddenSeriesChange}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>

      <div className='mt-8'>
        <InjuryDownloadButton
          table={table as unknown as TanstackTable<WhaleInjury>}
          filename={`vessel-strike-timeframe-data-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table as unknown as TanstackTable<WhaleInjury>}
          data={processedData}
          yearRange={yearRangeProps.yearRange}
          setYearRange={yearRangeProps.setYearRange}
          minYear={yearRangeProps.minYear}
          maxYear={yearRangeProps.maxYear}
          defaultStartYear={1980}
        />
        <div className='mt-4'>
          <InjuryTable table={table as unknown as TanstackTable<WhaleInjury>} />
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
