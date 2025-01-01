'use client'
import { useState, useEffect, SetStateAction } from 'react'
import Papa from 'papaparse'
import { MortalityCase, ParsedMortalityCase } from '../types/mortality'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1woycECMnrGEivOZUuC_9Ab1OzYI6S04l/export?format=csv&id=1woycECMnrGEivOZUuC_9Ab1OzYI6S04l&gid=2036674639'

export const useMortalityData = () => {
  const [data, setData] = useState<ParsedMortalityCase[]>([])
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
            const parsedData = (results.data as MortalityCase[])
              .filter(row => row.SightingYear && row.Country && row.COD) // Filter out incomplete rows
              .map(row => {
                // Parse date components
                const year = parseInt(row.SightingYear)
                const month = parseInt(row.SightingMonth) || 1
                const day = parseInt(row.SightingDay) || 1
                
                // Create date object (null if invalid date)
                let date: Date | null = null
                try {
                  const tempDate = new Date(year, month - 1, day)
                  date = tempDate.getFullYear() === year ? tempDate : null
                } catch (e) {
                  date = null
                }

                return {
                  sightingEGNo: row.SightingEGNo,
                  intermatchCode: row.IntermatchCode,
                  date,
                  year,
                  month,
                  day,
                  country: row.Country,
                  causeOfDeath: row.COD
                }
              })
              .sort((a, b) => b.year - a.year) // Sort by year descending

            setData(parsedData)
            setLoading(false)
          },
          error: (error: { message: SetStateAction<string | undefined> }) => {
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
    getCountByCountry: () => {
      const counts = new Map<string, number>()
      data.forEach(item => {
        counts.set(item.country, (counts.get(item.country) || 0) + 1)
      })
      return counts
    },
    getCountByCauseOfDeath: () => {
      const counts = new Map<string, number>()
      data.forEach(item => {
        counts.set(item.causeOfDeath, (counts.get(item.causeOfDeath) || 0) + 1)
      })
      return counts
    }
  }
} 
