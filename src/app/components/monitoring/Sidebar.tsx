'use client'
import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <nav className='w-64 bg-white p-4 border-r min-h-screen'>
      <div className='mb-6'>
        <h2 className='text-gray-500 font-medium mb-2'>MONITORING</h2>
        <Link href='/monitoring/active' className='block text-blue-500 mb-2'>
          Total
        </Link>
        <Link href='/monitoring/unusual' className='block text-gray-700 mb-2'>
          Unusual Mortality Events
        </Link>
        <Link href='/monitoring/custom' className='block text-gray-700 mb-2'>
          Build Your Own
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar
