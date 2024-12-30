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
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Loader } from '@/app/components/ui/Loader'

const MonitoringChart = () => {
  const { results, loading, error } = useMonitoringData()
  
  // Get min and max years from the data
  const { minYear, maxYear } = useMemo(() => {
    if (!results?.length) return { minYear: 2000, maxYear: 2024 }
    const years = results.map(item => new Date(item.DetectionDate).getFullYear())
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    }
  }, [results])

  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear])

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

  const [selectedFields, setSelectedFields] = useState<
    { value: string; label: string }[]
  >([plottableFields[0]])

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  const processedData = useMemo(() => {
    if (!results) return []

    // First reduce the data by year
    const chartData = results.reduce((acc, item) => {
      const year = new Date(item.DetectionDate).getFullYear()
      
      // Skip if year is outside the selected range
      if (year < yearRange[0] || year > yearRange[1]) return acc
      
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

    // Create array with all consecutive years within the selected range
    const allData = []
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
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
  }, [plottableFields, results, yearRange])

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error loading data</div>

  return (
    <div className='w-full'>
      <div className='mb-8 px-4 relative z-10'>
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

      <div className='mb-8 px-4 relative z-0'>
        <Slider
          range
          min={minYear}
          max={maxYear}
          value={yearRange}
          onChange={(value) => setYearRange(value as [number, number])}
          marks={{
            [minYear]: minYear.toString(),
            [maxYear]: maxYear.toString(),
          }}
        />
      </div>

      <div className='h-96 px-2'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart 
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
