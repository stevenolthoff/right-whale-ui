'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { WhaleInjuryResponse, InjuryTimeframeData } from '../types/whaleInjury'
import { useAuthStore } from '../store/auth'
import { RW_BACKEND_URL_CONFIG, url_join } from '../config'

const API_BASE_URL = url_join(
  RW_BACKEND_URL_CONFIG.BASE_URL,
  `/anthro/api/v1/whale_injuries/?page_size=500`
);

export const usePaginatedWhaleInjuryData = () => {
  const [data, setData] = useState<InjuryTimeframeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(API_BASE_URL)
  const [totalCount, setTotalCount] = useState(0)
  const [pagesLoaded, setPagesLoaded] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const { token } = useAuthStore()

  const fetchData = useCallback(
    async (url: string) => {
      if (!url) {
        setLoading(false)
        return
      }

      if (pagesLoaded === 0) setLoading(true)

      setError(null)

      try {
        const response = await axios.get<WhaleInjuryResponse>(url, {
          headers: {
            accept: 'application/json',
            Authorization: `token ${token}`,
          },
        })

        // Extract only the fields we need for the injury timeframe chart
        const extractedData: InjuryTimeframeData[] = response.data.results.map(
          (item) => ({
            DetectionDate: item.DetectionDate,
            InjuryTimeFrame: item.InjuryTimeFrame,
          })
        )

        setData((prevData) => [...prevData, ...extractedData])
        setNextPageUrl(response.data.pagination.next)
        setTotalCount(response.data.pagination.count)
        setTotalPages(response.data.pagination.total_pages)
        setPagesLoaded((prev) => prev + 1)

        // Set loading to false only when we've loaded all pages
        if (!response.data.pagination.next) {
          setLoading(false)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred fetching data'
        )
        setLoading(false)
      }
    },
    [token, pagesLoaded]
  )

  // Auto-fetch all pages
  useEffect(() => {
    if (token && nextPageUrl && pagesLoaded > 0) {
      // Add a small delay to prevent overwhelming the API
      const timer = setTimeout(() => {
        fetchData(nextPageUrl)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [token, nextPageUrl, pagesLoaded, fetchData])

  // Initial fetch, depends on token
  useEffect(() => {
    if (token && pagesLoaded === 0) {
      // Only fetch initially if token is present
      fetchData(API_BASE_URL)
    }
  }, [token, pagesLoaded, fetchData])

  return {
    data,
    loading,
    error,
    totalCount,
    pagesLoaded,
    totalPages,
  }
}
