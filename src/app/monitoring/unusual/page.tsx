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
        acc[year] = (acc[year] || 0) + 1
        return acc
      }, {} as Record<number, number>)

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts[year] || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalUnusualEvents = chartData.reduce(
    (sum, item) => sum + item.count,
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
          stacked={false}
          yAxisLabel='Number of Unusual Mortality Events'
        />
      </ChartLayout>

      <Download />

      <Table
        visibleColumns={['EGNo', 'FieldId', 'DetectionDate']}
        defaultFilters={{
          DetectionDate: [yearRange[0], yearRange[1]],
        }}
        showFilters={true}
      />
    </div>
  )
}

export default Unusual
