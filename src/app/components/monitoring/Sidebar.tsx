'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLink {
  href: string
  label: string
}

interface SidebarProps {
  title: string
  links: SidebarLink[]
}

const Sidebar = ({ title, links }: SidebarProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className='md:hidden fixed bottom-[180px] left-4 z-50 p-3 rounded-full bg-white shadow-lg'
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          {isOpen ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          )}
        </svg>
      </button>

      {/* Desktop toggle button - only shows when sidebar is closed */}
      {!isOpen && (
        <button
          className='hidden md:block fixed top-[85px] left-4 z-40 p-1 hover:bg-gray-100 rounded transition-transform duration-200'
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <svg
            className='w-5 h-5 transform rotate-180'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <nav
        className={`
          peer
          fixed md:static bottom-0 left-0 z-40
          bg-white min-h-screen
          transform transition-all duration-200 ease-in-out
          ${isOpen ? 'w-64 p-4 border-r' : 'w-0 md:w-0 overflow-hidden'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        aria-hidden={!isOpen}
      >
        <div className='mb-6 pt-[70px] md:pt-0'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-gray-500 font-bold whitespace-nowrap'>{title}</h2>
            {/* Desktop close button - only shows when sidebar is open */}
            {isOpen && (
              <button
                className='hidden md:block p-1 hover:bg-gray-100 rounded'
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            )}
          </div>
          <div className='flex flex-col'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  whitespace-nowrap
                  ${pathname === link.href
                    ? 'block text-blue-500 mb-2 py-2'
                    : 'block text-gray-700 mb-2 hover:text-blue-500 py-2'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpen(false)
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
