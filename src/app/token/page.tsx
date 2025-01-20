'use client'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '../store/auth'

export default function Token() {
  const { token, setToken, fetchUserData } = useAuthStore()

  useEffect(() => {
    const hashToken = globalThis.location.hash.split('#')[1]
    if (hashToken) {
      setToken(hashToken)
      fetchUserData()
    }
    if (token) {
      redirect('/monitoring/overview')
    }
  }, [token, setToken, fetchUserData])

  return <></>
}
