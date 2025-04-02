'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import Download from '@/app/components/monitoring/Download'
import Table from '@/app/components/monitoring/Table'

const Active = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const yearRangeProps = useYearRange(
    loading ? null : results,
    (item) => item.IsActiveCase === true
  )

  const { yearRange, setYearRange, minYear, maxYear } = yearRangeProps

  const chartData = (() => {
    if (!results) return []

    // First, filter the results based on year range and active cases
    const filteredResults = results.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return item.IsActiveCase && year >= yearRange[0] && year <= yearRange[1]
    })

    // Group by year and injury type
    const yearTypeCount = filteredResults.reduce((acc, item) => {
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
        filteredResults.map((item) => item.InjuryTypeDescription || 'Unknown')
      )
    )

    // Create array with all consecutive years and injury types
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const dataPoint: any = { year }
      injuryTypes.forEach((injuryType) => {
        dataPoint[injuryType] = yearTypeCount[year]?.[injuryType] || 0
      })
      formattedData.push(dataPoint)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalActiveCases =
    results?.filter(
      (item) =>
        item.IsActiveCase &&
        new Date(item.DetectionDate).getFullYear() >= yearRange[0] &&
        new Date(item.DetectionDate).getFullYear() <= yearRange[1]
    ).length || 0

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
              onChange={setYearRange}
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

      <Table
        defaultFilters={{
          IsActiveCase: 'Yes',
          DetectionDate: [yearRange[0], yearRange[1]],
        }}
        filtersExpanded={false}
      />
    </div>
  )
}

export default Active

