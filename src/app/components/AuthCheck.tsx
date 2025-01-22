'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'
import { usePathname } from 'next/navigation'

export function AuthCheck() {
  const { checkPermissions, isAuthenticated, token, setToken } = useAuthStore()
  const pathname = usePathname()

  // Hydrate the store
  useEffect(() => {
    useAuthStore.persist.rehydrate()
  }, [])

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    console.log(
      'Checking localStorage for token:',
      storedToken ? 'Token found' : 'No token'
    )
    if (storedToken && !token) {
      // Remove any quotes that might have been added during storage
      const cleanToken = storedToken.replace(/^["'](.+)["']$/, '$1')
      setToken(cleanToken)
    }
  }, [setToken, token])

  // Regular permission check effect
  useEffect(() => {
    console.log('AuthCheck effect running:', {
      pathname,
      isAuthenticated,
      hasToken: !!token,
    })

    if (isAuthenticated) {
      checkPermissions()
    }
  }, [pathname, isAuthenticated, checkPermissions, token])

  return null
}
