'use client'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { PopulationData, ParsedPopulationData } from '../types/population'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/1YixxdFnB_mr4rUBmIyK_M5wMzqT2RJ8S/export?format=csv&id=1YixxdFnB_mr4rUBmIyK_M5wMzqT2RJ8S&gid=486004420'

export const usePopulationData = () => {
  const [data, setData] = useState<ParsedPopulationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CSV_URL)
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = (results.data as PopulationData[])
              .filter((row) => row.Year && row['Population Estimate']) // Filter out incomplete rows
              .map((row) => ({
                year: parseInt(row.Year),
                estimate: parseInt(row['Population Estimate']),
              }))
              .sort((a, b) => a.year - b.year) // Sort by year ascending

            setData(parsedData)
            setLoading(false)
          },
          error: (error) => {
            setError(error.message)
            setLoading(false)
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
