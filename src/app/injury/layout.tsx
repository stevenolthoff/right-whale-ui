'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const text: Record<string, { title: string; description: string }> = {
    '/injury/injury-type': {
      title: 'Injury Type by Year',
      description: 'View injury types categorized by year.',
    },
    '/injury/entanglement': {
      title: 'Entanglement',
      description: 'View entanglement-related injuries.',
    },
    '/injury/vessel-strike': {
      title: 'Vessel Strike by Year',
      description: 'View vessel strike incidents by year.',
    },
  }

  const links = [
    {
      href: '/injury/injury-type',
      label: 'Injury Type by Year'
    },
    {
      href: '/injury/entanglement',
      label: 'Entanglement'
    },
    {
      href: '/injury/vessel-strike',
      label: 'Vessel Strike by Year'
    },
  ]

  return (
    <div className='flex'>
      <Sidebar title='INJURY' links={links} />
      <main className='flex-1 p-2 md:p-12'>
        <div className='text-3xl font-bold'>{text[pathname].title}</div>
        <div className='max-w-[800px] mt-4 mb-8'>
          {text[pathname].description}
        </div>
        {children}
      </main>
    </div>
  )
}
