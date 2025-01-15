'use client'
import Link from 'next/link'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useState, useEffect } from 'react'
import { redirect, usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const topPath = pathname.split('/')[1]
  const [token, setToken] = useLocalStorage('token', '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [token])

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border border-b border-slate-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-3'
          : 'bg-white py-4'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between gap-5'>
        <Link href='/' className='shrink-0'>
          <div className='hidden md:block font-bold text-black text-lg transition-colors hover:text-blue-600'>
            NARW Anthropogenic Injury Event Tracker
          </div>
          <div className='md:hidden font-bold text-black text-lg'>NARW</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center space-x-8'>
          <Link
            href='/public-charts/overview'
            className={`${
              topPath === 'public-charts'
                ? 'text-blue-600 after:w-full'
                : 'text-gray-700 after:w-0'
            } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
          >
            Explore
          </Link>
          {isLoggedIn && (
            <Link
              href='/monitoring/overview'
              className={`${
                topPath === 'monitoring'
                  ? 'text-blue-600 after:w-full'
                  : 'text-gray-700 after:w-0'
              } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
            >
              Near Real-Time Injury Monitoring
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href='/injury/injury-type'
              className={`${
                topPath === 'injury'
                  ? 'text-blue-600 after:w-full'
                  : 'text-gray-700 after:w-0'
              } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
            >
              Injury
            </Link>
          )}
          <Link
            href='/resources'
            className={`${
              topPath === 'resources'
                ? 'text-blue-600 after:w-full'
                : 'text-gray-700 after:w-0'
            } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
          >
            Resources
          </Link>
          {isLoggedIn && (
            <Link
              href='https://stage-rwanthro-backend.srv.axds.co/admin/'
              className={`${
                topPath === 'admin'
                  ? 'text-blue-600 after:w-full'
                  : 'text-gray-700 after:w-0'
              } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className='flex items-center gap-3 ml-auto'>
          <button
            onClick={() => {
              if (isLoggedIn) {
                setToken('')
              } else {
                const host = globalThis.location.hostname
                let redirectUrl =
                  host === 'localhost'
                    ? 'http://localhost:44208/u/accounts/amazon-cognito/login/?process='
                    : 'https://stage-rwanthro-backend.srv.axds.co/u/accounts/amazon-cognito/login/?process='
                redirect(redirectUrl)
              }
            }}
            className='whitespace-nowrap px-4 py-2 text-sm rounded-lg font-semibold text-white bg-blue-600 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
          >
            {isLoggedIn ? 'Sign Out' : 'Login'}
          </button>

          {/* Mobile Menu Button */}
          <button
            className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => setIsMenuOpen(true)}
          >
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-0 right-0 w-[300px] h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out transform lg:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='p-5'>
            <div className='flex justify-between items-center mb-8'>
              <h2 className='font-bold text-xl'>Menu</h2>
              <button
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>

            <nav className='space-y-4'>
              <Link
                href='/public-charts/mortality-total'
                className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                  topPath === 'public-charts'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              {isLoggedIn && (
                <Link
                  href='/monitoring/active'
                  className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                    topPath === 'monitoring'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Near Real-Time Injury Monitoring
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  href='/injury/injury-type'
                  className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                    topPath === 'injury'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Injury
                </Link>
              )}
              <Link
                href='/resources'
                className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                  topPath === 'resources'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
