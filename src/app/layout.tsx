'use client'
import './globals.css'
import Header from './components/header'
import Footer from './components/footer'
import NoSsr from './components/NoSsr'
import FloatingInfoButton from './components/FloatingInfoButton'
import DisclaimerPopup from './components/DisclaimerPopup'
import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [hasVisited, setHasVisited] = useLocalStorage('hasVisitedBefore', false)
  const [isPopupOpen, setIsPopupOpen] = useState(true)

  useEffect(() => {
    if (!hasVisited) {
      setIsPopupOpen(true)
      setHasVisited(true)
    }
  }, [hasVisited, setHasVisited])

  return (
    <html lang='en'>
      <body
        className={`font-lora antialiased bg-white h-screen flex flex-col text-black`}
      >
        <NoSsr>
          <Header />
          <div className='flex-grow'>{children}</div>
          <Footer />
          <FloatingInfoButton onClick={() => setIsPopupOpen(true)} />
          <DisclaimerPopup
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
          />
        </NoSsr>
      </body>
    </html>
  )
}
