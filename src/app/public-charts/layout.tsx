'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

export default function PublicChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const text: Record<string, { title: string; description: string }> = {
    '/public-charts/mortality-total': {
      title: 'Mortality Total',
      description: 'View total mortality statistics.',
    },
    '/public-charts/mortality-by-country': {
      title: 'Mortality by Country',
      description: 'View mortality statistics broken down by country.',
    },
    '/public-charts/mortality-by-cause-of-death': {
      title: 'Mortality by Cause',
      description: 'View mortality statistics categorized by cause of death.',
    },
    '/public-charts/mortality-by-cause-of-death-and-country': {
      title: 'Mortality by Cause and Country',
      description: 'View mortality statistics broken down by both cause and country.',
    },
    '/public-charts/calving': {
      title: 'Calving',
      description: 'View calving statistics.',
    },
    '/public-charts/injury-total': {
      title: 'Injury Total',
      description: 'View total injury statistics.',
    },
    '/public-charts/entanglement': {
      title: 'Entanglement',
      description: 'View entanglement-related statistics.',
    },
  }

  const categories = [
    {
      title: 'MORTALITY',
      links: [
        {
          href: '/public-charts/mortality-total',
          label: 'Total'
        },
        {
          href: '/public-charts/mortality-by-country',
          label: 'By Country'
        },
        {
          href: '/public-charts/mortality-by-cause-of-death',
          label: 'By Cause of Death'
        },
        {
          href: '/public-charts/mortality-by-cause-of-death-and-country',
          label: 'By Cause of Death & Country'
        }
      ]
    },
    {
      title: 'CALVING',
      links: [
        {
          href: '/public-charts/calving',
          label: 'Total'
        }
      ]
    },
    {
      title: 'INJURY',
      links: [
        {
          href: '/public-charts/injury-total',
          label: 'Total'
        },
        {
          href: '/public-charts/entanglement',
          label: 'Entanglement'
        }
      ]
    }
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
