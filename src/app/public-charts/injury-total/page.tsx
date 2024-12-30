'use client'
import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'

export default function InjuryTotal() {
  const { data, loading, error } = useInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    const yearCounts = new Map<number, number>()
    
    data
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .forEach(item => {
        yearCounts.set(item.year, (yearCounts.get(item.year) || 0) + 1)
      })

    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        count: yearCounts.get(year) || 0
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      
      <div className='h-[500px] w-full'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{
                value: 'Number of Injuries',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} injuries`, 'Count']}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="#dc2626" // red-600
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
