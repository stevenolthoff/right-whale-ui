'use client'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import React from 'react'
export default function Token() {
  console.log('/token')
  const [token, setToken] = useLocalStorage('token', '')
  useEffect(() => {
    console.log('token', token)
    setToken(globalThis.location.hash.split('#')[1])
    if (token) {
      redirect('/injury/injury-type-by-year')
    }
  }, [token, setToken])
  return <></>
}
