'use client'
import React from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '../../components/monitoring/YearRangeSlider'
import { useInjuryYearRange } from '../../hooks/useInjuryYearRange'
import { DataChart } from '../../components/monitoring/DataChart'
import { Loader } from '@/app/components/ui/Loader'

export default function Entanglement() {
  const { data, loading, error } = useInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useInjuryYearRange(data)

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
          item.year >= yearRange[0] && 
          item.year <= yearRange[1] &&
          item.type.includes('Entanglement')
        )
        .forEach(item => {
          if (!yearData.has(item.year)) {
            yearData.set(item.year, Object.fromEntries(types.map(t => [t, 0])))
          }
          yearData.get(item.year)![item.account]++
        })

      const formattedData = []
      for (let year = yearRange[0]; year <= yearRange[1]; year++) {
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
          item.year >= yearRange[0] && 
          item.year <= yearRange[1] &&
          item.type.includes('Entanglement')
        )
        .forEach(item => {
          if (!yearData.has(item.year)) {
            yearData.set(item.year, Object.fromEntries(severities.map(s => [s, 0])))
          }
          yearData.get(item.year)![item.severity]++
        })

      const formattedData = []
      for (let year = yearRange[0]; year <= yearRange[1]; year++) {
        formattedData.push({
          year,
          ...(yearData.get(year) || Object.fromEntries(severities.map(s => [s, 0])))
        })
      }
      
      return formattedData.sort((a, b) => a.year - b.year)
    })()
  }

  return (
    <div className='flex flex-col space-y-8 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      
      <div>
        <h3 className='text-lg font-semibold mb-4'>Entanglement Account Types</h3>
        <DataChart data={chartData.byType} stacked={true} />
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-4'>Severity Levels</h3>
        <DataChart data={chartData.bySeverity} stacked={true} />
      </div>
    </div>
  )
}
