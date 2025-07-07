'use client'
import { useState, useEffect, SetStateAction } from 'react'
import Papa from 'papaparse'
import { CalvingCase, ParsedCalvingCase } from '../types/calving'
import { RW_CSV_URL_CONFIG } from '../config'

export const useCalvingData = () => {
  const [data, setData] = useState<ParsedCalvingCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(RW_CSV_URL_CONFIG.CALVING_DATA_CSV_URL)
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = (results.data as CalvingCase[])
              .filter(row => row.CalvingYear && row.EGNo) // Filter out incomplete rows
              .map(row => ({
                egNo: row.EGNo,
                year: parseInt(row.CalvingYear),
                calfNo: row.CalfNo
              }))
              .sort((a, b) => b.year - a.year) // Sort by year descending

            setData(parsedData)
            setLoading(false)
          },
          error: (error: { message: SetStateAction<string | null> }) => {
            setError(error.message)
            setLoading(false)
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    // Utility function for data analysis
    getCountByYear: () => {
      const counts = new Map<number, number>()
      data.forEach(item => {
        counts.set(item.year, (counts.get(item.year) || 0) + 1)
      })
      return counts
    }
  }
}
