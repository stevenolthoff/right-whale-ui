'use client'
import React, { useRef, useState } from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useInjuryYearRange } from '@/app/hooks/useInjuryYearRange'
import { Loader } from '@/app/components/ui/Loader'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ExportChart } from '@/app/components/monitoring/ExportChart'
import { ParsedInjuryCase } from '@/app/types/injury'

export default function VesselStrike() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isSideBySide, setIsSideBySide] = useState(true)
  const { data, loading, error } = useInjuryData()
  const yearRangeProps = useInjuryYearRange(
    loading ? null : data,
    (item: ParsedInjuryCase) => item.type.includes('Vessel Strike')
  )

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for both charts
  const chartData = {
    byType: (() => {
      const types = Array.from(
        new Set(
          data
            .filter((item) => item.type.includes('Vessel Strike'))
            .map((item) => item.account)
        )
      ).sort()

      const yearData = new Map<number, Record<string, number>>()

      data
        .filter(
          (item) =>
            item.year >= yearRangeProps.yearRange[0] &&
            item.year <= yearRangeProps.yearRange[1] &&
            item.type.includes('Vessel Strike')
        )
        .forEach((item) => {
          if (!yearData.has(item.year)) {
            yearData.set(
              item.year,
              Object.fromEntries(types.map((t) => [t, 0]))
            )
          }
          yearData.get(item.year)![item.account]++
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
            Object.fromEntries(types.map((t) => [t, 0]))),
        })
      }

      return formattedData.sort((a, b) => a.year - b.year)
    })(),

    bySeverity: (() => {
      const severities = Array.from(
        new Set(
          data
            .filter((item) => item.type.includes('Vessel Strike'))
            .map((item) => item.severity)
        )
      ).sort()

      const yearData = new Map<number, Record<string, number>>()

      data
        .filter(
          (item) =>
            item.year >= yearRangeProps.yearRange[0] &&
            item.year <= yearRangeProps.yearRange[1] &&
            item.type.includes('Vessel Strike')
        )
        .forEach((item) => {
          if (!yearData.has(item.year)) {
            yearData.set(
              item.year,
              Object.fromEntries(severities.map((s) => [s, 0]))
            )
          }
          yearData.get(item.year)![item.severity]++
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
    })(),
  }

  const totalVesselStrikes = chartData.byType.reduce((sum, yearData) => {
    // Sum all values except the year property
    const yearTotal = Object.entries(yearData)
      .filter(([key]) => key !== 'year')
      .reduce((yearSum, [_, count]) => yearSum + (count as number), 0)
    return sum + yearTotal
  }, 0)

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
            {yearRangeProps.yearRange[1]} • Total Count:{' '}
            <span className='text-blue-700'>{totalVesselStrikes}</span>
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
              data={chartData.byType}
              stacked={true}
              yAxisLabel='Vessel Strikes'
            />
          </div>

          <div className='h-[600px]'>
            <div className='text-center mb-4'>
              <h3 className='text-lg font-semibold'>Severity Levels</h3>
            </div>
            <DataChart
              data={chartData.bySeverity}
              stacked={true}
              yAxisLabel='Vessel Strikes'
            />
          </div>
        </div>
      </div>
    </div>
  )
} 
