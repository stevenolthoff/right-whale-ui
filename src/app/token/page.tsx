'use client'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import React from 'react'
export default function Token() {
  const [token, setToken] = useLocalStorage('token', '')
  useEffect(() => {
    setToken(globalThis.location.hash.split('#')[1])
    if (token) {
      redirect('/injury/injury-type-by-year')
    }
  }, [token])
  return <></>
}
