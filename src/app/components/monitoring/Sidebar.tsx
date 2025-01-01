'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLink {
  href: string
  label: string
}

interface SidebarCategory {
  title: string
  links: SidebarLink[]
}

interface SidebarProps {
  categories: SidebarCategory[]
}

const Sidebar = ({ categories }: SidebarProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className='md:hidden fixed bottom-6 left-6 z-[90] p-3.5 
          rounded-full bg-blue-600 text-white shadow-lg 
          hover:bg-blue-700 hover:shadow-xl
          active:transform active:scale-95
          transition-all duration-200'
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className='w-6 h-6 transition-transform duration-200'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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

      {/* Desktop toggle button */}
      {!isOpen && (
        <button
          className='hidden md:flex fixed top-[85px] left-4 z-[90] 
            p-2 hover:bg-gray-100 rounded-lg 
            transition-all duration-200 items-center justify-center
            text-gray-500 hover:text-gray-700'
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
          fixed md:static inset-0 z-[90]
          bg-white/95 backdrop-blur-sm md:backdrop-blur-none md:bg-white
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72 p-6' : 'w-0 md:w-0 overflow-hidden'}
          ${isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
          mt-[70px] md:mt-0
          min-h-[calc(100vh-70px)] md:min-h-screen
          overflow-y-auto
          border-r border-gray-200
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        `}
        aria-hidden={!isOpen}
      >
        <div className='space-y-8'>
          {/* Desktop close button */}
          {isOpen && (
            <button
              className='hidden md:flex absolute right-4 top-4 
                p-2 hover:bg-gray-100 rounded-lg 
                transition-colors duration-200 items-center justify-center
                text-gray-500 hover:text-gray-700'
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

          {/* Categories and links */}
          <div className='space-y-10'>
            {categories.map((category, index) => (
              <div key={index} className='space-y-4'>
                <h2 className='text-xs font-bold tracking-wider text-gray-400 uppercase pl-2'>
                  {category.title}
                </h2>
                <div className='space-y-1 pl-1'>
                  {category.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        group flex items-center w-full px-3 py-2.5
                        rounded-lg transition-all duration-200
                        ${pathname === link.href
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setIsOpen(false)
                        }
                      }}
                    >
                      <span className='truncate'>{link.label}</span>
                      {pathname === link.href && (
                        <span className='ml-auto w-1.5 h-1.5 rounded-full bg-blue-600'></span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[85] md:hidden mt-[70px]'
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
