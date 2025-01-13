'use client'
import NoSsr from './components/NoSsr'
import React, { useState, useEffect } from 'react'
import Hero from '@/components/hero'
import HomeInfo from '@/components/homeInfo'
import DisclaimerPopup from './components/DisclaimerPopup'
import { useLocalStorage } from '@uidotdev/usehooks'
import FloatingInfoButton from './components/FloatingInfoButton'

export default function Home() {
  const [hasVisited, setHasVisited] = useLocalStorage('hasVisitedBefore', false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    if (!hasVisited) {
      setIsPopupOpen(true)
      setHasVisited(true)
    }
  }, [hasVisited, setHasVisited])
  return (
    <NoSsr>
      <main>
        <Hero></Hero>
        <HomeInfo></HomeInfo>
        <DisclaimerPopup
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
        <FloatingInfoButton onClick={() => setIsPopupOpen(true)} />
      </main>
    </NoSsr>
  )
}
