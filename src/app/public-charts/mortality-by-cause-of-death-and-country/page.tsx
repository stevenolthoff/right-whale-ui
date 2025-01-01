'use client'
import React, { useState, useEffect, useRef } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'

const BAR_COLORS: Record<string, string> = {
  'Entanglement_CA': '#b33dc6',
  'Entanglement_US': '#27aeef', 
  'Vessel Strike_CA': '#edbf33',
  'Vessel Strike_US': '#bdcf32',
}

const FOCUSED_CAUSES = ['Entanglement', 'Vessel Strike']

export default function MortalityByCauseAndCountry() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(
    loading ? null : data,
    item => FOCUSED_CAUSES.includes(item.causeOfDeath)
  )
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
  }, [hiddenSeries])

  const chartData = (() => {
    if (!data) return []

    const countries = Array.from(new Set(data.map(item => item.country)))
      .sort((a, b) => a.localeCompare(b))

    const yearData = new Map<number, Record<string, number>>()
    
    data
      .filter(item => 
        item.year >= yearRangeProps.yearRange[0] && 
        item.year <= yearRangeProps.yearRange[1] && 
        FOCUSED_CAUSES.includes(item.causeOfDeath)
      )
      .forEach(item => {
        const key = `${item.causeOfDeath}_${item.country}`
        if (!yearData.has(item.year)) {
          const initialData: Record<string, number> = {}
          FOCUSED_CAUSES.forEach(cause => {
            countries.forEach(country => {
              initialData[`${cause}_${country}`] = 0
            })
          })
          yearData.set(item.year, initialData)
        }
        const yearCounts = yearData.get(item.year)!
        yearCounts[key]++
      })

    const formattedData = []
    for (let year = yearRangeProps.yearRange[0]; year <= yearRangeProps.yearRange[1]; year++) {
      if (yearData.has(year)) {
        formattedData.push({
          year,
          ...yearData.get(year)
        })
      }
    }
    
    return formattedData.sort((a, b) => a.year - b.year)
  })()

  const countries = Array.from(new Set(data?.map(item => item.country) || []))
    .sort((a, b) => a.localeCompare(b))

  const allSeries = Object.keys(chartData[0] || {}).filter(key => key !== 'year')
  const totalMortalities = chartData.reduce((sum, item) => 
    sum + Object.values(item).reduce((a, b) => typeof b === 'number' ? a + b : a, 0) - item.year
  , 0)

  const handleLegendClick = (entry: { dataKey: string }) => {
    const seriesName = entry.dataKey
    setHiddenSeries(prev => {
      const newHidden = new Set(prev)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        allSeries.forEach(name => newHidden.add(name))
        newHidden.delete(seriesName)
      }
      return newHidden
    })
  }

  const handleBarClick = (data: any, index: number) => {
    const seriesName = allSeries[index]
    if (seriesName) {
      setHiddenSeries(prev => {
        const newHidden = new Set(prev)
        if (newHidden.has(seriesName)) {
          newHidden.delete(seriesName)
        } else {
          allSeries.forEach(name => newHidden.add(name))
          newHidden.delete(seriesName)
        }
        return newHidden
      })
    }
  }

  return (
    <ChartLayout
      title="Right Whale Mortalities by Cause of Death and Country"
      chartRef={chartRef}
      exportFilename={`mortality-by-cause-and-country-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={totalMortalities}
      loading={loading}
      error={error}
      description="Data represents confirmed mortalities of North Atlantic Right Whales by cause of death and country. Click on legend items or bars to focus on specific categories."
      controls={
        <>
          <label className='block text-sm font-medium text-slate-600 mb-2'>
            Select Year Range
          </label>
          <YearRangeSlider
            yearRange={yearRangeProps.yearRange}
            minYear={yearRangeProps.minYear}
            maxYear={yearRangeProps.maxYear}
            onChange={yearRangeProps.setYearRange}
          />
        </>
      }
    >
      <div className="relative h-[600px] mb-8">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
            />
            <YAxis
              label={{
                value: 'Number of Mortalities',
                angle: -90,
                position: 'insideLeft',
                offset: 15,
              }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} mortalities`, name]}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend 
              onClick={(data) => {
                if (data.dataKey) {
                  handleLegendClick({ dataKey: data.dataKey.toString() })
                }
              }}
              wrapperStyle={{ 
                cursor: 'pointer',
                paddingTop: '20px',
                bottom: '40px'
              }}
              verticalAlign="bottom"
              align="center"
              formatter={(value: string) => {
                const [cause, country] = value.split('_')
                return `${country} (${cause})`
              }}
            />
            {FOCUSED_CAUSES.map((cause) => (
              countries.map(country => (
                <Bar
                  key={`${cause}_${country}`}
                  dataKey={`${cause}_${country}`}
                  name={`${cause}_${country}`}
                  stackId={cause}
                  fill={BAR_COLORS[`${cause}_${country}`] || '#ea5545'}
                  hide={hiddenSeries.has(`${cause}_${country}`)}
                  onClick={(data) => handleBarClick(data, allSeries.indexOf(`${cause}_${country}`))}
                  style={{ cursor: 'pointer' }}
                />
              ))
            ))}
          </BarChart>
        </ResponsiveContainer>
        
        {showResetButton && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setHiddenSeries(new Set())}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </ChartLayout>
  )
}
