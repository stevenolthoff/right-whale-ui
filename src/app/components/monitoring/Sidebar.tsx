'use client'
import React from 'react'
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

  return (
    <nav className='w-64 bg-white p-4 border-r min-h-screen'>
      <div className='mb-6'>
        <h2 className='text-gray-500 font-medium mb-2'>{title}</h2>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? 'block text-blue-500 mb-2'
                : 'block text-gray-700 mb-2 hover:text-blue-500'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar
