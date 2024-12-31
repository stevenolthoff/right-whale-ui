'use client'
import React, { useRef } from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { useInjuryYearRange } from '../../hooks/useInjuryYearRange'
import { DataChart } from '../../components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

export default function Entanglement() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useInjuryData()
  const yearRangeProps = useInjuryYearRange(
    loading ? null : data,
    item => item.type.includes('Entanglement')
  )

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for both charts
  const chartData = {
    byType: (() => {
      const types = Array.from(new Set(
        data
          .filter(item => item.type.includes('Entanglement'))
          .map(item => item.account)
      )).sort()

      const yearData = new Map<number, Record<string, number>>()
      
      data
        .filter(item => 
          item.year >= yearRangeProps.yearRange[0] && 
          item.year <= yearRangeProps.yearRange[1] &&
          item.type.includes('Entanglement')
        )
        .forEach(item => {
          if (!yearData.has(item.year)) {
            yearData.set(item.year, Object.fromEntries(types.map(t => [t, 0])))
          }
          yearData.get(item.year)![item.account]++
        })

      const formattedData = []
      for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
        formattedData.push({
          year,
          ...(yearData.get(year) || Object.fromEntries(types.map(t => [t, 0])))
        })
      }
      
      return formattedData.sort((a, b) => a.year - b.year)
    })(),

    bySeverity: (() => {
      const severities = Array.from(new Set(
        data
          .filter(item => item.type.includes('Entanglement'))
          .map(item => item.severity)
      )).sort()

      const yearData = new Map<number, Record<string, number>>()
      
      data
        .filter(item => 
          item.year >= yearRangeProps.yearRange[0] && 
          item.year <= yearRangeProps.yearRange[1] &&
          item.type.includes('Entanglement')
        )
        .forEach(item => {
          if (!yearData.has(item.year)) {
            yearData.set(item.year, Object.fromEntries(severities.map(s => [s, 0])))
          }
          yearData.get(item.year)![item.severity]++
        })

      const formattedData = []
      for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
        formattedData.push({
          year,
          ...(yearData.get(year) || Object.fromEntries(severities.map(s => [s, 0])))
        })
      }
      
      return formattedData.sort((a, b) => a.year - b.year)
    })()
  }

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </div>
        <ExportChart 
          chartRef={chartRef}
          filename={`entanglement-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title="Right Whale Entanglement Analysis"
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>
      
      <div ref={chartRef} className='h-[1400px] w-full'> {/* Doubled height to fit both charts */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Right Whale Entanglement Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">
            Data from {yearRangeProps.yearRange[0]} to {yearRangeProps.yearRange[1]}
          </p>
        </div>

        <div className='space-y-8'>
          <div className='h-[600px]'>
            <h3 className='text-lg font-semibold mb-4'>Entanglement Account Types</h3>
            <DataChart data={chartData.byType} stacked={true} yAxisLabel='Entanglements' />
          </div>

          <div className='h-[600px]'>
            <h3 className='text-lg font-semibold mb-4'>Severity Levels</h3>
            <DataChart data={chartData.bySeverity} stacked={true} yAxisLabel='Entanglements' />
          </div>
        </div>
      </div>
    </div>
  )
}
