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
  data: Record<string, unknown>[]
  stacked?: boolean
  yAxisLabel?: string
  onFilterChange?: (hiddenSeries: Set<string>) => void
  showTotal?: boolean
  customOrder?: string[]
  isPercentChart?: boolean
}

export const DataChart: React.FC<DataChartProps> = ({
  data,
  stacked = false,
  yAxisLabel = 'Number of Mortalities',
  onFilterChange,
  showTotal = true,
  customOrder,
  isPercentChart = false,
}) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
    onFilterChange?.(hiddenSeries)
  }, [hiddenSeries, onFilterChange])

  // Get all series names (excluding 'year')
  const keys = Object.keys(data[0] || {}).filter((key) => key !== 'year')
  const sortedKeys = customOrder
    ? keys.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b))
    : keys
  const isMultiSeries = sortedKeys.length > 1

  // Calculate total from visible series
  const totalCount = data.reduce((sum, yearData) => {
    const yearTotal = Object.entries(yearData)
      .filter(([key]) => key !== 'year' && !hiddenSeries.has(key))
      .reduce((yearSum, [, count]) => yearSum + (count as number), 0)
    return sum + yearTotal
  }, 0)

  const handleLegendClick = (entry: { dataKey?: string | number }) => {
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

  const handleBarClick = (data: unknown, index: number) => {
    const seriesName = sortedKeys[index]
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

  const percentTickFormatter = (tick: number) => `${Math.round(tick * 100)}%`
  const percentTooltipFormatter = (value: number) =>
    `${(value * 100).toFixed(1)}%`

  return (
    <div className='space-y-4'>
      {showTotal && !isPercentChart && (
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Total Count: <span className='text-blue-700'>{totalCount}</span>
          </p>
        </div>
      )}
      <div className='relative'>
        <div className='h-[500px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              stackOffset={isPercentChart ? 'expand' : undefined}
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
                  value: isPercentChart ? 'Percentage of Injuries' : yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                }}
                tickFormatter={
                  isPercentChart ? percentTickFormatter : undefined
                }
              />
              <Tooltip
                formatter={
                  isPercentChart
                    ? (value: number, name: string) => [
                        percentTooltipFormatter(value),
                        name,
                      ]
                    : undefined
                }
                itemSorter={(itemA, itemB) => {
                  return (
                    sortedKeys.indexOf(itemB?.name || '') -
                    sortedKeys.indexOf(itemA?.name || '')
                  )
                }}
              />
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
              {sortedKeys.map((key, index) => (
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
  '#9F0162', // deep magenta
  '#009F81', // paolo veronese green
  '#FF5AAF', // brilliant rose
  '#00FCCF', // bright teal
  '#8400CD', // french violet
  '#008DF9', // dodger blue
  '#00C2F9', // spiro disco ball
  '#FFB2FD', // plum
  '#A40122', // strong crimson
  '#E20134', // vivid crimson
  '#FF6E3A', // burning orange
  '#FFC33B', // bright spark
]
