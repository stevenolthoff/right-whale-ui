'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const text: Record<string, { title: string; description: string }> = {
    '/injury2/injury-type': {
      title: 'Injury Type by Year',
      description: 'View injury types categorized by year.',
    },
    '/injury2/entanglement': {
      title: 'Entanglement',
      description: 'View entanglement-related injuries.',
    },
    '/injury2/vessel-strike': {
      title: 'Vessel Strike by Year',
      description: 'View vessel strike incidents by year.',
    },
    '/injury2/custom': {
      title: 'Build Your Own',
      description: 'Create your own custom injury analysis.',
    },
  }

  const links = [
    {
      href: '/injury2/injury-type',
      label: 'Injury Type by Year'
    },
    {
      href: '/injury2/entanglement',
      label: 'Entanglement'
    },
    {
      href: '/injury2/vessel-strike',
      label: 'Vessel Strike by Year'
    },
    {
      href: '/injury2/custom',
      label: 'Build Your Own'
    }
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
