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

// Define colors for each cause-country combination
const BAR_COLORS: Record<string, string> = {
  'Entanglement_CA': '#dc2626', // red-600
  'Entanglement_US': '#2563eb', // blue-600
  'Vessel Strike_CA': '#9333ea', // purple-600
  'Vessel Strike_US': '#10b981', // green
}

// We'll focus on just Entanglement and Vessel Strike
const FOCUSED_CAUSES = ['Entanglement', 'Vessel Strike']

export default function MortalityByCauseAndCountry() {
  const { data, loading, error } = useMortalityData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Filter and format data for the chart
  const chartData = (() => {
    // Get unique countries
    const countries = Array.from(new Set(data.map(item => item.country)))
      .sort((a, b) => a.localeCompare(b))

    // Create year-by-year data with counts for each cause and country
    const yearData = new Map<number, Record<string, number>>()
    
    // Filter by year range and count occurrences
    data
      .filter(item => 
        item.year >= yearRange[0] && 
        item.year <= yearRange[1] && 
        FOCUSED_CAUSES.includes(item.causeOfDeath)
      )
      .forEach(item => {
        const key = `${item.causeOfDeath}_${item.country}`
        if (!yearData.has(item.year)) {
          // Initialize all combinations of cause and country to 0
          const initialData: Record<string, number> = {}
          FOCUSED_CAUSES.forEach(cause => {
            countries.forEach(country => {
              initialData[`${cause}_${country}`] = 0
            })
          })
          yearData.set(item.year, initialData)
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[key]++
      })

    // Convert to array format needed by Recharts
    const formattedData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      if (yearData.has(year)) {
        formattedData.push({
          year,
          ...yearData.get(year)
        })
      }
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  // Get unique countries for creating stacked bars
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
      
      <div className='h-[600px] w-full'> {/* Increased height for better readability */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap="20%"
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
              formatter={(value: number, name: string) => {
                const [cause, country] = name.split('_')
                return [`${value} mortalities`, `${country} (${cause})`]
              }}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend 
              formatter={(value: string) => {
                const [cause, country] = value.split('_')
                return `${country} (${cause})`
              }}
            />
            {FOCUSED_CAUSES.map((cause) => (
              countries.map(country => (
                <Bar
                  key={`${cause}_${country}`}
                  dataKey={`${cause}_${country}`}
                  name={`${cause}_${country}`}
                  stackId={cause}
                  fill={BAR_COLORS[`${cause}_${country}`] || '#f59e0b'} // Default to amber if no color defined
                  radius={[0, 0, 0, 0]}
                />
              ))
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
