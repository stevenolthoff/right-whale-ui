'use client'
// import type { Metadata } from 'next'
import './globals.css'
import Header from './components/header'
import Footer from './components/footer'
import NoSsr from './components/NoSsr'
import React from "react";

// export const metadata: Metadata = {
//   title: 'NARW Anthropogenic Injuries',
//   description: 'Tracking Right Whale Injuries and Mortality',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`font-lora antialiased bg-white h-screen flex flex-col`}>
        <NoSsr>
          <Header />
          <div className='flex-grow'>{children}</div>
          <Footer />
        </NoSsr>
      </body>
    </html>
  )
}
