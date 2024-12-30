'use client'
// hooks/useMonitoringData.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import { InjuryCase } from '../types/monitoring'

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
              Authorization: 'token 8186f023f5f80b21498be6162280820fd6144d75',
              'X-CSRFToken':
                'TgNK6RFXdMwTkfwpKhgxJLPhIFvoZf3hHyROnPqNurZnzExIbbtH8wk55D0gCHcW',
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
