'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { redirect, usePathname } from 'next/navigation'
import { useAuthStore } from '../store/auth'
import { Waves } from 'lucide-react'
import { RW_BACKEND_URL_CONFIG } from '../config'

export default function Header() {
  const pathname = usePathname()
  const topPath = pathname.split('/')[1]
  const {
    isAuthenticated,
    clearToken,
    canAccessMonitoring,
    canAccessInjury,
    canAccessAdmin,
  } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Check for production environment
  // const isProduction =
  //   process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL &&
  //   !process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL.includes('stage')

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Close mobile menu when scrolling starts
      if (isMenuOpen) {
        setIsMenuOpen(false)
        return
      }

      const currentScrollY = window.scrollY

      // Always update isScrolled state for shadow effect
      setIsScrolled(currentScrollY > 10)

      // For mobile: hide/show based on scroll direction
      if (window.innerWidth < 1024) {
        // lg breakpoint
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsHeaderVisible(false)
        } else {
          // Scrolling up
          setIsHeaderVisible(true)
        }
      } else {
        // On desktop, always show header
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border border-b border-slate-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-3'
          : 'bg-white py-4'
      } ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between gap-5'>
        <Link href='/' className='shrink-0'>
          <div className='hidden md:flex items-center gap-2'>
            <Waves className='w-6 h-6 text-blue-600' />
            <span className='font-bold text-black text-lg transition-colors hover:text-blue-600'>
              NARW Anthropogenic Injury Visualization
            </span>
          </div>
          <div className='md:hidden flex items-center gap-2'>
            <Waves className='w-5 h-5 text-blue-600' />
            <span className='font-bold text-black text-lg'>NARW</span>
          </div>
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
          {/* {isAuthenticated && (
            <Link
              href='/whale'
              className={`${
                topPath === 'whale'
                  ? 'text-blue-600 after:w-full'
                  : 'text-gray-700 after:w-0'
              } font-semibold text-[15px] hover:text-blue-600 relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`}
            >
              Whale
            </Link>
          )} */}
          {isAuthenticated && canAccessMonitoring() && (
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
          {isAuthenticated && canAccessInjury() && (
            <Link
              href='/injury/overview'
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
          {isAuthenticated && canAccessAdmin() && (
            <Link
              target='_blank'
              href={RW_BACKEND_URL_CONFIG.ADMIN_URL}
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
          {isAuthenticated && (
            <button
              onClick={() => {
                if (isAuthenticated) {
                  clearToken()
                } else {
                  redirect(RW_BACKEND_URL_CONFIG.COGNITO_REDIRECT_URL)
                }
              }}
              className='whitespace-nowrap px-4 py-2 text-sm rounded-lg font-semibold text-white bg-blue-600 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
            >
              {isAuthenticated ? 'Sign Out' : 'Login'}
            </button>
          )}

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
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm h-screen transition-opacity duration-300 lg:hidden ${
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
          <div className='p-5 bg-white h-screen'>
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
              {isAuthenticated && canAccessMonitoring() && (
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
              {isAuthenticated && canAccessInjury() && (
                <Link
                  href='/injury/overview'
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
              {/* {isAuthenticated && (
                <Link
                  href='/whale'
                  className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                    topPath === 'whale'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Whale
                </Link>
              )} */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
