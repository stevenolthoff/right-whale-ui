'use client'
import './globals.css'
import Header from './components/header'
import Footer from './components/footer'
import NoSsr from './components/NoSsr'
import React, { useState, useEffect } from 'react'
import { AuthCheck } from './components/AuthCheck'
import { useAuthStore } from './store/auth'
import { usePathname, redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { isAuthenticated, canAccessMonitoring, canAccessInjury, user } =
    useAuthStore()

  // Check authorization
  useEffect(() => {
    const topPath = pathname.split('/')[1]
    const publicPaths = ['', 'public-charts', 'resources', 'token']

    // Allow public paths
    if (publicPaths.includes(topPath)) {
      return
    }

    // Check if user is authenticated for protected paths
    if (!isAuthenticated) {
      console.log('Unauthorized access, redirecting to home...')
      redirect('/')
      return
    }

    // Check specific path permissions
    if (topPath === 'monitoring' && !canAccessMonitoring()) {
      console.log('Unauthorized access to monitoring, redirecting to home...')
      redirect('/')
      return
    }

    if (topPath === 'injury' && !canAccessInjury()) {
      console.log('Unauthorized access to injury, redirecting to home...')
      redirect('/')
      return
    }

    // Superusers can access everything
    if (user?.is_superuser) {
      return
    }
  }, [pathname, isAuthenticated, canAccessMonitoring, canAccessInjury, user])

  return (
    <html lang='en'>
      <body
        className={`font-lora antialiased bg-white h-screen flex flex-col text-black`}
      >
        <NoSsr>
          <AuthCheck />
          <Header />
          <div className='flex-grow'>{children}</div>
          <Footer />
        </NoSsr>
      </body>
    </html>
  )
}
