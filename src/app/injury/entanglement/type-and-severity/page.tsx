'use client'
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useYearRange } from '@/app/hooks/useYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
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

export default function EntanglementTypeAndSeverity() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useWhaleInjuryDataStore()
  const [isSideBySide, setIsSideBySide] = useState(true)
  const [typeFilters, setTypeFilters] = useState<Set<string>>(new Set())
  const [severityFilters, setSeverityFilters] = useState<Set<string>>(new Set())

  const entanglementData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      item.InjuryTypeDescription?.includes('Entanglement')
    )
  }, [data])

  const yearRangeProps = useYearRange(
    loading ? null : entanglementData,
    undefined,
    1980
  )

  const typeChartData = React.useMemo(() => {
    const filteredData = entanglementData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const matchesYear =
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1]
      const passesSeverityFilter =
        severityFilters.size === 0 ||
        !severityFilters.has(item.InjurySeverityDescription)
      return matchesYear && passesSeverityFilter
    })

    const types = Array.from(
      new Set(filteredData.map((item) => item.InjuryAccountDescription))
    ).sort()

    const yearData = new Map<number, Record<string, number>>()

    filteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      if (!yearData.has(year)) {
        yearData.set(year, Object.fromEntries(types.map((t) => [t, 0])))
      }
      yearData.get(year)![item.InjuryAccountDescription]++
    })

    const formattedData = []
    for (
      let year = yearRangeProps.yearRange[0];
      year <= yearRangeProps.yearRange[1];
      year++
    ) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(types.map((t) => [t, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [entanglementData, yearRangeProps.yearRange, severityFilters])

  const severityChartData = React.useMemo(() => {
    const filteredData = entanglementData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const matchesYear =
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1]
      const passesTypeFilter =
        typeFilters.size === 0 ||
        !typeFilters.has(item.InjuryAccountDescription)
      return matchesYear && passesTypeFilter
    })

    const severities = Array.from(
      new Set(filteredData.map((item) => item.InjurySeverityDescription))
    ).sort()

    const yearData = new Map<number, Record<string, number>>()

    filteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      if (!yearData.has(year)) {
        yearData.set(year, Object.fromEntries(severities.map((s) => [s, 0])))
      }
      yearData.get(year)![item.InjurySeverityDescription]++
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
          Object.fromEntries(severities.map((s) => [s, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [entanglementData, yearRangeProps.yearRange, typeFilters])

  const handleFilterChange = useCallback(
    (chartType: 'type' | 'severity', filters: Set<string>) => {
      if (chartType === 'type') {
        setTypeFilters(filters)
      } else {
        setSeverityFilters(filters)
      }
    },
    []
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
    table.getColumn('DetectionDate')?.setFilterValue(yearRangeProps.yearRange)
  }, [yearRangeProps.yearRange, table])

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

      <div className='flex justify-between items-center'>
        <div className='flex-grow'>
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart
          chartRef={chartRef}
          filename={`entanglement-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Entanglement Analysis'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-1'>
            Right Whale Entanglement Analysis
          </h2>
          <p className='text-sm text-gray-600'>
            Data from {yearRangeProps.yearRange[0]} to{' '}
            {yearRangeProps.yearRange[1]}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            isSideBySide ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-8`}
        >
          <div className='h-[600px]'>
            <div className='text-center mb-4'>
              <h3 className='text-lg font-semibold'>Entanglement Types</h3>
            </div>
            <DataChart
              data={typeChartData}
              stackId='type'
              stacked={true}
              yAxisLabel='Entanglements'
              onFilterChange={(filters) => handleFilterChange('type', filters)}
            />
          </div>

          <div className='h-[600px]'>
            <div className='text-center mb-4'>
              <h3 className='text-lg font-semibold'>Severity Levels</h3>
            </div>
            <DataChart
              data={severityChartData}
              stackId='severity'
              stacked={true}
              yAxisLabel='Entanglements'
              onFilterChange={(filters) =>
                handleFilterChange('severity', filters)
              }
              customOrder={['Severe', 'Moderate', 'Minor']}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
      <div className='mt-8'>
        <InjuryDownloadButton
          table={table}
          filename={`entanglement-by-type-severity-data-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.csv`}
        />
        <InjuryTableFilters
          table={table}
          data={entanglementData || []}
          yearRange={yearRangeProps.yearRange}
          setYearRange={yearRangeProps.setYearRange}
          minYear={yearRangeProps.minYear}
          maxYear={yearRangeProps.maxYear}
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
