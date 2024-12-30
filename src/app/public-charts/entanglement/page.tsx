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
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'

// Colors for different entanglement types
const TYPE_COLORS: Record<string, string> = {
  'Gear Present': '#2563eb', // blue-600
  'No Gear': '#9333ea', // purple-600
  'Unknown': '#10b981', // emerald-600
}

// Colors for different severity levels
const SEVERITY_COLORS: Record<string, string> = {
  'Severe': '#dc2626', // red-600
  'Moderate': '#f59e0b', // amber-500
  'Minor': '#84cc16', // lime-500
  'Unknown': '#6b7280', // gray-500
}

export default function Entanglement() {
  const { data, loading, error } = useInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useMortalityYearRange(data)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Filter and format data for both charts
  const chartData = (() => {
    // Get unique types (from account) and severities
    const types = Array.from(new Set(
      data
        .filter(item => item.type.includes('Entanglement'))
        .map(item => item.account)
    )).sort()

    const severities = Array.from(new Set(
      data
        .filter(item => item.type.includes('Entanglement'))
        .map(item => item.severity)
    )).sort()

    // Create year-by-year data
    const yearData = new Map<number, {
      byType: Record<string, number>
      bySeverity: Record<string, number>
    }>()
    
    // Filter and count occurrences
    data
      .filter(item => 
        item.year >= yearRange[0] && 
        item.year <= yearRange[1] &&
        item.type.includes('Entanglement')
      )
      .forEach(item => {
        if (!yearData.has(item.year)) {
          yearData.set(item.year, {
            byType: Object.fromEntries(types.map(t => [t, 0])),
            bySeverity: Object.fromEntries(severities.map(s => [s, 0]))
          })
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts.byType[item.account]++
        yearCounts.bySeverity[item.severity]++
      })

    // Convert to array format for Recharts
    const formattedData = {
      byType: [],
      bySeverity: []
    }

    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const counts = yearData.get(year) || {
        byType: Object.fromEntries(types.map(t => [t, 0])),
        bySeverity: Object.fromEntries(severities.map(s => [s, 0]))
      }

      formattedData.byType.push({
        year,
        ...counts.byType
      })

      formattedData.bySeverity.push({
        year,
        ...counts.bySeverity
      })
    }
    
    return {
      byType: formattedData.byType.sort((a, b) => a.year - b.year),
      bySeverity: formattedData.bySeverity.sort((a, b) => a.year - b.year),
      types,
      severities
    }
  })()

  return (
    <div className='flex flex-col space-y-8 bg-white p-4'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setYearRange}
      />
      
      {/* Entanglement Types Chart */}
      <div className='h-[400px] w-full'>
        <h3 className='text-lg font-semibold mb-4'>Entanglement Account Types</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.byType}
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
                value: 'Number of Cases',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} cases`, name]}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend />
            {chartData.types.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                name={type}
                stackId="a"
                fill={TYPE_COLORS[type] || '#9ca3af'}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Levels Chart */}
      <div className='h-[400px] w-full'>
        <h3 className='text-lg font-semibold mb-4'>Severity Levels</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.bySeverity}
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
                value: 'Number of Cases',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} cases`, name]}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend />
            {chartData.severities.map((severity) => (
              <Bar
                key={severity}
                dataKey={severity}
                name={severity}
                stackId="a"
                fill={SEVERITY_COLORS[severity] || '#9ca3af'}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
