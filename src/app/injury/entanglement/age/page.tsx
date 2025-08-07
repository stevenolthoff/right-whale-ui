'use client'

import React from 'react'
import InjuryExplorerPage from '@/app/components/injury/InjuryExplorerPage'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'

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

export default function EntanglementByAgePage() {
  const chartDataProcessor = (
    data: WhaleInjury[],
    yearRange: [number, number]
  ) => {
    const yearFilteredData = data.filter((item) => {
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
  }

  const charts = [
    {
      title: 'Total Entanglements by Age Class',
      stackId: 'total',
      stacked: true,
      yAxisLabel: 'Number of Entanglements',
      customOrder: AGE_CLASS_ORDER,
      showTotal: true,
    },
    {
      title: 'Percentage of Entanglements by Age Class',
      stackId: 'percentage',
      stacked: true,
      isPercentChart: true,
      customOrder: AGE_CLASS_ORDER,
      showTotal: true,
    },
  ]

  return (
    <InjuryExplorerPage
      pageTitle='Entanglement by Age Class'
      injuryFilter={(item) => item.InjuryTypeDescription === 'Entanglement'}
      chartDataProcessor={chartDataProcessor}
      charts={charts}
      tableColumns={getTableColumns}
      popupContext='entanglement'
    />
  )
} 
