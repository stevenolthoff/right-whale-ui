'use client'

import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Select from 'react-select'
import { useMonitoringData } from '../../hooks/useMonitoringData'

const MonitoringChart = () => {
  const plottableFields = useMemo(
    () => [
      { value: 'FirstYearSighted', label: 'First Year Sighted' },
      { value: 'IsUnusualMortalityEvent', label: 'Unusual Mortality Events' },
      { value: 'IsDead', label: 'Mortality Count' },
      { value: 'HasNecropsyReport', label: 'Necropsy Reports' },
      { value: 'HasCaseStudy', label: 'Case Studies' },
      { value: 'IsActiveCase', label: 'Active Cases' },
    ],
    []
  )
  const { results, loading, error } = useMonitoringData()
  const [selectedFields, setSelectedFields] = useState<
    { value: string; label: string }[]
  >([plottableFields[0]])

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  const processedData = useMemo(() => {
    if (!results) return []

    // First reduce the data by year
    const chartData = results.reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      if (!acc[year]) {
        acc[year] = {
          year,
          ...plottableFields.reduce(
            (fields, field) => ({
              ...fields,
              [field.value]: 0,
            }),
            {}
          ),
        }
      }

      plottableFields.forEach((field) => {
        acc[year][field.value] +=
          (item as Record<string, any>)[field.value] === true ? 1 : Number((item as Record<string, any>)[field.value]) || 0
      })

      return acc
    }, {} as Record<string, any>)

    // Get min and max years from the data
    const years = Object.keys(chartData).map(Number)
    const minDataYear = Math.min(...years)
    const maxDataYear = Math.max(...years)
    
    // Create array with all consecutive years
    const allData = []
    for (let year = minDataYear; year <= maxDataYear; year++) {
      allData.push(
        chartData[year] || {
          year,
          ...plottableFields.reduce(
            (fields, field) => ({
              ...fields,
              [field.value]: 0,
            }),
            {}
          ),
        }
      )
    }
    
    return allData.sort((a, b) => a.year - b.year)
  }, [plottableFields, results])

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error loading data</div>

  return (
    <div className='w-full p-4'>
      <div className='mb-4'>
        <Select
          isMulti
          options={plottableFields}
          value={selectedFields}
          onChange={(selected) =>
            setSelectedFields(selected ? selected.slice(0, 4) : [])
          }
          className='w-full'
          placeholder='Select up to 4 metrics to display'
          maxMenuHeight={200}
        />
      </div>

      <div className='h-96'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart 
            data={processedData}
            margin={{ top: 5, right: 45, left: 45, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='year' />
            {selectedFields.map((field, index) => (
              <YAxis
                key={field.value}
                yAxisId={field.value}
                orientation={index % 2 === 0 ? 'left' : 'right'}
                stroke={colors[index]}
                tick={{ fill: colors[index] }}
                axisLine={{ stroke: colors[index] }}
                label={{
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: colors[index] },
                }}
              />
            ))}
            {selectedFields.map((field, index) => (
              <Line
                key={field.value}
                type='monotone'
                dataKey={field.value}
                name={field.label}
                stroke={colors[index]}
                yAxisId={field.value}
                dot={true}
                strokeWidth={3}
              />
            ))}
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MonitoringChart
