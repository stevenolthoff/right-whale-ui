'use client'
import React, { useState, useEffect } from 'react'
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
  const [yearRange, setYearRange] = useState([0, 0])
  const [minYear, setMinYear] = useState(0)
  const [maxYear, setMaxYear] = useState(0)

  useEffect(() => {
    if (results.length > 0) {
      const years = results
        .filter((item) => item.IsActiveCase)
        .map((item) => new Date(item.DetectionDate).getFullYear())

      const min = Math.min(...years)
      const max = Math.max(...years)

      setMinYear(min)
      setMaxYear(max)
      setYearRange([min, max])
    }
  }, [results])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const chartData = results
    .filter((item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      return item.IsActiveCase && year >= yearRange[0] && year <= yearRange[1]
    })
    .reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<number, number>)

  const formattedData = Object.entries(chartData)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year)

  return (
    <div className='flex flex-col space-y-4 bg-white p-4'>
      <div className='flex items-center space-x-4'>
        <span className='text-sm text-gray-600'>{yearRange[0]}</span>
        <input
          type='range'
          min={minYear}
          max={maxYear}
          value={yearRange[0]}
          onChange={(e) =>
            setYearRange([parseInt(e.target.value), yearRange[1]])
          }
          className='flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer'
        />
        <span className='text-sm text-gray-600'>{yearRange[1]}</span>
        <input
          type='range'
          min={minYear}
          max={maxYear}
          value={yearRange[1]}
          onChange={(e) =>
            setYearRange([yearRange[0], parseInt(e.target.value)])
          }
          className='flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer'
        />
      </div>

      <div className='h-96'>
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
