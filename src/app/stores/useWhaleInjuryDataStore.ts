import { create } from 'zustand'
import axios from 'axios'
import { WhaleInjury, WhaleInjuryResponse } from '../types/whaleInjury'

const API_BASE_URL = process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL
  ? `${process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL}/anthro/api/v1/whale_injuries/?page_size=500`
  : 'https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/whale_injuries/?page_size=500'

interface WhaleInjuryDataState {
  data: WhaleInjury[]
  loading: boolean
  error: string | null
  fetchData: (token: string) => Promise<void>
}

export const useWhaleInjuryDataStore = create<WhaleInjuryDataState>(
  (set, get) => ({
    data: [],
    loading: false,
    error: null,
    fetchData: async (token: string) => {
      // If data is already loaded or is loading, don't fetch again
      if (get().data.length > 0 || get().loading) {
        return
      }

      set({ loading: true, error: null })

      let allData: WhaleInjury[] = []
      let nextUrl: string | null = API_BASE_URL

      try {
        while (nextUrl) {
          const response = await axios.get<WhaleInjuryResponse>(nextUrl, {
            headers: {
              accept: 'application/json',
              Authorization: `token ${token}`,
            },
          })

          allData = [...allData, ...response.data.results]
          nextUrl = response.data.pagination.next
        }
        set({ data: allData, loading: false })
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'An error occurred fetching data'
        set({ error: errorMsg, loading: false })
      }
    },
  })
) 
