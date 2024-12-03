import React from 'react'
import Hero from '@/components/hero.tsx'
import HomeInfo from '@/components/homeInfo.tsx'

export default function Home() {
  return (
    <>
      <main>
        <Hero></Hero>
        <HomeInfo></HomeInfo>
        {/* <Mortality></Mortality> */}
      </main>
    </>
  )
}
