'use client'

import React, { ReactNode } from 'react'
import { ExportChart } from '../monitoring/ExportChart'
import { Loader } from '../ui/Loader'
import { ErrorMessage } from '../ui/ErrorMessage'
import ChartAttribution from './ChartAttribution'
interface ChartLayoutProps {
  title: string
  subtitle?: string
  chartRef: React.RefObject<HTMLDivElement>
  exportFilename: string
  totalCount?: number
  yearRange?: [number, number]
  controls?: ReactNode
  children: ReactNode
  description?: string
  loading?: boolean
  error?: string
}

export function ChartLayout({
  title,
  subtitle,
  chartRef,
  exportFilename,
  totalCount,
  yearRange,
  controls,
  children,
  description,
  loading,
  error,
}: ChartLayoutProps) {
  if (loading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  return (
    <div className='space-y-6 bg-white p-6 md:p-8 rounded-lg'>
      {/* Chart Controls */}
      {controls && (
        <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-slate-50 p-4 rounded-lg'>
          <div className='flex-grow max-w-2xl'>{controls}</div>
          <ExportChart
            chartRef={chartRef}
            filename={exportFilename}
            title={title}
            caption={
              yearRange
                ? `Data from ${yearRange[0]} to ${yearRange[1]}`
                : undefined
            }
          />
        </div>
      )}

      {/* Chart Section */}
      <div ref={chartRef} className='bg-white rounded-lg'>
        <div className='text-center space-y-2 mb-8'>
          <h2 className='text-2xl font-bold text-blue-900'>{title}</h2>
          <div className='flex flex-col md:flex-row items-center justify-center gap-3 text-slate-500'>
            {subtitle && <p className='text-sm'>{subtitle}</p>}
            {yearRange && (
              <>
                {subtitle && <span className='hidden md:block'>•</span>}
                <p className='text-sm'>
                  Data from {yearRange[0]} to {yearRange[1]}
                </p>
              </>
            )}
            {totalCount !== undefined && (
              <>
                <span className='hidden md:block'>•</span>
                <p className='text-sm font-medium'>
                  Total Count:{' '}
                  <span className='text-blue-600'>{totalCount}</span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className='h-[600px] mt-4'>{children}</div>

        {/* Legend or Additional Info */}
        <div className='mt-6 pt-6 border-t border-slate-100 text-center'>
          <div className='text-sm text-slate-500'>
            {description}
            {description && <br />}
            <ChartAttribution />
          </div>
        </div>
      </div>
    </div>
  )
}
