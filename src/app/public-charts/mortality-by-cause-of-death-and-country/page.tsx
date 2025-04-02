'use client'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useMortalityData } from '@/app/hooks/useMortalityData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useMortalityYearRange } from '@/app/hooks/useMortalityYearRange'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import { ExportChart } from '@/app/components/monitoring/ExportChart'

const COLORS = [
  '#9F0162', // deep magenta
  '#009F81', // paolo veronese green
  '#FF5AAF', // brilliant rose
  '#00FCCF', // bright teal
  '#8400CD', // french violet
  '#008DF9', // dodger blue
  '#00C2F9', // spiro disco ball
  '#FFB2FD', // plum
  '#A40122', // strong crimson
  '#E20134', // vivid crimson
  '#FF6E3A', // burning orange
  '#FFC33B', // bright spark
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
  const chartRef = useRef<HTMLDivElement>(null)
  const chartRefUS = useRef<HTMLDivElement>(null)
  const chartRefCA = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useMortalityData()
  const yearRangeProps = useMortalityYearRange(data)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showResetButton, setShowResetButton] = useState(false)
  const [isSideBySide, setIsSideBySide] = useState(true)

  useEffect(() => {
    setShowResetButton(hiddenSeries.size > 0)
  }, [hiddenSeries])

  const usChartData = useMemo(() => {
    const result = formatChartDataForCountry(
      data,
      yearRangeProps.yearRange,
      'US'
    )
    return result
  }, [data, yearRangeProps.yearRange])

  const canadaChartData = useMemo(() => {
    const result = formatChartDataForCountry(
      data,
      yearRangeProps.yearRange,
      'Canada'
    )
    return result
  }, [data, yearRangeProps.yearRange])

  const getTotalMortalities = useMemo(
    () => (chartData: any[]) => {
      const result = chartData.reduce(
        (sum, item) =>
          sum +
          Object.values(item).reduce(
            (a: number, b: unknown) => (typeof b === 'number' ? a + b : a),
            0
          ) -
          item.year,
        0
      )
      return result
    },
    []
  )

  const handleLegendClick = useCallback(
    (entry: { dataKey: string }, causes: string[]) => {
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
    },
    []
  )

  const handleBarClick = useCallback(
    (data: any, index: number, causes: string[]) => {
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
    },
    []
  )

  const handleResetClick = useCallback(() => {
    setHiddenSeries(new Set())
  }, [])

  const yearRangeControl = useMemo(
    () => (
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
    ),
    [
      yearRangeProps.yearRange,
      yearRangeProps.minYear,
      yearRangeProps.maxYear,
      yearRangeProps.setYearRange,
    ]
  )

  const ChartComponent = React.memo(
    ({
      chartData,
      title,
      chartRef,
      country,
      onLegendClick,
      onBarClick,
      onResetClick,
      hiddenSeries,
      showResetButton,
      yearRange,
    }: {
      chartData: { data: any[]; causes: string[] }
      title: string
      chartRef: React.RefObject<HTMLDivElement>
      country: string
      onLegendClick: (entry: { dataKey: string }, causes: string[]) => void
      onBarClick: (data: any, index: number, causes: string[]) => void
      onResetClick: () => void
      hiddenSeries: Set<string>
      showResetButton: boolean
      yearRange: [number, number]
    }) => {
      return (
        <ChartLayout
          title={title}
          chartRef={chartRef}
          exportFilename={`mortality-${country.toLowerCase()}-${yearRange[0]}-${
            yearRange[1]
          }.png`}
          yearRange={yearRange}
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
                  label={{
                    value: 'Year',
                    position: 'insideBottom',
                    offset: -15,
                  }}
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
                      onLegendClick(
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
                      onBarClick(data, index, chartData.causes)
                    }
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>

            {showResetButton && (
              <div className='absolute -bottom-4 left-1/2 -translate-x-1/2'>
                <button
                  onClick={onResetClick}
                  className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Show All
                </button>
              </div>
            )}
          </div>
        </ChartLayout>
      )
    }
  )

  return (
    <div className='space-y-8'>
      <div className='flex justify-center mb-4'>
        <button
          onClick={() => setIsSideBySide(!isSideBySide)}
          className='hidden lg:block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {isSideBySide
            ? 'Switch to Vertical Layout'
            : 'Switch to Side by Side'}
        </button>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex-grow'>{yearRangeControl}</div>
        <ExportChart
          chartRef={chartRef}
          filename={`right-whale-mortality-analysis-${yearRangeProps.yearRange[0]}-${yearRangeProps.yearRange[1]}.png`}
          title='Right Whale Mortality Analysis'
          caption={`Data from ${yearRangeProps.yearRange[0]} to ${yearRangeProps.yearRange[1]}`}
        />
      </div>

      <div ref={chartRef} className='w-full'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-1'>
            Right Whale Mortality Analysis
          </h2>
          <p className='text-sm text-gray-600'>
            Data from {yearRangeProps.yearRange[0]} to{' '}
            {yearRangeProps.yearRange[1]}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 ${
            isSideBySide ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-8`}
        >
          <ChartComponent
            chartData={usChartData}
            title='US Right Whale Mortalities'
            chartRef={chartRefUS}
            country='US'
            onLegendClick={handleLegendClick}
            onBarClick={handleBarClick}
            onResetClick={handleResetClick}
            hiddenSeries={hiddenSeries}
            showResetButton={showResetButton}
            yearRange={yearRangeProps.yearRange}
          />
          <ChartComponent
            chartData={canadaChartData}
            title='Canadian Right Whale Mortalities'
            chartRef={chartRefCA}
            country='Canada'
            onLegendClick={handleLegendClick}
            onBarClick={handleBarClick}
            onResetClick={handleResetClick}
            hiddenSeries={hiddenSeries}
            showResetButton={showResetButton}
            yearRange={yearRangeProps.yearRange}
          />
        </div>
      </div>
    </div>
  )
}
