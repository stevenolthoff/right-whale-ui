'use client'
import React, { useRef, useState, useMemo, useCallback } from 'react'
import { useWhaleInjuryApiData } from '@/app/hooks/useWhaleInjuryApiData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useYearRange } from '@/app/hooks/useYearRange'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ErrorMessage } from '@/app/components/ui/ErrorMessage'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import ChartAttribution from '@/app/components/charts/ChartAttribution'

const STRIKE_TYPE_ORDER = ['Blunt', 'Gash', 'Prop Cut(s)']
const SEVERITY_ORDER = [
  'Blunt',
  'Deep',
  'Shallow',
  'Superficial',
  'Unknown/Inconclusive',
]

export default function VesselStrikeTypeAndSeverity() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useWhaleInjuryApiData()
  const [isSideBySide, setIsSideBySide] = useState(true)
  const [typeFilters, setTypeFilters] = useState<Set<string>>(new Set())
  const [severityFilters, setSeverityFilters] = useState<Set<string>>(
    new Set()
  )

  const vesselStrikeData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      item.InjuryTypeDescription?.includes('Vessel Strike')
    )
  }, [data])

  const yearRangeProps = useYearRange(loading ? null : vesselStrikeData, undefined, 1980)

  const typeChartData = React.useMemo(() => {
    const filteredData = vesselStrikeData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return (
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1] &&
        (severityFilters.size === 0 ||
          !severityFilters.has(item.InjurySeverityDescription))
      )
    })

    const types = Array.from(
      new Set(filteredData.map((item) => item.InjuryAccountDescription))
    ).sort((a, b) => {
      const aIndex = STRIKE_TYPE_ORDER.indexOf(a)
      const bIndex = STRIKE_TYPE_ORDER.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

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
  }, [vesselStrikeData, yearRangeProps.yearRange, severityFilters])

  const severityChartData = React.useMemo(() => {
    const filteredData = vesselStrikeData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return (
        year >= yearRangeProps.yearRange[0] &&
        year <= yearRangeProps.yearRange[1] &&
        (typeFilters.size === 0 ||
          !typeFilters.has(item.InjuryAccountDescription))
      )
    })

    const severities = Array.from(
      new Set(filteredData.map((item) => item.InjurySeverityDescription))
    ).sort((a, b) => {
      const aIndex = SEVERITY_ORDER.indexOf(a)
      const bIndex = SEVERITY_ORDER.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

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
  }, [vesselStrikeData, yearRangeProps.yearRange, typeFilters])

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
          filename={`vessel-strike-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Vessel Strike Analysis'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-1'>
            Right Whale Vessel Strike Analysis
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
              <h3 className='text-lg font-semibold'>Vessel Strike Types</h3>
            </div>
            <DataChart
              data={typeChartData}
              stackId='type'
              stacked={true}
              yAxisLabel='Vessel Strikes'
              onFilterChange={(filters) => handleFilterChange('type', filters)}
              customOrder={STRIKE_TYPE_ORDER}
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
              yAxisLabel='Vessel Strikes'
              onFilterChange={(filters) =>
                handleFilterChange('severity', filters)
              }
              customOrder={SEVERITY_ORDER}
            />
          </div>
        </div>
        <ChartAttribution />
      </div>
    </div>
  )
} 
