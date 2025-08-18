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

const getTableColumns = (
  setSelectedInjury: (injury: WhaleInjury | null) => void
) => [
  columnHelper.accessor('EGNo', {
    header: 'EG No',
    cell: (info) => {
      const egNo = info.getValue() as string
      if (!egNo || egNo === '') return 'N/A'
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
  columnHelper.accessor('InjuryTypeDescription', {
    header: 'Injury Type',
    filterFn: 'arrIncludesSome',
  }),
  columnHelper.accessor('InjuryAccountDescription', {
    header: 'Injury Description',
    filterFn: 'arrIncludesSome',
  }),
  columnHelper.accessor('InjurySeverityDescription', {
    header: 'Injury Severity',
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
    cell: (info) => {
      const value = info.getValue()
      return value && value !== '' ? value : 'N/A'
    },
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('GearComplexityDescription', {
    header: 'Gear Complexity',
    cell: (info) => {
      const value = info.getValue()
      return value && value !== '' ? value : 'N/A'
    },
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

export default function VesselStrikeByAgePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()
  const [isSideBySide, setIsSideBySide] = useState(true)

  const vesselStrikeData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Vessel Strike'
    )
  }, [allData])

  const yearRangeProps = useYearRange(
    loading ? null : vesselStrikeData,
    undefined,
    1980
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

  const columns = useMemo(() => getTableColumns(setSelectedInjury), [])

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
    table.getColumn('DetectionDate')?.setFilterValue(yearRangeProps.yearRange)
  }, [yearRangeProps.yearRange, table])

  const tableFilteredData = useMemo(
    () => table.getFilteredRowModel().rows.map((row) => row.original),
    [table.getFilteredRowModel().rows]
  )
  
  const allAgeClassesFromData = useMemo(
    () => Array.from(new Set(vesselStrikeData.map((item) => item.InjuryAgeClass))),
    [vesselStrikeData]
  )

  const chartData = useMemo(() => {
    const yearData = new Map<number, Record<string, number>>()

    tableFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const ageClass = mapAgeClassToAbbreviation(item.InjuryAgeClass)

      if (!yearData.has(year)) {
        yearData.set(
          year,
          Object.fromEntries(AGE_CLASS_ORDER.map((t) => [t, 0]))
        )
      }
      yearData.get(year)![ageClass]++
    })

    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      formattedData.push({
        year,
        ...(yearData.get(year) ||
          Object.fromEntries(AGE_CLASS_ORDER.map((t) => [t, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [tableFilteredData, yearRangeProps.yearRange])

  const handleHiddenSeriesChange = useCallback(
    (hiddenSeries: Set<string>) => {
      const column = table.getColumn('InjuryAgeClass')
      if (!column) return

      const visibleAbbrs = new Set(
        AGE_CLASS_ORDER.filter((abbr) => !hiddenSeries.has(abbr))
      )

      const visibleValues = allAgeClassesFromData.filter((val) => {
        const abbr = mapAgeClassToAbbreviation(val)
        return visibleAbbrs.has(abbr)
      })

      if (hiddenSeries.size === 0 || hiddenSeries.size === AGE_CLASS_ORDER.length) {
        column.setFilterValue(undefined)
      } else {
        column.setFilterValue(visibleValues.length > 0 ? visibleValues : [null]) // Use [null] to filter for nothing if no values match
      }
    },
    [table, allAgeClassesFromData]
  )

  const ageClassColumnFilter = columnFilters.find(
    (f) => f.id === 'InjuryAgeClass'
  )?.value as (string | null)[] | undefined

  const hiddenSeries = useMemo(() => {
    if (!ageClassColumnFilter) {
      return new Set<string>()
    }
    const visibleAbbrs = new Set(
      ageClassColumnFilter.map((val) => mapAgeClassToAbbreviation(val))
    )
    return new Set(AGE_CLASS_ORDER.filter((abbr) => !visibleAbbrs.has(abbr)))
  }, [ageClassColumnFilter])
  
  const totalVesselStrikesInView = useMemo(() => {
    return tableFilteredData.length
  }, [tableFilteredData])

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
          filename={`vessel-strike-age-class-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Vessel Strike by Age Class'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>
      <div ref={chartRef} className='w-full bg-white p-4'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-blue-900'>
            Vessel Strike by Age Class
          </h2>
          <p className='text-sm text-slate-500'>
            Data from {yearRangeProps.yearRange[0]} to{' '}
            {yearRangeProps.yearRange[1]} • Total Count:{' '}
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
              showTotal={false}
              hiddenSeries={hiddenSeries}
              onHiddenSeriesChange={handleHiddenSeriesChange}
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
          table={table}
          filename={`vessel-strike-by-age-data-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table}
          data={vesselStrikeData || []}
          yearRange={yearRangeProps.yearRange}
          setYearRange={yearRangeProps.setYearRange}
          minYear={yearRangeProps.minYear}
          maxYear={yearRangeProps.maxYear}
          defaultStartYear={1980}
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
