'use client'
import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { CauseOfDeath } from '@/app/types/mortality'

// Define colors for each cause of death
const CAUSE_COLORS: Record<CauseOfDeath | string, string> = {
  'Vessel Strike': 'rgb(37 99 235)', // blue-600
  'Entanglement': 'rgb(217 70 239)', // fuchsia-600
  'Neonate': '#84cc16', // yellow-500
  'Unknown': '#f59e0b', // slate-600  
  'Other': '#ef4444', // slate-400
}

export default function MortalityByCauseOfDeath() {
  const { data, loading, error } = useMortalityData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Get unique causes of death
    const causes = Array.from(new Set(data.map(item => item.causeOfDeath)))
      .sort((a, b) => a.localeCompare(b))

    // Create year-by-year data with counts for each cause
    const yearData = new Map<number, Record<string, number>>()
    
    // Filter by year range and count occurrences by cause
    data
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, Object.fromEntries(causes.map(c => [c, 0])))
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[item.causeOfDeath]++
      })

    // Convert to array format needed by Recharts
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(causes.map(c => [c, 0])))
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  // Get unique causes for creating bars
  const causes = Array.from(new Set(data.map(item => item.causeOfDeath)))
    .sort((a, b) => {
      // Custom sort to put Unknown and Other at the end
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      if (a === 'Other') return 1
      if (b === 'Other') return -1
      return a.localeCompare(b)
    })

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
              formatter={(value: number, name: string) => [`${value} mortalities`, name]}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend />
            {causes.map((cause) => (
              <Bar
                key={cause}
                dataKey={cause}
                name={cause}
                stackId="a"
                fill={CAUSE_COLORS[cause] || '#9ca3af'} // Default to gray if no color defined
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
