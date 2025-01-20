'use client'
// hooks/useMonitoringData.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import { InjuryCase } from '../types/monitoring'
import { useAuthStore } from '../store/auth'

export const useMonitoringData = () => {
  const [results, setResults] = useState<InjuryCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/monitoring_cases/?page_size=9999999',
          {
            headers: {
              accept: 'application/json',
              Authorization: `token ${useAuthStore.getState().token}`,
            },
          }
        )
        setResults(response.data.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { results, loading, error }
}
