'use client'
import { useMonitoringData } from '../../hooks/useMonitoringData.ts'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const Active = () => {
  const { results, loading, error } = useMonitoringData()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const chartData = results
    .filter((item) => item.IsActiveCase)
    .reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<number, number>)

  const formattedData = Object.entries(chartData)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year)

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-6'>Active Cases by Year</h1>
      <div className='h-96 bg-white p-4 rounded shadow'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='year' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='count' fill='#0088FE' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Active
