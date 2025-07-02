'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { WhaleInjury, WhaleInjuryResponse } from '../types/whaleInjury'
import { useAuthStore } from '../store/auth'

const API_BASE_URL =
  'https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/whale_injuries/'

export const usePaginatedWhaleInjuryData = () => {
  const [data, setData] = useState<WhaleInjury[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
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
        setLoadingMore(false)
        return
      }

      if (pagesLoaded === 0) setLoading(true)
      else setLoadingMore(true)

      setError(null)

      try {
        const response = await axios.get<WhaleInjuryResponse>(url, {
          headers: {
            accept: 'application/json',
            Authorization: `token ${token}`,
          },
        })

        setData((prevData) => [...prevData, ...response.data.results])
        setNextPageUrl(response.data.pagination.next)
        setTotalCount(response.data.pagination.count)
        setTotalPages(response.data.pagination.total_pages)
        setPagesLoaded((prev) => prev + 1)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred fetching data'
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [token, pagesLoaded]
  )

  const loadMore = useCallback(() => {
    if (nextPageUrl && !loadingMore) {
      fetchData(nextPageUrl)
    }
  }, [nextPageUrl, loadingMore, fetchData])

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
    loadingMore,
    error,
    totalCount,
    pagesLoaded,
    totalPages,
    hasNextPage: !!nextPageUrl,
    loadMore,
  }
}
