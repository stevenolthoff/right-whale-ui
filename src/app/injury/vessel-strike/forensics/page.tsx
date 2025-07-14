'use client'
import React, { useRef, useState, useMemo, useCallback } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useYearRange } from '@/app/hooks/useYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import ChartAttribution from '@/app/components/charts/ChartAttribution'
import { WhaleInjury } from '@/app/types/whaleInjury'

// Constants for bin orders
const FORENSICS_ORDER = ['Yes', 'No']
const VESSEL_SIZE_ORDER = [
  '< 40 ft',
  '40 to 65 ft',
  '> 65 ft',
  'Other',
  'Unknown',
]

// Helper function to get forensics bin
const getForensicsBin = (item: WhaleInjury): string => {
  if (item.ForensicsCompleted === 'Y') return 'Yes'
  if (item.ForensicsCompleted === 'N') return 'No'
  return 'Unknown'
}

// Helper function for vessel size bin
const getVesselSizeBin = (item: WhaleInjury): string => {
  const desc = item.VesselSizeDescription
  if (!desc) return 'Unknown'
  if (desc.includes('< 40')) return '< 40 ft'
  if (desc.includes('40 to 65') || desc.includes('40 - >65'))
    return '40 to 65 ft'
  if (desc.includes('> 65')) return '> 65 ft'
  if (desc.toLowerCase() === 'other') return 'Other'
  return 'Unknown'
}

export default function VesselStrikeForensicsPage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useWhaleInjuryDataStore()
  const [isSideBySide, setIsSideBySide] = useState(true)
  const [forensicsFilters, setForensicsFilters] = useState<Set<string>>(
    new Set()
  )
  const [vesselSizeFilters, setVesselSizeFilters] = useState<Set<string>>(
    new Set()
  )

  const vesselStrikeData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      item.InjuryTypeDescription?.includes('Vessel Strike')
    )
  }, [data])

  const yearRangeProps = useYearRange(
    loading ? null : vesselStrikeData,
    undefined,
    1980
  )

  const forensicsChartData = React.useMemo(() => {
    const filteredData = vesselStrikeData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const matchesYear =
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1]
      const vesselSizeBin = getVesselSizeBin(item)
      const passesVesselSizeFilter =
        vesselSizeFilters.size === 0 || !vesselSizeFilters.has(vesselSizeBin)
      return matchesYear && passesVesselSizeFilter
    })

    const yearData = new Map<number, Record<string, number>>()

    filteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const forensicsBin = getForensicsBin(item)
      if (forensicsBin === 'Unknown') return

      if (!yearData.has(year)) {
        yearData.set(
          year,
          Object.fromEntries(FORENSICS_ORDER.map((t) => [t, 0]))
        )
      }
      yearData.get(year)![forensicsBin]++
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
          Object.fromEntries(FORENSICS_ORDER.map((t) => [t, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [vesselStrikeData, yearRangeProps.yearRange, vesselSizeFilters])

  const vesselSizeChartData = React.useMemo(() => {
    const filteredData = vesselStrikeData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const forensicsBin = getForensicsBin(item)
      const matchesYear =
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1]
      const passesForensicsFilter =
        forensicsFilters.size === 0 || !forensicsFilters.has(forensicsBin)
      return matchesYear && passesForensicsFilter
    })

    const yearData = new Map<number, Record<string, number>>()

    filteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const vesselSizeBin = getVesselSizeBin(item)

      if (!yearData.has(year)) {
        yearData.set(
          year,
          Object.fromEntries(VESSEL_SIZE_ORDER.map((s) => [s, 0]))
        )
      }
      yearData.get(year)![vesselSizeBin]++
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
          Object.fromEntries(VESSEL_SIZE_ORDER.map((s) => [s, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [vesselStrikeData, yearRangeProps.yearRange, forensicsFilters])

  const handleFilterChange = useCallback(
    (chartType: 'forensics' | 'vesselSize', filters: Set<string>) => {
      if (chartType === 'forensics') {
        setForensicsFilters(filters)
      } else {
        setVesselSizeFilters(filters)
      }
    },
    []
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

      <div className='flex justify-between items-center bg-slate-50 p-4 rounded-lg'>
        <div className='flex-grow max-w-2xl'>
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart
          chartRef={chartRef}
          filename={`vessel-strike-forensics-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Vessel Strike Forensics Analysis'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full bg-white p-4 rounded-lg'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-1'>
            Right Whale Vessel Strike Forensics Analysis
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
              <h3 className='text-lg font-semibold'>Forensics Completed</h3>
            </div>
            <DataChart
              data={forensicsChartData}
              stackId='forensics'
              stacked={true}
              yAxisLabel='Vessel Strikes'
              onFilterChange={(filters) =>
                handleFilterChange('forensics', filters)
              }
              customOrder={FORENSICS_ORDER}
            />
          </div>

          <div className='h-[600px]'>
            <div className='text-center mb-4'>
              <h3 className='text-lg font-semibold'>Vessel Size</h3>
            </div>
            <DataChart
              data={vesselSizeChartData}
              stackId='vesselSize'
              stacked={true}
              yAxisLabel='Vessel Strikes'
              onFilterChange={(filters) =>
                handleFilterChange('vesselSize', filters)
              }
              customOrder={VESSEL_SIZE_ORDER}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
    </div>
  )
} 
