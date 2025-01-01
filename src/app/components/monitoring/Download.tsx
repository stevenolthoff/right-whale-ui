'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useFilteredData } from '@/app/hooks/useFilteredData'

const DownloadButton = () => {
  const { filteredData, columns } = useFilteredData()

  if (!filteredData.length) return null

  const formattedData = filteredData.map(row => {
    const formattedRow: Record<string, any> = {}
    columns.forEach(column => {
      const accessorFn = (column as any).accessorFn
      const accessorKey = (column as any).accessorKey

      const key = accessorKey || column.id
      if (!key) return

      const header = typeof column.header === 'string' 
        ? column.header 
        : key

      const value = accessorFn ? accessorFn(row) : row[key as keyof typeof row]
      
      if (key === 'DetectionDate' && value) {
        formattedRow[header] = new Date(value as string).getFullYear()
      } else if (key === 'IsActiveCase') {
        formattedRow[header] = value ? 'Yes' : 'No'
      } else {
        formattedRow[header] = value || 'N/A'
      }
    })
    return formattedRow
  })

  return (
    <CsvDownload
      delimiter=','
      data={formattedData}
      filename='monitoring-data.csv'
      className='ml-10 mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
    >
      Download Filtered Data ({filteredData.length} records)
    </CsvDownload>
  )
}

export default DownloadButton
