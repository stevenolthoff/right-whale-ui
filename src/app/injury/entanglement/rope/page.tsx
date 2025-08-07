'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { DataChart } from '@/app/components/monitoring/DataChart'
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
} from '@tanstack/react-table'
import { useYearRange } from '@/app/hooks/useYearRange'

import InjuryDetailsPopup from '@/app/components/injury/InjuryDetailsPopup'

const columnHelper = createColumnHelper<WhaleInjury>()

const AGE_GROUPS_ORDER = ['0-2yr', '3-5yr', '6-8yr', '9+yr', 'Unknown']
const ROPE_DIAMETER_ORDER = ['<7/16", 11mm', '> 1/2", 12mm', 'Other', 'Unknown']

const getAgeGroup = (
  ageStr: string | null,
  ageClassStr: string | null
): string => {
  if (ageStr !== null && ageStr !== undefined) {
    const age = parseInt(ageStr.trim(), 10)
    if (!isNaN(age)) {
      if (age <= 2) return '0-2yr'
      if (age <= 5) return '3-5yr'
      if (age <= 8) return '6-8yr'
      if (age >= 9) return '9+yr'
    }
  }

  if (ageClassStr) {
    const trimmedAgeClass = ageClassStr.trim().toLowerCase()
    if (trimmedAgeClass === 'adult' || trimmedAgeClass === 'a') {
      return '9+yr'
    } else if (trimmedAgeClass === 'calf' || trimmedAgeClass === 'c') {
      return '0-2yr'
    }
  }

  return 'Unknown'
}

const smallRopeValues = ['1/4 (6)', '5/16 (8)', '3/8 (10)', '7/16 (11)']
const largeRopeValues = [
  '1/2 (12)',
  '9/16 (14)',
  '5/8 (16)',
  '3/4 (18)',
  '7/8 (22)',
  '1 (24)',
  '1-1/8 (28)',
  '1-1/4 (30)',
  '1-1/2 (36)',
  '1-5/8 (40)',
]

const getRopeDiameterGroup = (
  diameters: { RopeDiameterDescription: string }[]
): string => {
  if (!diameters || diameters.length === 0) {
    return 'Unknown'
  }
  const desc = (diameters[0].RopeDiameterDescription || '').trim()

  if (smallRopeValues.includes(desc)) {
    return '<7/16", 11mm'
  }
  if (largeRopeValues.includes(desc)) {
    return '> 1/2", 12mm'
  }
  if (desc !== '') {
    return 'Other'
  }
  return 'Unknown'
}

export default function EntanglementByRopeAndAgePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const entanglementData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) =>
        item.InjuryTypeDescription === 'Entanglement' &&
        item.InjuryAccountDescription === 'Gear'
    )
  }, [allData])

  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    entanglementData,
    undefined,
    1980
  )

  const chartData = useMemo(() => {
    if (!entanglementData.length) return []

    const ageGroupData: Record<string, Record<string, number>> = {}
    AGE_GROUPS_ORDER.forEach((ageGroup) => {
      ageGroupData[ageGroup] = {}
      ROPE_DIAMETER_ORDER.forEach((ropeGroup) => {
        ageGroupData[ageGroup][ropeGroup] = 0
      })
    })

    entanglementData.forEach((item: WhaleInjury) => {
      const ageGroup = getAgeGroup(item.InjuryAge, item.InjuryAgeClass)
      const ropeGroup = getRopeDiameterGroup(item.RopeDiameters)
      if (
        ageGroupData[ageGroup] &&
        ageGroupData[ageGroup][ropeGroup] !== undefined
      ) {
        ageGroupData[ageGroup][ropeGroup]++
      }
    })

    return AGE_GROUPS_ORDER.map((ageGroup) => ({
      ageGroup,
      ...ageGroupData[ageGroup],
    }))
  }, [entanglementData])

  const totalEntanglements = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.entries(item)
          .filter(([key]) => key !== 'ageGroup' && !hiddenSeries.has(key))
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
    table.getColumn('DetectionDate')?.setFilterValue(yearRange)
  }, [yearRange, table])

  return (
    <div className='space-y-6'>
      <ChartLayout
        title='Entanglement by Rope Diameter and Age Group'
        chartRef={chartRef}
        exportFilename='entanglement-rope-by-age.png'
        totalCount={totalEntanglements}
        loading={loading}
        error={error || undefined}
        description='Data represents entanglement cases of North Atlantic Right Whales, categorized by rope diameter and the age of the whale at the time of injury.'
      >
        <DataChart
          data={chartData}
          xAxisDataKey='ageGroup'
          xAxisLabel='Age Group'
          xAxisInterval={0}
          xAxisTickAngle={0}
          xAxisTextAnchor='middle'
          stacked={true}
          yAxisLabel='Number of Entanglements'
          customOrder={ROPE_DIAMETER_ORDER}
          showTotal={false}
          hiddenSeries={hiddenSeries}
          onHiddenSeriesChange={setHiddenSeries}
        />
      </ChartLayout>
      <div className='mt-8'>
        <InjuryDownloadButton
          table={table}
          filename={`entanglement-by-rope-and-age-data-${yearRange[0]}-${yearRange[1]}.csv`}
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
