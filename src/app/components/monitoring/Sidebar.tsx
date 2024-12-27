'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <nav className='w-64 bg-white p-4 border-r min-h-screen'>
      <div className='mb-6'>
        <h2 className='text-gray-500 font-medium mb-2'>MONITORING</h2>
        <Link
          href='/monitoring/active'
          className={
            pathname === '/monitoring/active'
              ? 'block text-blue-500 mb-2'
              : 'block text-gray-700 mb-2 hover:text-blue-500'
          }
        >
          Active Cases
        </Link>
        <Link
          href='/monitoring/unusual'
          className={
            pathname === '/monitoring/unusual'
              ? 'block text-blue-500 mb-2'
              : 'block text-gray-700 mb-2 hover:text-blue-500'
          }
        >
          Unusual Mortality Events
        </Link>
        <Link
          href='/monitoring/custom'
          className={
            pathname === '/monitoring/custom'
              ? 'block text-blue-500 mb-2'
              : 'block text-gray-700 mb-2 hover:text-blue-500'
          }
        >
          Build Your Own
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar
