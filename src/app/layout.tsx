'use client'
import './globals.css'
import Header from './components/header'
import Footer from './components/footer'
import NoSsr from './components/NoSsr'
import React, { useState, useEffect } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`font-lora antialiased bg-white h-screen flex flex-col text-black`}
      >
        <NoSsr>
          <Header />
          <div className='flex-grow'>{children}</div>
          <Footer />
        </NoSsr>
      </body>
    </html>
  )
}
