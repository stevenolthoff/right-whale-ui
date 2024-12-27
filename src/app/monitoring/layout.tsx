'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar.tsx'
import { usePathname } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const text: Record<string, { title: string; description: string }> = {
    '/monitoring/active': {
      title: 'Active Cases',
      description: 'This page shows the number of active cases by year.',
    },
    '/monitoring/recovered': {
      title: 'Recovered Cases',
      description: 'This page shows the number of recovered cases by year.',
    },
    '/monitoring/deaths': {
      title: 'Deaths',
      description: 'This page shows the number of deaths by year.',
    },
  }
  return (
    <div className='flex'>
      <Sidebar />
      <main className='flex-1 p-8'>
        <div className='text-3xl font-bold'>{text[pathname].title}</div>
        <div className='max-w-[800px] mt-4 mb-8'>
          {text[pathname].description}
        </div>
        {children}
      </main>
    </div>
  )
}

export default Layout
