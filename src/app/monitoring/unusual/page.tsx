'use client'
import React, { useRef, useMemo } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import Table from '@/app/components/monitoring/Table'
import Download from '@/app/components/monitoring/Download'
import { useYearRangeStore } from '../../stores/useYearRangeStore'
import { useFilteredData } from '../../hooks/useFilteredData'

const Unusual = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { filteredData } = useFilteredData()
  const { yearRange, setYearRange, minYear, maxYear, setMinMaxYears } =
    useYearRangeStore()

  // Reset year range when component mounts
  React.useEffect(() => {
    if (minYear && maxYear) {
      setYearRange([minYear, maxYear])
    }
  }, [minYear, maxYear, setYearRange])

  // Set min/max years when data is loaded, filtering for unusual mortality events
  React.useEffect(() => {
    if (results?.length) {
      setMinMaxYears(results, (item) => item.IsUnusualMortalityEvent)
    }
  }, [results, setMinMaxYears])

  const defaultFilters = useMemo(
    () => ({
      DetectionDate: yearRange,
      UnusualMortalityEventDescription: [
        'Yes - Morbidity',
        'Yes - Mortality',
        'Yes - Serious Injury',
      ],
    }),
    [yearRange]
  )

  const chartData = React.useMemo(() => {
    if (!filteredData) return []

    const yearCounts = filteredData
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return (
          item.IsUnusualMortalityEvent &&
          year >= yearRange[0] &&
          year <= yearRange[1]
        )
      })
      .reduce((acc, item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        const desc = item.UnusualMortalityEventDescription
        acc[year] = acc[year] || {}
        acc[year][desc] = (acc[year][desc] || 0) + 1
        return acc
      }, {} as Record<number, Record<string, number>>)

    const uniqueDescriptions = Array.from(
      new Set(
        filteredData
          .filter((item) => item.IsUnusualMortalityEvent)
          .map((item) => item.UnusualMortalityEventDescription)
      )
    )

    const formattedData: Array<{ year: number; [key: string]: number }> = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const dataPoint: { year: number; [key: string]: number } = { year }
      uniqueDescriptions.forEach((desc) => {
        dataPoint[desc] = (yearCounts[year] && yearCounts[year][desc]) || 0
      })
      formattedData.push(dataPoint)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [filteredData, yearRange])

  const totalUnusualEvents = chartData.reduce(
    (sum, item) =>
      sum +
      Object.values(item).reduce(
        (a: number, b: number) => (typeof b === 'number' ? a + b : a),
        0
      ) -
      item.year,
    0
  )

  return (
    <div className='wrapper'>
      <ChartLayout
        title='Unusual Right Whale Mortality Events'
        chartRef={chartRef}
        exportFilename={`unusual-mortality-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalUnusualEvents}
        loading={loading}
        error={error || undefined}
        description='Data represents unusual mortality events of North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods.'
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
          yAxisLabel='Number of Unusual Mortality Events'
          customOrder={[
            'Yes - Mortality',
            'Yes - Serious Injury',
            'Yes - Morbidity',
          ]}
        />
      </ChartLayout>

      <Download />

      <Table defaultFilters={defaultFilters} filtersExpanded={false} />
    </div>
  )
}

export default Unusual
