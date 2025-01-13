'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useFilteredData } from '@/app/hooks/useFilteredData'

const DownloadButton = () => {
  const { filteredData, columns } = useFilteredData()

  if (!filteredData.length) return null

  const formattedData = filteredData.map(row => {
    const formattedRow: Record<string, any> = { ...row }

    if (formattedRow.DetectionDate) {
      formattedRow.DetectionYear = new Date(
        formattedRow.DetectionDate
      ).getFullYear()
    }

    return formattedRow
  })

  return (
    <CsvDownload
      delimiter=','
      data={formattedData}
      filename='monitoring-data.csv'
      className='my-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
    >
      Download Filtered Data ({filteredData.length} records)
    </CsvDownload>
  )
}

export default DownloadButton
