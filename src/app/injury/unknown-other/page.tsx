'use client'

import React, { useRef, useMemo } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { useYearRange } from '@/app/hooks/useYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import { WhaleInjury } from '@/app/types/whaleInjury'

export default function UnknownOtherInjuriesPage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()

  // Filter for injuries that are NOT Entanglement or Vessel Strike
  const unknownOtherData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item: WhaleInjury) =>
        item.InjuryTypeDescription !== 'Entanglement' &&
        item.InjuryTypeDescription !== 'Vessel Strike'
    )
  }, [allData])

  // Use the year range hook with a default start of 1980
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(
    unknownOtherData,
    undefined,
    1980
  )

  const chartData = useMemo(() => {
    if (!unknownOtherData.length) return []

    const yearFilteredData = unknownOtherData.filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return year >= yearRange[0] && year <= yearRange[1]
    })

    const yearCounts = new Map<number, number>()
    yearFilteredData.forEach((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
    })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0,
      })
    }

    return formattedData.sort((a, b) => a.year - b.year)
  }, [unknownOtherData, yearRange])

  const totalInjuriesInView = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0)
  }, [chartData])

  return (
    <ChartLayout
      title='Unknown/Other Injuries'
      chartRef={chartRef}
      exportFilename={`unknown-other-injuries-${yearRange[0]}-${yearRange[1]}.png`}
      yearRange={yearRange}
      totalCount={totalInjuriesInView}
      loading={loading}
      error={error || undefined}
      description='Data represents injuries from unknown or other causes (not classified as Entanglement or Vessel Strike).'
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
        yAxisLabel='Number of Injuries'
      />
    </ChartLayout>
  )
} 
