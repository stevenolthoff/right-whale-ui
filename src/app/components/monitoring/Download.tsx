'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useFilteredData } from '@/app/hooks/useFilteredData'

const DownloadButton = () => {
  const filteredData = useFilteredData((state) => state.filteredData)

  if (!filteredData.length) return null

  return (
    <CsvDownload
      delimiter=','
      data={filteredData}
      filename='monitoring-data.csv'
      className='ml-10 mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
    >
      Download Filtered Data ({filteredData.length} records)
    </CsvDownload>
  )
}

export default DownloadButton
