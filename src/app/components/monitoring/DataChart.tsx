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

interface StackedChartData {
  year: number
  [key: string]: number | string  // Allow for dynamic injury type keys
}

interface DataChartProps {
  data: SimpleChartData[] | StackedChartData[]
  stacked?: boolean
}

export const DataChart = ({ data, stacked = false }: DataChartProps) => {
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
            <XAxis dataKey='year' />
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
          <XAxis dataKey='year' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='count' fill='#0088FE' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
