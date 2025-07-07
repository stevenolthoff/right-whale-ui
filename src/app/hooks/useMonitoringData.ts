'use client'
// hooks/useMonitoringData.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import { InjuryCase } from '../types/monitoring'
import { useAuthStore } from '../store/auth'
import { RW_BACKEND_URL_CONFIG, url_join } from '../config'

export const useMonitoringData = () => {
  const [results, setResults] = useState<InjuryCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          url_join(
            RW_BACKEND_URL_CONFIG.BASE_URL,
            `/anthro/api/v1/monitoring_cases/?page_size=9999999`
          ),
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
