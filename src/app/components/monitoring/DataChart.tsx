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
  ResponsiveContainer,
} from 'recharts'

interface DataChartProps {
  data: any[]
  stacked?: boolean
}

export const DataChart: React.FC<DataChartProps> = ({ data, stacked = false }) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  // Get all series names (excluding 'year')
  const keys = Object.keys(data[0] || {}).filter((key) => key !== 'year')

  const handleLegendClick = (entry: { dataKey: string }) => {
    const seriesName = entry.dataKey
    setHiddenSeries((prev) => {
      const newHidden = new Set(prev)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        newHidden.add(seriesName)
      }
      return newHidden
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        {/* ... legend buttons ... */}
      </div>
      <div className='relative'>
        <div className='h-[500px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 70,  // Increased to accommodate rotated labels
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis 
                dataKey="year"
                label={{ 
                  value: 'Year', 
                  position: 'insideBottom', 
                  offset: -15
                }}
                interval={4}  // Show every 4th tick
                angle={-45}   // Rotate labels
                textAnchor="end"  // Align rotated text
                height={60}   // Increase height for rotated labels
                tickMargin={10}  // Add margin between ticks and axis
              />
              <YAxis
                label={{
                  value: 'Number of Mortalities',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 15,
                }}
              />
              <Tooltip />
              {keys.map((key, index) => (
                <Bar
                  key={key} 
                  dataKey={key} 
                  stackId={stacked ? 'stack' : undefined}
                  fill={COLORS[index % COLORS.length]}
                  name={key}
                  hide={hiddenSeries.has(key)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
]
