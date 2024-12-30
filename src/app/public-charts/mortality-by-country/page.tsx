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

// Define colors for each country
const COUNTRY_COLORS: Record<string, string> = {
  'US': '#1d4ed8', // blue
  'CA': '#dc2626', // red
  'Other': '#4b5563', // gray
}

export default function MortalityByCountry() {
  const { data, loading, error } = useMortalityData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Get unique countries
    const countries = Array.from(new Set(data.map(item => item.country)))
      .sort((a, b) => a.localeCompare(b))

    // Create year-by-year data with counts for each country
    const yearData = new Map<number, Record<string, number>>()
    
    // Filter by year range and count occurrences by country
    data
      .filter(item => item.year >= yearRange[0] && item.year <= yearRange[1])
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, Object.fromEntries(countries.map(c => [c, 0])))
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[item.country]++
      })

    // Convert to array format needed by Recharts
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      formattedData.push({
        year,
        ...(yearData.get(year) || Object.fromEntries(countries.map(c => [c, 0])))
      })
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  // Get unique countries for creating bars
  const countries = Array.from(new Set(data.map(item => item.country)))
    .sort((a, b) => a.localeCompare(b))

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
            {countries.map((country) => (
              <Bar
                key={country}
                dataKey={country}
                name={country}
                stackId="a"
                fill={COUNTRY_COLORS[country] || '#9ca3af'} // Default to gray if no color defined
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
