'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import Table from '@/app/components/monitoring/Table'

const InjuryType = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results,
    () => true,
    1980
  )

  const chartData = (() => {
    if (!results) return []

    // Get all unique injury types first
    const injuryTypes = new Set<string>()
    results.forEach((item) => {
      if (item.InjuryTypeDescription) {
        injuryTypes.add(item.InjuryTypeDescription)
      }
    })

    // Create year-by-year data with counts for each injury type
    const yearData = new Map<number, Record<string, number>>()

    results
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return year >= yearRange[0] && year <= yearRange[1]
      })
      .forEach((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        if (!yearData.has(year)) {
          yearData.set(
            year,
            Object.fromEntries([...injuryTypes].map((type) => [type, 0]))
          )
        }
        const counts = yearData.get(year)!
        if (item.InjuryTypeDescription) {
          counts[item.InjuryTypeDescription]++
        }
      })

    // Format data for chart
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) ||
          Object.fromEntries([...injuryTypes].map((type) => [type, 0]))),
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalInjuries = chartData.reduce(
    (sum, item) =>
      sum +
      Object.entries(item)
        .filter(([key]) => key !== 'year')
        .reduce((acc, [, value]) => acc + value, 0),
    0
  )

  return (
    <>
      <ChartLayout
        title='Right Whale Injury Events'
        chartRef={chartRef}
        exportFilename={`injury-types-${yearRange[0]}-${yearRange[1]}.png`}
        yearRange={yearRange}
        totalCount={totalInjuries}
        loading={loading}
        error={error || undefined}
        description='Data represents different types of injuries sustained by North Atlantic Right Whales. Click and drag on the chart to zoom into specific periods.'
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
        />
      </ChartLayout>
      <Table
        defaultFilters={{
          DetectionDate: [yearRange[0], yearRange[1]],
        }}
        visibleColumns={[
          'EGNo',
          'CaseId',
          'FieldId',
          'InjuryTypeDescription',
          'InjurySeverityDescription',
          'DetectionDate',
          'Age',
          'MonitoringCaseAgeClass',
        ]}
        filtersExpanded={false}
      />
    </>
  )
}

export default InjuryType 
