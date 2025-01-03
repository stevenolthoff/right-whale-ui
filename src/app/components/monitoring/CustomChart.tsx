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
import { ChartBarIcon } from '@heroicons/react/24/outline'

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

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <div className="text-red-500 mb-2">Failed to load chart data</div>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className='space-y-6 pt-16'>
      {/* Header Section */}
      <div className='flex items-center justify-between px-4'>
        <div className='flex items-center space-x-3'>
          <ChartBarIcon className='h-6 w-6 text-blue-500' />
          <h2 className='text-xl font-semibold text-gray-900'>
            Custom Monitoring Chart
          </h2>
        </div>
      </div>

      {/* Main Content Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        {loading ? (
          <div className='h-[600px] flex items-center justify-center'>
            <Loader />
          </div>
        ) : (
          <div className='p-6 space-y-6'>
            {/* Controls Section */}
            <div className='space-y-6'>
              <div className='space-y-2 relative z-20'>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Metrics (up to 4)
                </label>
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
                  classNamePrefix='react-select'
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#3b82f6',
                      primary75: '#60a5fa',
                      primary50: '#93c5fd',
                      primary25: '#dbeafe',
                    },
                  })}
                />
              </div>

              <div className='space-y-2 relative z-10'>
                <label className='block text-sm font-medium text-gray-700'>
                  Year Range: {yearRange[0]} - {yearRange[1]}
                </label>
                <div className='px-2 py-4'>
                  <Slider
                    range
                    min={minYear}
                    max={maxYear}
                    value={yearRange}
                    onChange={(value) =>
                      setYearRange(value as [number, number])
                    }
                    marks={{
                      [minYear]: minYear.toString(),
                      [maxYear]: maxYear.toString(),
                    }}
                    railStyle={{ backgroundColor: '#e5e7eb' }}
                    trackStyle={[{ backgroundColor: '#3b82f6' }]}
                    handleStyle={[
                      { borderColor: '#3b82f6', backgroundColor: '#fff' },
                      { borderColor: '#3b82f6', backgroundColor: '#fff' },
                    ]}
                    dotStyle={{ borderColor: '#3b82f6' }}
                    activeDotStyle={{ borderColor: '#3b82f6' }}
                  />
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {selectedFields.length === 0 ? (
              <div className='h-96 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed'>
                <div className='text-center'>
                  <ChartBarIcon className='h-12 w-12 mx-auto text-gray-400 mb-2' />
                  <p>Select metrics above to visualize data</p>
                </div>
              </div>
            ) : (
              <div className='h-96 mt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={processedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                    <XAxis
                      dataKey='year'
                      tick={{ fill: '#6b7280' }}
                      tickLine={{ stroke: '#6b7280' }}
                    />
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
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px',
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonitoringChart
