'use client'
import React, { useRef, useMemo } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import Download from '@/app/components/monitoring/Download'
import Table from '@/app/components/monitoring/Table'
import { useYearRangeStore } from '../../stores/useYearRangeStore'
import { useFilteredData } from '../../hooks/useFilteredData'

const Active = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { filteredData } = useFilteredData()
  const {
    yearRange,
    setYearRange,
    isUpdating,
    minYear,
    maxYear,
    setMinMaxYears,
  } = useYearRangeStore()

  // Set min/max years when data is loaded, filtering for active cases
  React.useEffect(() => {
    if (results?.length) {
      setMinMaxYears(results, (item) => item.IsActiveCase)
    }
  }, [results, setMinMaxYears])

  // Initialize year range only once when data is first loaded
  React.useEffect(() => {
    if (
      !isUpdating &&
      minYear &&
      maxYear &&
      yearRange[0] === 2000 &&
      yearRange[1] === 2024
    ) {
      setYearRange([minYear, maxYear])
    }
  }, [minYear, maxYear, setYearRange, isUpdating, yearRange])

  const handleYearRangeChange = React.useCallback(
    (range: [number, number]) => {
      if (!isUpdating) {
        setYearRange(range)
      }
    },
    [setYearRange, isUpdating]
  )

  const defaultFilters = useMemo(
    () => ({
      IsActiveCase: 'Yes' as const,
      DetectionDate: yearRange,
    }),
    [yearRange]
  )

  const yearFilteredData = useMemo(() => {
    if (!filteredData) return []
    return filteredData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })
  }, [filteredData, yearRange])

  const chartData = React.useMemo(() => {
    if (!yearFilteredData) return []

    // Group by year and injury type
    const yearTypeCount = yearFilteredData.reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      const injuryType = item.InjuryTypeDescription || 'Unknown'

      if (!acc[year]) {
        acc[year] = {}
      }
      acc[year][injuryType] = (acc[year][injuryType] || 0) + 1
      return acc
    }, {} as Record<number, Record<string, number>>)

    // Get unique injury types
    const injuryTypes = Array.from(
      new Set(
        yearFilteredData.map((item) => item.InjuryTypeDescription || 'Unknown')
      )
    )

    // Create array with all consecutive years and injury types
    const formattedData: Array<{ year: number; [key: string]: number }> = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const dataPoint: { year: number; [key: string]: number } = { year }
      injuryTypes.forEach((injuryType) => {
        dataPoint[injuryType] = yearTypeCount[year]?.[injuryType] || 0
      })
      formattedData.push(dataPoint)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [yearFilteredData, yearRange])

  const totalActiveCases = React.useMemo(
    () => yearFilteredData.length || 0,
    [yearFilteredData]
  )

  return (
    <div className='wrapper'>
      <ChartLayout
        title='Active Right Whale Monitoring'
        chartRef={chartRef}
        exportFilename={`active-monitoring-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalActiveCases}
        loading={loading}
        error={error || undefined}
        description='Data represents active monitoring cases of North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods.'
        controls={
          <>
            <label className='block text-sm font-medium text-slate-600 mb-2'>
              Select Year Range
            </label>
            <YearRangeSlider
              yearRange={yearRange}
              minYear={minYear}
              maxYear={maxYear}
              onChange={handleYearRangeChange}
            />
          </>
        }
      >
        <DataChart
          data={chartData}
          stacked={true}
          yAxisLabel='Number of Active Cases'
          customOrder={['Vessel Strike', 'Entanglement', 'Unknown / Other']}
        />
      </ChartLayout>

      <Download />

      <Table defaultFilters={defaultFilters} filtersExpanded={false} />
    </div>
  )
}

export default Active

