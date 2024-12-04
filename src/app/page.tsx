'use client'
import NoSsr from './components/NoSsr.tsx'
import React from 'react'
import Hero from '@/components/hero.tsx'
import HomeInfo from '@/components/homeInfo.tsx'

export default function Home() {
  return (
    <NoSsr>
      <main>
        <Hero></Hero>
        <HomeInfo></HomeInfo>
      </main>
    </NoSsr>
  )
}
