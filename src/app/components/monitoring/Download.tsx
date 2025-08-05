'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useFilteredData } from '@/app/hooks/useFilteredData'
import { useAuthStore } from '@/app/store/auth'

const DownloadButton = () => {
  const { filteredData, columnFilters } = useFilteredData()
  const { canExportCsv } = useAuthStore()

  if (!filteredData.length || !canExportCsv()) return null

  const formattedData = filteredData.map((row) => {
    const formattedRow: Record<string, any> = { ...row }

    if (formattedRow.DetectionDate) {
      // Consistent UTC date parsing
      formattedRow.DetectionYear = new Date(
        formattedRow.DetectionDate
      ).getUTCFullYear()
    }

    return formattedRow
  })

  const generateFilename = () => {
    const base = 'monitoring-data'
    const date = new Date().toISOString().split('T')[0]

    if (!columnFilters || columnFilters.length === 0) {
      return `${base}-${date}.csv`
    }

    const filterParts = columnFilters
      .map(({ id, value }) => {
        let valueStr = ''
        if (
          id === 'DetectionDate' ||
          id === 'Age' ||
          id === 'MonitorRemoveDate'
        ) {
          let range: [number, number] | null = null
          if (
            Array.isArray(value) &&
            value.length === 2 &&
            typeof value[0] === 'number'
          ) {
            range = value as [number, number]
          } else if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value)
              if (Array.isArray(parsed) && parsed.length === 2) {
                range = parsed
              }
            } catch (e) {
              /* not a json string */
            }
          }
          if (range) {
            valueStr = `${range[0]}-${range[1]}`
          }
        } else if (Array.isArray(value)) {
          valueStr = value.join(',')
        } else if (value !== null && value !== undefined && value !== '') {
          valueStr = String(value)
        }

        if (valueStr) {
          return `${id}=${valueStr}`
        }
        return ''
      })
      .filter(Boolean)

    if (filterParts.length === 0) {
      return `${base}-${date}.csv`
    }

    const filename = `${base}__${filterParts.join('__')}.csv`

    // Sanitize filename
    return filename.replace(/[\s/]/g, '_').replace(/[^a-zA-Z0-9-.,_=]/g, '')
  }

  return (
    <CsvDownload
      delimiter=','
      data={formattedData}
      filename={generateFilename()}
      className='my-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
    >
      Download Filtered Data ({filteredData.length} records)
    </CsvDownload>
  )
}

export default DownloadButton
