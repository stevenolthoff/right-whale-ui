import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types/auth'
import axios from 'axios'
import { RW_BACKEND_URL_CONFIG } from '../config'

interface AuthState {
  token: string
  user: User | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  fetchUserData: () => Promise<void>
  clearUserData: () => void
  checkPermissions: () => Promise<void>
  lastPermissionCheck: number
  canAccessMonitoring: () => boolean
  canAccessInjury: () => boolean
  canAccessAdmin: () => boolean
  canExportCsv: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      user: null,
      isAuthenticated: false,
      lastPermissionCheck: 0,
      setToken: (token: string) => {
        console.log('Setting token:', token ? 'Token present' : 'No token')
        if (token) {
          localStorage.setItem('token', JSON.stringify(token))
        } else {
          localStorage.removeItem('token')
        }
        set({ token, isAuthenticated: !!token })
      },
      clearToken: () => {
        console.log('Clearing auth state')
        localStorage.removeItem('token')
        set({ token: '', isAuthenticated: false, user: null })
      },
      clearUserData: () => {
        console.log('Clearing user data')
        set({ user: null })
      },
      fetchUserData: async () => {
        console.log('Fetching user data...')
        try {
          const { data } = await axios.get<User>(
            RW_BACKEND_URL_CONFIG.ME_URL,
            {
              headers: {
                Authorization: `token ${get().token}`,
              },
            }
          )
          console.log('User data fetched successfully:', {
            username: data.username,
            email: data.email,
            groups: data.groups,
          })
          set({ user: data })
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          set({ user: null, isAuthenticated: false, token: '' })
          localStorage.removeItem('token')
        }
      },
      checkPermissions: async () => {
        const now = Date.now()
        const lastCheck = get().lastPermissionCheck
        if (now - lastCheck < 5000) {
          console.log('Skipping permission check - too soon since last check')
          return
        }

        console.log('Checking permissions...')
        try {
          const { data } = await axios.get<User>(
            RW_BACKEND_URL_CONFIG.ME_URL,
            {
              headers: {
                Authorization: `token ${get().token}`,
              },
            }
          )
          console.log('Permissions check successful:', {
            username: data.username,
            groups: data.groups,
            permissions: data.user_permissions,
            isStaff: data.is_staff,
            isSuperuser: data.is_superuser,
            lastCheck: new Date(now).toISOString(),
          })
          set({ user: data, lastPermissionCheck: now })
        } catch (error) {
          console.error('Permission check failed:', error)
          localStorage.removeItem('token')
          set({
            user: null,
            isAuthenticated: false,
            token: '',
            lastPermissionCheck: now,
          })
        }
      },
      canAccessMonitoring: () => {
        const { user } = get()
        if (!user) return false
        return (
          user.is_superuser ||
          user.groups.includes('neaq_staff') ||
          user.groups.includes('monitoring')
        )
      },
      canAccessInjury: () => {
        const { user } = get()
        if (!user) return false
        return (
          user.is_superuser ||
          user.groups.includes('neaq_staff') ||
          user.groups.includes('injury')
        )
      },
      canAccessAdmin: () => {
        const { user } = get()
        if (!user) return false
        return user.is_superuser || user.groups.includes('neaq_staff')
      },
      canExportCsv: () => {
        const { user } = get()
        if (!user) return false
        return user.is_superuser || user.groups.includes('csv_export')
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)
