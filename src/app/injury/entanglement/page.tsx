'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

const Entanglement = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results,
    (item) => item.InjuryTypeDescription === 'Entanglement',
    1980
  )

  const chartData = (() => {
    if (!results) return []

    const yearData = new Map<number, Record<string, number>>()
    
    results
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return (
          item.InjuryTypeDescription === 'Entanglement' &&
          year >= yearRange[0] && 
          year <= yearRange[1]
        )
      })
      .forEach(item => {
        const year = new Date(item.DetectionDate).getFullYear()
        const gearType = item.InjuryAccountDescription
        
        if (!yearData.has(year)) {
          yearData.set(year, {
            'Gear': 0,
            'No Gear': 0
          })
        }
        const counts = yearData.get(year)!
        counts[gearType] = (counts[gearType] || 0) + 1
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        'Gear': yearData.get(year)?.['Gear'] || 0,
        'No Gear': yearData.get(year)?.['No Gear'] || 0
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalEntanglements = chartData.reduce((sum, item) => 
    sum + item['Gear'] + item['No Gear']
  , 0)

  return (
    <ChartLayout
      title="Right Whale Entanglement by Gear Type"
      chartRef={chartRef}
      exportFilename={`entanglement-gear-${yearRange[0]}-${yearRange[1]}.png`}
      yearRange={yearRange}
      totalCount={totalEntanglements}
      loading={loading}
      error={error || undefined}
      description="Data represents entanglement cases of North Atlantic Right Whales, categorized by presence of fishing gear. Click and drag on the chart to zoom into specific periods."
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
        yAxisLabel="Number of Entanglements"
      />
    </ChartLayout>
  )
}

export default Entanglement
