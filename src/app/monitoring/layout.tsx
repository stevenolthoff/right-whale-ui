'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const text: Record<string, { title: string; description: string }> = {
    '/monitoring/active': {
      title: 'Active Cases',
      description: 'This page shows the number of active cases by year.',
    },
    '/monitoring/unusual': {
      title: 'Unusual Cases',
      description: 'This page shows the number of unusual cases by year.',
    },
    '/monitoring/custom': {
      title: 'Build Your Own',
      description: 'This page allows you to build your own monitoring page.',
    },
  }

  const links = [
    {
      href: '/monitoring/active',
      label: 'Active Cases'
    },
    {
      href: '/monitoring/unusual', 
      label: 'Unusual Cases'
    },
    {
      href: '/monitoring/custom',
      label: 'Build Your Own'
    }
  ]

  return (
    <div className='flex'>
      <Sidebar title='MONITORING' links={links} />
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
