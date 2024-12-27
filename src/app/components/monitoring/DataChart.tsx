import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  year: number
  count: number
}

interface DataChartProps {
  data: ChartData[]
}

export const DataChart = ({ data }: DataChartProps) => (
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
