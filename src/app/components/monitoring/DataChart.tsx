'use client'
import React, { useState, useEffect } from 'react'
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
  yAxisLabel?: string
  onFilterChange?: (hiddenSeries: Set<string>) => void
}

export const DataChart: React.FC<DataChartProps> = ({
  data,
  stacked = false,
  yAxisLabel = 'Number of Mortalities',
  onFilterChange,
}) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
    onFilterChange?.(hiddenSeries)
  }, [hiddenSeries, onFilterChange])

  // Get all series names (excluding 'year')
  const keys = Object.keys(data[0] || {}).filter((key) => key !== 'year')
  const isMultiSeries = keys.length > 1

  // Calculate total from visible series
  const totalCount = data.reduce((sum, yearData) => {
    const yearTotal = Object.entries(yearData)
      .filter(([key]) => key !== 'year' && !hiddenSeries.has(key))
      .reduce((yearSum, [_, count]) => yearSum + (count as number), 0)
    return sum + yearTotal
  }, 0)

  const handleLegendClick = (entry: any, index: number) => {
    const seriesName = entry.dataKey?.toString()
    if (!seriesName) return

    setHiddenSeries((prev) => {
      const newHidden = new Set(prev)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        keys.forEach((name) => newHidden.add(name))
        newHidden.delete(seriesName)
      }
      return newHidden
    })
  }

  const handleBarClick = (data: any, index: number) => {
    const seriesName = keys[index]
    if (seriesName) {
      setHiddenSeries((prev) => {
        const newHidden = new Set(prev)
        if (newHidden.has(seriesName)) {
          newHidden.delete(seriesName)
        } else {
          // Hide all except the clicked one
          keys.forEach((name) => newHidden.add(name))
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
    <div className='space-y-4'>
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          Total Count: <span className='text-blue-700'>{totalCount}</span>
        </p>
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
                bottom: isMultiSeries ? 90 : 70, // Extra space for legend when needed
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='year'
                label={{
                  value: 'Year',
                  position: 'insideBottom',
                  offset: -15,
                }}
                interval={4}
                angle={-45}
                textAnchor='end'
                height={60}
                tickMargin={10}
              />
              <YAxis
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 15,
                }}
              />
              <Tooltip />
              {isMultiSeries && (
                <Legend
                  onClick={handleLegendClick}
                  wrapperStyle={{
                    cursor: 'pointer',
                    paddingTop: '20px',
                  }}
                  verticalAlign='bottom'
                  align='center'
                />
              )}
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? 'stack' : undefined}
                  fill={COLORS[index % COLORS.length]}
                  name={key}
                  hide={hiddenSeries.has(key)}
                  onClick={
                    isMultiSeries
                      ? (data) => handleBarClick(data, index)
                      : undefined
                  }
                  style={isMultiSeries ? { cursor: 'pointer' } : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {showResetButton && isMultiSeries && (
        <div className='flex justify-center'>
          <button
            onClick={resetVisibility}
            className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Show All
          </button>
        </div>
      )}
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
