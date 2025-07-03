import Link from 'next/link'
import Recognition from './recognition'
import { PopupSection } from '../layout'

interface FooterProps {
  onOpenPopup: (section: PopupSection) => void
}

type ResourceLink =
  | { text: string; url: string }
  | { text: string; section: PopupSection }

export default function Footer({ onOpenPopup }: FooterProps) {
  const resources: ResourceLink[] = [
    { text: 'New England Aquarium', url: 'https://www.neaq.org' },
    { text: 'About', section: 'about' },
    { text: 'Data Access & Use', section: 'data-access' },
  ]

  return (
    <footer className='bg-gradient-to-b from-white to-slate-50 border-t border-slate-200'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto pt-16 pb-8 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 mb-12'>
          {/* Quick Links */}
          <div className='space-y-4 order-1 lg:col-span-3'>
            <h3 className='text-[#2B4380] font-bold text-lg'>Quick Links</h3>
            <ul className='space-y-2'>
              {[
                { text: 'Population Data', url: '/public-charts/population' },
                {
                  text: 'Mortality Data',
                  url: '/public-charts/mortality-total',
                },
                { text: 'Calving Data', url: '/public-charts/calving' },
                { text: 'Injury Data', url: '/public-charts/injury-total' },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className='text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200'
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className='space-y-4 order-2 lg:col-span-3'>
            <h3 className='text-[#2B4380] font-bold text-lg'>Resources</h3>
            <ul className='space-y-2'>
              {resources.map((link) => (
                <li key={link.text}>
                  {'url' in link ? (
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200'
                    >
                      {link.text}
                    </a>
                  ) : (
                    <button
                      onClick={() => onOpenPopup(link.section)}
                      className='text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200'
                    >
                      {link.text}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4 order-3 lg:col-span-3'>
            <h3 className='text-[#2B4380] font-bold text-lg'>Contact</h3>
            <div className='space-y-2'>
              <p className='text-gray-700 text-sm'>
                Have questions about our data?
              </p>
              <a
                href='mailto:hpettis@neaq.org'
                className='inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                Contact Us
              </a>
            </div>
          </div>

          {/* Recognition */}
          <div className='lg:col-span-12 order-6'>
            <Recognition />
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Copyright */}
            <p className='text-slate-500 text-sm'>
              © {new Date().getFullYear()} NARW Anthropogenic Injury
              Visualization site. All rights reserved.
            </p>

            {/* Social Links */}
            {/* <div className='flex items-center space-x-6'>
              {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item) => (
                <Link
                  key={item}
                  href='#'
                  className='text-slate-500 hover:text-blue-600 text-sm transition-colors duration-200'
                >
                  {item}
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
