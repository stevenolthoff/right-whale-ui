import { useState, useEffect } from 'react'

interface DataItem {
  DetectionDate: string
}

export const useYearRange = (data: DataItem[]) => {
  const [yearRange, setYearRange] = useState<[number, number]>([0, 0])
  const [minYear, setMinYear] = useState(0)
  const [maxYear, setMaxYear] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const years = data.map((item) =>
        new Date(item.DetectionDate).getFullYear()
      )
      const min = Math.min(...years)
      const max = Math.max(...years)

      setMinYear(min)
      setMaxYear(max)
      setYearRange([min, max])
    }
  }, [data])

  return { yearRange, setYearRange, minYear, maxYear }
}
