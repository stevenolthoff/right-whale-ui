'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useMonitoringData } from '../../hooks/useMonitoringData.ts'

const DownloadButton = () => {
  const { results, loading, error } = useMonitoringData()

  if (loading || error || !results) return null

  return (
    <CsvDownload
      delimiter=','
      data={results}
      filename='monitoring-data.csv'
      className='ml-10 mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
    >
      Download CSV
    </CsvDownload>
  )
}

export default DownloadButton
