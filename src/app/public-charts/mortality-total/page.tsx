'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import ChartLayout from '@/app/components/chartLayout'
import { Loader } from '@/app/components/ui/Loader'

export default function MortalityTotal() {
  const { data, loading, error } = useMortalityData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Create a map of year to count
    const yearCounts = new Map<number, number>()
    
    // Filter by year range and count occurrences
    data
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .forEach(item => {
        yearCounts.set(item.year, (yearCounts.get(item.year) || 0) + 1)
      })

    // Create array with all consecutive years
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
                value: 'Number of Mortalities',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} mortalities`, 'Count']}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="#1d4ed8"
              name="Mortalities"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
