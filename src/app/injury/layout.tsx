'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const text: Record<
    string,
    { title: string; description: string | React.ReactNode }
  > = {
    '/injury/overview': {
      title: 'Introduction to the Data',
      description: (
        <>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            The injury data presented here provides comprehensive information
            about documented injuries to North Atlantic right whales. The data
            is organized into three main categories:
          </p>
          <ul className='text-lg text-gray-700 list-disc pl-8 mb-4'>
            <li>Total injuries by year and type</li>
            <li>Entanglement incidents and their outcomes</li>
            <li>Vessel strike incidents and their impacts</li>
          </ul>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Each section provides detailed analysis and visualization of injury
            data, helping track and understand the threats facing this
            endangered species. The data can be filtered and sorted to support
            research and conservation efforts.
          </p>
        </>
      ),
    },
    '/injury/injury-type': {
      title: 'Total Annual Injuries',
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
      title: 'OVERVIEW',
      links: [
        {
          href: '/injury/overview',
          label: 'Introduction to the Data',
        },
      ],
    },
    {
      title: 'INJURY',
      links: [
        {
          href: '/injury/injury-type',
          label: 'Total Annual Injuries',
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
