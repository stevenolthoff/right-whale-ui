'use client'
import React, { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
} from 'recharts'

interface PopulationChartProps {
  data: {
    year: number
    estimate: number
    lower: number
    upper: number
  }[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number | number[]
    dataKey: string
    name: string
  }>
  label?: number
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const estimateData = payload.find((p) => p.dataKey === 'estimate')
    const areaData = payload.find((p) => p.dataKey === 'areaPoints')
    const [lower, upper] = (areaData?.value as number[]) || []

    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg min-w-[160px]'>
        <table className='w-full'>
          <tbody>
            <tr>
              <td className='text-sm font-medium text-gray-900 pr-2 text-right'>
                Year:
              </td>
              <td className='text-sm font-medium text-gray-900 pl-2'>
                {label}
              </td>
            </tr>
            <tr>
              <td className='text-sm text-gray-600 pr-2 text-right'>Upper:</td>
              <td className='text-sm text-gray-600 pl-2'>{upper || 'N/A'}</td>
            </tr>
            <tr>
              <td className='text-sm text-gray-600 pr-2 text-right'>
                Estimate:
              </td>
              <td className='text-sm text-gray-600 pl-2'>
                {estimateData?.value || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className='text-sm text-gray-600 pr-2 text-right'>Lower:</td>
              <td className='text-sm text-gray-600 pl-2'>{lower || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  return null
}

export const PopulationChart: React.FC<PopulationChartProps> = ({ data }) => {
  // Calculate Y-axis domain with some padding
  const yDomain = useMemo(() => {
    if (!data.length) return [0, 500]
    const minValue = Math.min(...data.map((d) => d.lower))
    const maxValue = Math.max(...data.map((d) => d.upper))
    const range = maxValue - minValue
    const padding = range * 0.1 // 10% padding
    return [
      Math.floor((minValue - padding) / 10) * 10, // Round down to nearest 10
      Math.ceil((maxValue + padding) / 10) * 10, // Round up to nearest 10
    ]
  }, [data])

  // Transform data to include areaPoints for shading
  const transformedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      // For the area, we'll use the difference between upper and lower
      areaPoints: [d.lower, d.upper],
    }))
  }, [data])

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <ComposedChart
        data={transformedData}
        margin={{
          top: 20,
          right: 30,
          left: 40,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
        <XAxis
          dataKey='year'
          label={{
            value: 'Year',
            position: 'insideBottom',
            offset: -10,
          }}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis
          domain={yDomain}
          label={{
            value: 'Population Estimate',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
          }}
          tick={{ fill: '#6B7280' }}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Confidence interval area */}
        <Area
          type='monotone'
          dataKey='areaPoints'
          fill='#10B981'
          fillOpacity={0.2}
          stroke='none'
          name='Confidence Interval'
        />

        {/* Main population estimate line */}
        <Line
          type='monotone'
          dataKey='estimate'
          name='Estimate'
          stroke='#10B981'
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
