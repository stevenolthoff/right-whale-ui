'use client'

import React from 'react'
import CsvDownload from 'react-json-to-csv'
import { useAuthStore } from '@/app/store/auth'
import type { Table as TanstackTable } from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'

interface InjuryDownloadButtonProps {
  table: TanstackTable<WhaleInjury>
  filename: string
  className?: string
}

export const InjuryDownloadButton: React.FC<InjuryDownloadButtonProps> = ({
  table,
  filename,
  className,
}) => {
  const { canExportCsv } = useAuthStore()
  const filteredData = table.getFilteredRowModel().rows.map((row) => row.original)

  if (!filteredData.length || !canExportCsv()) return null

  return (
    <CsvDownload
      data={filteredData}
      filename={filename}
      className={
        className ||
        'mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
      }
    >
      Download Filtered Data ({filteredData.length} records)
    </CsvDownload>
  )
} 
