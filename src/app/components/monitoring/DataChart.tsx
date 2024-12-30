import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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

export const DataChart = ({ data, stacked = false }: DataChartProps) => {
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
    
    return (
      <div className='h-96'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis 
              dataKey='year' 
              tickFormatter={formatYear}
              interval={window.innerWidth < 1200 ? 2 : 1}  // Show every third tick on smaller screens
              angle={-45}  // Steeper angle
              textAnchor="end"
              height={80}  // More height for labels
              fontSize={12}  // Smaller font
              minTickGap={10}  // Minimum pixels between ticks
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                stackId="a" 
                fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'][index % 6]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
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
            interval={0} // Force display all ticks
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey='count' fill='#0088FE' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
