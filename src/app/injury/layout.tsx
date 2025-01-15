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
      title: 'Vessel Strikes',
      description: 'View vessel strike incidents by year.',
    },
  }

  const categories = [
    {
      title: 'INJURY',
      links: [
        {
          href: '/injury/injury-type',
          label: 'Total',
        },
        {
          href: '/injury/entanglement',
          label: 'Entanglement',
        },
        {
          href: '/injury/vessel-strike',
          label: 'Vessel Strikes',
        },
      ],
    },
  ]

  return (
    <div className='flex min-h-screen bg-white pt-[70px]'>
      <Sidebar categories={categories} />
      <main className='flex-1 p-2 md:p-12 min-w-0 transition-all duration-200 peer-[.-translate-x-full]:ml-0 bg-white'>
        <div className='text-3xl font-bold'>{text[pathname].title}</div>
        <div className='max-w-[800px] mt-4 mb-8'>
          {text[pathname].description}
        </div>
        {children}
      </main>
    </div>
  )
}
