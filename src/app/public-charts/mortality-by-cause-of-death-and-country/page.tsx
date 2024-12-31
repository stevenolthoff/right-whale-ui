'use client'
import React, { useState, useEffect, useRef } from 'react'
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
import { Loader } from '@/app/components/ui/Loader'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

// Define colors for each cause-country combination
const BAR_COLORS: Record<string, string> = {
  'Entanglement_CA': '#b33dc6',
  'Entanglement_US': '#27aeef', 
  'Vessel Strike_CA': '#edbf33',
  'Vessel Strike_US': '#bdcf32',
}

// We'll focus on just Entanglement and Vessel Strike
const FOCUSED_CAUSES = ['Entanglement', 'Vessel Strike']

export default function MortalityByCauseAndCountry() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(
    loading ? null : data,
    item => FOCUSED_CAUSES.includes(item.causeOfDeath)
  )
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
  }, [hiddenSeries])

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

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
        item.year >= yearRangeProps.yearRange[0] && 
        item.year <= yearRangeProps.yearRange[1] && 
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
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
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

  // Get all unique series names (cause_country combinations)
  const allSeries = Object.keys(chartData[0] || {})
    .filter(key => key !== 'year')

  const handleLegendClick = (entry: { dataKey: string }) => {
    const seriesName = entry.dataKey
    
    setShowResetButton(true)
    setHiddenSeries(prev => {
      const newHidden = new Set(prev)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        // Hide all except the clicked one
        allSeries.forEach(name => newHidden.add(name))
        newHidden.delete(seriesName)
      }
      return newHidden
    })
  }

  const handleBarClick = (data: any, index: number) => {
    const seriesName = allSeries[index]
    if (seriesName) {
      setShowResetButton(true)
      setHiddenSeries(prev => {
        const newHidden = new Set(prev)
        if (newHidden.has(seriesName)) {
          newHidden.delete(seriesName)
        } else {
          // Hide all except the clicked one
          allSeries.forEach(name => newHidden.add(name))
          newHidden.delete(seriesName)
        }
        return newHidden
      })
    }
  }

  const resetVisibility = () => {
    setHiddenSeries(new Set())
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
          filename={`mortality-by-cause-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title="Right Whale Mortalities by Cause of Death and Country"
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>
      
      <div ref={chartRef} className='h-[700px] w-full'>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Right Whale Mortalities by Cause of Death and Country</h2>
          <p className="text-sm text-gray-600 mb-4">
            Data from {yearRangeProps.yearRange[0]} to {yearRangeProps.yearRange[1]}
          </p>
        </div>
        <div className='h-[600px]'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year"
                label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                label={{
                  value: 'Number of Mortalities',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 15,
                }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} mortalities`, name]}
                labelFormatter={(label: number) => `Year: ${label}`}
              />
              <Legend 
                onClick={(data) => {
                  if (data.dataKey) {
                    handleLegendClick({ dataKey: data.dataKey.toString() })
                  }
                }}
                wrapperStyle={{ 
                  cursor: 'pointer',
                  paddingTop: '20px',
                  bottom: '0px'
                }}
                verticalAlign="bottom"
                align="center"
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
                    fill={BAR_COLORS[`${cause}_${country}`] || '#ea5545'}
                    hide={hiddenSeries.has(`${cause}_${country}`)}
                    onClick={(data) => handleBarClick(data, allSeries.indexOf(`${cause}_${country}`))}
                    style={{ cursor: 'pointer' }}
                  />
                ))
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {showResetButton && (
        <div className="flex justify-center">
          <button
            onClick={resetVisibility}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Show All
          </button>
        </div>
      )}
    </div>
  )
}
