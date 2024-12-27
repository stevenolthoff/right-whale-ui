import { useState, useEffect, useCallback } from 'react'
interface DataItem {
  DetectionDate: string
  [key: string]: string | number | boolean | null
}

export const useYearRange = (
  data: DataItem[],
  filterCondition: (item: DataItem) => boolean
) => {
  const [years, setYears] = useState<{
    min: number
    max: number
    range: [number, number]
  }>({
    min: 0,
    max: 0,
    range: [0, 0],
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFilter = useCallback(filterCondition, [])

  useEffect(() => {
    if (data.length > 0) {
      const filteredYears = data
        .filter(memoizedFilter)
        .map((item) => new Date(item.DetectionDate).getFullYear())

      if (filteredYears.length > 0) {
        const min = Math.min(...filteredYears)
        const max = Math.max(...filteredYears)
        setYears({
          min,
          max,
          range: [min, max],
        })
      }
    }
  }, [data, memoizedFilter])

  return {
    yearRange: years.range,
    setYearRange: (range: [number, number]) =>
      setYears((prev) => ({ ...prev, range })),
    minYear: years.min,
    maxYear: years.max,
  }
}
