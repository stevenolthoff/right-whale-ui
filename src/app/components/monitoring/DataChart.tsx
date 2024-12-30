'use client'
import React, { useState } from 'react'
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

interface SimpleChartData {
  year: number
  count: number
}

export interface StackedChartData {
  year: number
  [key: string]: number  // Allow any string key with number value
}

interface DataChartProps {
  data: SimpleChartData[] | StackedChartData[]
  stacked?: boolean
}

const COLORS = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
]

export const DataChart = ({ data, stacked = false }: DataChartProps) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  // Add formatter function for years
  const formatYear = (year: number): string => {
    return window.innerWidth < 768 ? `'${year.toString().slice(-2)}` : year.toString()
  }

  if (stacked) {
    // Get all unique keys from all data points
    const keys = Array.from(new Set(
      data.flatMap(item => Object.keys(item))
    )).filter(key => 
      key !== 'year' && key !== 'category'
    )

    const handleLegendClick = (entry: { value: string }) => {
      setShowResetButton(true)
      setHiddenSeries(prev => {
        const newHidden = new Set(prev)
        if (newHidden.has(entry.value)) {
          newHidden.delete(entry.value)
        } else {
          // Hide all except the clicked one
          keys.forEach(name => newHidden.add(name))
          newHidden.delete(entry.value)
        }
        return newHidden
      })
    }

    const handleBarClick = (data: any, index: number) => {
      const seriesName = keys[index]
      if (seriesName) {
        setShowResetButton(true)
        setHiddenSeries(prev => {
          const newHidden = new Set(prev)
          if (newHidden.has(seriesName)) {
            newHidden.delete(seriesName)
          } else {
            // Hide all except the clicked one
            keys.forEach(name => newHidden.add(name))
            newHidden.delete(seriesName)
          }
          return newHidden
        })
      }
    }

    const resetVisibility = () => {
      setHiddenSeries(new Set())
      setShowResetButton(false)
    }
    
    return (
      <div className="relative">
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis 
                dataKey='year' 
                tickFormatter={formatYear}
                interval={window.innerWidth < 1200 ? 2 : 1}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                minTickGap={10}
              />
              <YAxis />
              <Tooltip />
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ cursor: 'pointer' }}
              />
              {keys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]}
                  hide={hiddenSeries.has(key)}
                  onClick={(data) => handleBarClick(data, index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {showResetButton && (
          <div className="flex justify-center mt-4">
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

  return (
    <div className='h-96'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis 
            dataKey='year' 
            tickFormatter={formatYear}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey='count' fill='#0088FE' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
