'use client'
import NoSsr from './components/NoSsr'
import React from 'react'
import Hero from '@/components/hero'
import HomeInfo from '@/components/homeInfo'
import DisclaimerPopup from './components/DisclaimerPopup'

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
