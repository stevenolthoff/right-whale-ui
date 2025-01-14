'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import Table from '@/app/components/monitoring/Table'
import Download from '@/app/components/monitoring/Download'

const Unusual = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results,
    (item) => item.IsUnusualMortalityEvent === true
  )

  const chartData = (() => {
    if (!results) return []

    const yearCounts = results
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
        results
          .filter((item) => item.IsUnusualMortalityEvent)
          .map((item) => item.UnusualMortalityEventDescription)
      )
    )

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const dataPoint: any = { year }
      uniqueDescriptions.forEach((desc) => {
        dataPoint[desc] = (yearCounts[year] && yearCounts[year][desc]) || 0
      })
      formattedData.push(dataPoint)
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalUnusualEvents = chartData.reduce(
    (sum, item) =>
      sum +
      Object.values(item).reduce(
        (a: number, b: any) => (typeof b === 'number' ? a + b : a),
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
        />
      </ChartLayout>

      <Download />

      <Table
        visibleColumns={['EGNo', 'CaseId', 'DetectionDate']}
        defaultFilters={{
          DetectionDate: [yearRange[0], yearRange[1]],
          UnusualMortalityEventDescription: 'all-yes',
        }}
        showFilters={false}
      />
    </div>
  )
}

export default Unusual
