'use client'
import React, { useRef, useMemo, useCallback } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
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
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'

const columnHelper = createColumnHelper<WhaleInjury>()

const InjuryType = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useWhaleInjuryDataStore()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    data,
    () => true,
    1980
  )

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
    data: data || [],
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

  // Sync yearRange to table filters
  React.useEffect(() => {
    table.getColumn('DetectionDate')?.setFilterValue(yearRange)
  }, [yearRange, table])

  const chartData = useMemo(() => {
    if (!data) return []
    const injuryTypes = Array.from(
      new Set(data.map((item) => item.InjuryTypeDescription))
    ).filter(Boolean)

    const yearData = new Map<number, Record<string, number>>()

    data
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return year >= yearRange[0] && year <= yearRange[1]
      })
      .forEach((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        if (!yearData.has(year)) {
          yearData.set(
            year,
            Object.fromEntries(injuryTypes.map((type) => [type, 0]))
          )
        }
        const counts = yearData.get(year)!
        if (item.InjuryTypeDescription) {
          counts[item.InjuryTypeDescription]++
        }
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) ||
          Object.fromEntries(injuryTypes.map((type) => [type, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [data, yearRange])

  const handleChartFilter = useCallback(
    (hiddenSeries: Set<string>) => {
      const injuryTypeColumn = table.getColumn('InjuryTypeDescription')
      if (injuryTypeColumn) {
        if (!data) return
        const allTypes = Array.from(
          new Set(data.map((item) => item.InjuryTypeDescription))
        ).filter(Boolean)
        if (hiddenSeries.size === 0 || hiddenSeries.size === allTypes.length) {
          injuryTypeColumn.setFilterValue(undefined)
        } else {
          const visibleTypes = allTypes.filter(
            (type) => !hiddenSeries.has(type)
          )
          injuryTypeColumn.setFilterValue(visibleTypes)
        }
      }
    },
    [table, data]
  )

  const totalInjuries = useMemo(() => {
    return table.getFilteredRowModel().rows.length
  }, [table.getFilteredRowModel().rows.length])

  return (
    <div className='space-y-6'>
      <ChartLayout
        title='Right Whale Injury Events'
        chartRef={chartRef}
        exportFilename={`injury-types-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalInjuries}
        loading={loading}
        error={error || undefined}
        description='Data represents different types of injuries sustained by North Atlantic Right Whales. Click legend items to filter the table below.'
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
          yAxisLabel='Number of Injuries'
          onFilterChange={handleChartFilter}
        />
      </ChartLayout>

      <InjuryTableFilters
        table={table}
        data={data || []}
        yearRange={yearRange}
        setYearRange={setYearRange}
        minYear={minYear}
        maxYear={maxYear}
      />
      <InjuryTable table={table} />
    </div>
  )
}

export default InjuryType 
