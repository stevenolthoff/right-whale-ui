'use client'
import { useState, useEffect, SetStateAction } from 'react'
import Papa from 'papaparse'
import { InjuryCase, ParsedInjuryCase } from '../types/injury'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/125C1nTkZx8Jyug0k0oeLpXYPEfRNAdVc/export?format=csv&id=125C1nTkZx8Jyug0k0oeLpXYPEfRNAdVc&gid=548338316'

export const useInjuryData = () => {
  const [data, setData] = useState<ParsedInjuryCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CSV_URL)
        const csvText = await response.text()
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = (results.data as InjuryCase[])
              .filter(row => row.DetectionYear) // Filter out incomplete rows
              .map(row => ({
                id: row.InjuryId,
                ageClass: row.InjuryAgeClass,
                gender: row.GenderDescription,
                type: row.InjuryTypeDescription,
                account: row.InjuryAccountDescription,
                severity: row.InjurySeverityDescription,
                year: parseInt(row.DetectionYear),
                month: parseInt(row["Detection Month"]),
                day: parseInt(row["Detection Day"])
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
    // Utility functions for data analysis
    getCountByYear: () => {
      const counts = new Map<number, number>()
      data.forEach(item => {
        counts.set(item.year, (counts.get(item.year) || 0) + 1)
      })
      return counts
    },
    getCountByType: () => {
      const counts = new Map<string, number>()
      data.forEach(item => {
        counts.set(item.type, (counts.get(item.type) || 0) + 1)
      })
      return counts
    }
  }
} 
