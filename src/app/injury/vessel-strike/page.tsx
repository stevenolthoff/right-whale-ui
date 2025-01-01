'use client'
import React, { useRef } from 'react'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { DataChart } from '../../components/monitoring/DataChart'
import { useYearRange } from '../../hooks/useYearRange'
import { InjuryCase } from '@/app/types/monitoring'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

const VesselStrike = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { results, loading, error } = useMonitoringData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    results as InjuryCase[],
    (item) => item.InjuryTypeDescription === 'Vessel Strike'
  )

  const chartData = (() => {
    if (!results) return []

    // Get all unique account types first
    const accountTypes = new Set<string>()
    results
      .filter(item => item.InjuryTypeDescription === 'Vessel Strike')
      .forEach(item => {
        if (item.InjuryAccountDescription) {
          accountTypes.add(item.InjuryAccountDescription)
        }
      })

    // Create year-by-year data with counts for each account type
    const yearData = new Map<number, Record<string, number>>()
    
    results
      .filter((item) => {
        const year = new Date(item.DetectionDate).getFullYear()
        return (
          item.InjuryTypeDescription === 'Vessel Strike' &&
          year >= yearRange[0] && 
          year <= yearRange[1]
        )
      })
      .forEach(item => {
        const year = new Date(item.DetectionDate).getFullYear()
        const accountType = item.InjuryAccountDescription
        
        if (!yearData.has(year)) {
          yearData.set(year, Object.fromEntries([...accountTypes].map(type => [type, 0])))
        }
        const counts = yearData.get(year)!
        if (accountType) {
          counts[accountType]++
        }
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries([...accountTypes].map(type => [type, 0])))
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const totalStrikes = chartData.reduce((sum, item) => 
    sum + Object.entries(item)
      .filter(([key]) => key !== 'year')
      .reduce((acc, [, value]) => acc + value, 0)
  , 0)

  return (
    <ChartLayout
      title="Right Whale Vessel Strike Analysis"
      chartRef={chartRef}
      exportFilename={`vessel-strike-${yearRange[0]}-${yearRange[1]}.png`}
      yearRange={yearRange}
      totalCount={totalStrikes}
      loading={loading}
      error={error || undefined}
      description="Data represents vessel strike incidents involving North Atlantic Right Whales, categorized by strike type. Click and drag on the chart to zoom into specific periods."
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
        yAxisLabel="Number of Vessel Strikes"
      />
    </ChartLayout>
  )
}

export default VesselStrike
