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
  stackId?: string
  yAxisLabel?: string
  onFilterChange?: (hiddenSeries: Set<string>) => void
  showTotal?: boolean
  customOrder?: string[]
  isPercentChart?: boolean
  hiddenSeries?: Set<string>
  onHiddenSeriesChange?: (hiddenSeries: Set<string>) => void
  xAxisDataKey?: string
  xAxisLabel?: string
  xAxisInterval?: number | 'preserveStartEnd'
  xAxisTickAngle?: number
  xAxisTextAnchor?: 'start' | 'middle' | 'end'
}

export const DataChart: React.FC<DataChartProps> = ({
  data,
  stacked = false,
  stackId = 'stack',
  yAxisLabel = 'Number of Mortalities',
  onFilterChange,
  showTotal = true,
  customOrder,
  isPercentChart = false,
  hiddenSeries: controlledHiddenSeries,
  onHiddenSeriesChange,
  xAxisDataKey = 'year',
  xAxisLabel,
  xAxisInterval = 4,
  xAxisTickAngle = -45,
  xAxisTextAnchor = 'end',
}) => {
  const [internalHiddenSeries, setInternalHiddenSeries] = useState<Set<string>>(
    new Set()
  )
  const [showResetButton, setShowResetButton] = useState(false)

  const isControlled =
    controlledHiddenSeries !== undefined && onHiddenSeriesChange !== undefined

  const hiddenSeries = isControlled
    ? controlledHiddenSeries!
    : internalHiddenSeries

  const setHiddenSeries = (newSeries: Set<string>) => {
    if (isControlled) {
      onHiddenSeriesChange!(newSeries)
    } else {
      setInternalHiddenSeries(newSeries)
    }
  }

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
    if (!isControlled) {
      onFilterChange?.(hiddenSeries)
    }
  }, [hiddenSeries, onFilterChange, isControlled])

  // Get all series names (excluding x-axis key)
  const keys = Object.keys(data[0] || {}).filter((key) => key !== xAxisDataKey)
  const sortedKeys = customOrder
    ? keys.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b))
    : keys
  const isMultiSeries = sortedKeys.length > 1

  // Calculate total from visible series
  const totalCount = data.reduce((sum, rowData) => {
    const rowTotal = Object.entries(rowData)
      .filter(([key]) => key !== xAxisDataKey && !hiddenSeries.has(key))
      .reduce((rowSum, [, count]) => rowSum + (count as number), 0)
    return sum + rowTotal
  }, 0)

  const handleLegendClick = (entry: { dataKey?: string }) => {
    const seriesName = entry.dataKey?.toString()
    if (!seriesName) return

    const newHidden = new Set(hiddenSeries)
    if (newHidden.has(seriesName)) {
      newHidden.delete(seriesName)
    } else {
      keys.forEach((name) => newHidden.add(name))
      newHidden.delete(seriesName)
    }
    setHiddenSeries(newHidden)
  }

  const handleBarClick = (data: unknown, index: number) => {
    const seriesName = sortedKeys[index]
    if (seriesName) {
      const newHidden = new Set(hiddenSeries)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        // Hide all except the clicked one
        keys.forEach((name) => newHidden.add(name))
        newHidden.delete(seriesName)
      }
      setHiddenSeries(newHidden)
    }
  }

  const resetVisibility = () => {
    setHiddenSeries(new Set())
  }

  const percentTickFormatter = (tick: number) => `${Math.round(tick * 100)}%`

  return (
    <div className='space-y-4'>
      {showTotal && (
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
                dataKey={xAxisDataKey}
                label={{
                  value:
                    xAxisLabel ||
                    xAxisDataKey.charAt(0).toUpperCase() +
                      xAxisDataKey.slice(1),
                  position: 'insideBottom',
                  offset: -15,
                }}
                interval={xAxisInterval}
                angle={xAxisTickAngle}
                textAnchor={xAxisTextAnchor}
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
                formatter={(value: number, name: string, props: any) => {
                  if (isPercentChart) {
                    // The `props.payload` contains the data for the current x-axis point (the year's data)
                    const total = Object.entries(props.payload || {})
                      // The only change is adding `!hiddenSeries.has(key)` to the filter
                      .filter(
                        ([key]) =>
                          key !== xAxisDataKey && !hiddenSeries.has(key)
                      )
                      .reduce((sum, [, val]) => sum + (val as number), 0)

                    if (total === 0) {
                      return [`0.0%`, name]
                    }
                    const percentage = (value / total) * 100
                    return [`${percentage.toFixed(1)}%`, name]
                  }
                  // Default formatter for non-percentage charts
                  return [value, name]
                }}
              />
              {isMultiSeries && (
                <Legend
                  onClick={(entry) =>
                    handleLegendClick({ dataKey: entry.dataKey?.toString() })
                  }
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
                  stackId={stacked ? stackId : undefined}
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
