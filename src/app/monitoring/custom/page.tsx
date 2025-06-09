'use client'

import React, { useEffect } from 'react'
import Table from '../../components/monitoring/Table'
import Download from '../../components/monitoring/Download'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { useYearRangeStore } from '../../stores/useYearRangeStore'

const CustomPage: React.FC = () => {
  const { results, loading, error } = useMonitoringData()
  const { setMinMaxYears, yearRange } = useYearRangeStore()

  // This effect will update the store with the full date range for this page's data
  useEffect(() => {
    if (results?.length) {
      // Pass the full, unfiltered dataset to establish the correct min/max years
      setMinMaxYears(results)
    }
  }, [results, setMinMaxYears])

  // Memoize default filters to prevent re-renders, now using the dynamic yearRange
  const defaultFilters = React.useMemo(
    () => ({
      DetectionDate: yearRange,
    }),
    [yearRange]
  )

  if (loading) return <div className='p-4'>Loading table data...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  return (
    <div>
      <Download />
      <Table defaultFilters={defaultFilters} />
    </div>
  )
}

export default CustomPage
