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

// Color palette for different causes of death
const COLORS = [
  '#27aeef', // blue
  '#bdcf32', // green
  '#b33dc6', // purple
  '#edbf33', // yellow
  '#87bc45', // lime
  '#ea5545', // red
  '#ef9b20', // orange
  '#9b19f5', // violet
]

const formatChartDataForCountry = (
  data: any[] | null,
  yearRange: [number, number],
  targetCountry: string
) => {
  if (!data) return { data: [], causes: [] }

  // Get all unique causes of death
  const causes = Array.from(
    new Set(data.map((item) => item.causeOfDeath))
  ).sort((a, b) => a.localeCompare(b))

  const yearData = new Map<number, Record<string, number>>()

  data
    .filter(
      (item) =>
        item.year >= yearRange[0] &&
        item.year <= yearRange[1] &&
        item.country === targetCountry
    )
    .forEach((item) => {
      if (!yearData.has(item.year)) {
        const initialData: Record<string, number> = {}
        causes.forEach((cause) => {
          initialData[cause] = 0
        })
        yearData.set(item.year, initialData)
      }
      const yearCounts = yearData.get(item.year)!
      yearCounts[item.causeOfDeath]++
    })

  const formattedData = []
  for (let year = yearRange[0]; year <= yearRange[1]; year++) {
    formattedData.push({
      year,
      ...(yearData.get(year) || Object.fromEntries(causes.map((c) => [c, 0]))),
    })
  }

  return {
    data: formattedData.sort((a, b) => a.year - b.year),
    causes,
  }
}

export default function MortalityByCauseAndCountry() {
  const chartRefUS = useRef<HTMLDivElement>(null)
  const chartRefCA = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(data)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
  }, [hiddenSeries])

  const usChartData = formatChartDataForCountry(
    data,
    yearRangeProps.yearRange,
    'US'
  )
  const canadaChartData = formatChartDataForCountry(
    data,
    yearRangeProps.yearRange,
    'Canada'
  )

  const getTotalMortalities = (chartData: any[]) =>
    chartData.reduce(
      (sum, item) =>
        sum +
        Object.values(item).reduce(
          (a: number, b: unknown) => (typeof b === 'number' ? a + b : a),
          0
        ) -
        item.year,
      0
    )

  const handleLegendClick = (entry: { dataKey: string }, causes: string[]) => {
    const seriesName = entry.dataKey
    setHiddenSeries((prev) => {
      const newHidden = new Set(prev)
      if (newHidden.has(seriesName)) {
        newHidden.delete(seriesName)
      } else {
        causes.forEach((name) => newHidden.add(name))
        newHidden.delete(seriesName)
      }
      return newHidden
    })
  }

  const handleBarClick = (data: any, index: number, causes: string[]) => {
    const seriesName = causes[index]
    if (seriesName) {
      setHiddenSeries((prev) => {
        const newHidden = new Set(prev)
        if (newHidden.has(seriesName)) {
          newHidden.delete(seriesName)
        } else {
          causes.forEach((name) => newHidden.add(name))
          newHidden.delete(seriesName)
        }
        return newHidden
      })
    }
  }

  const ChartComponent = ({
    chartData,
    title,
    chartRef,
    country,
  }: {
    chartData: { data: any[]; causes: string[] }
    title: string
    chartRef: React.RefObject<HTMLDivElement>
    country: string
  }) => (
    <ChartLayout
      title={title}
      chartRef={chartRef}
      exportFilename={`mortality-${country.toLowerCase()}-${
        yearRangeProps.yearRange[0]
      }-${yearRangeProps.yearRange[1]}.png`}
      yearRange={yearRangeProps.yearRange}
      totalCount={getTotalMortalities(chartData.data)}
      loading={loading}
      error={error}
      description={`Data represents confirmed mortalities of North Atlantic Right Whales in ${country} by cause of death. Click on legend items or bars to focus on specific categories.`}
    >
      <div className='relative h-[600px]'>
        <ResponsiveContainer width='100%' height='90%'>
          <BarChart
            data={chartData.data}
            margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='year'
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
              formatter={(value: number, name: string) => [
                `${value} mortalities`,
                name,
              ]}
              labelFormatter={(label: number) => `Year: ${label}`}
            />
            <Legend
              onClick={(data) => {
                if (data.dataKey) {
                  handleLegendClick(
                    { dataKey: data.dataKey.toString() },
                    chartData.causes
                  )
                }
              }}
              wrapperStyle={{
                cursor: 'pointer',
                paddingTop: '20px',
                bottom: '40px',
              }}
              verticalAlign='bottom'
              align='center'
            />
            {chartData.causes.map((cause, index) => (
              <Bar
                key={cause}
                dataKey={cause}
                name={cause}
                stackId='stack'
                fill={COLORS[index % COLORS.length]}
                hide={hiddenSeries.has(cause)}
                onClick={(data) =>
                  handleBarClick(data, index, chartData.causes)
                }
                style={{ cursor: 'pointer' }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {showResetButton && (
          <div className='absolute -bottom-4 left-1/2 -translate-x-1/2'>
            <button
              onClick={() => setHiddenSeries(new Set())}
              className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </ChartLayout>
  )

  return (
    <div className='space-y-8'>
      <div className='mb-6'>
        <label className='block text-sm font-medium text-slate-600 mb-2'>
          Select Year Range
        </label>
        <YearRangeSlider
          yearRange={yearRangeProps.yearRange}
          minYear={yearRangeProps.minYear}
          maxYear={yearRangeProps.maxYear}
          onChange={yearRangeProps.setYearRange}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <ChartComponent
          chartData={usChartData}
          title='US Right Whale Mortalities'
          chartRef={chartRefUS}
          country='US'
        />
        <ChartComponent
          chartData={canadaChartData}
          title='Canadian Right Whale Mortalities'
          chartRef={chartRefCA}
          country='Canada'
        />
      </div>
    </div>
  )
}
