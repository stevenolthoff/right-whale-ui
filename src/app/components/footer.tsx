import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gradient-to-b from-white to-slate-50 border-t border-slate-200'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto pt-16 pb-8 px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12'>
          {/* About Section */}
          <div className='space-y-4'>
            <h3 className='text-blue-900 font-bold text-lg'>About</h3>
            <p className='text-slate-600 text-sm leading-relaxed'>
              Dedicated to tracking and visualizing North Atlantic Right Whale
              injuries and mortality events to support conservation efforts.
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-blue-900 font-bold text-lg'>Quick Links</h3>
            <ul className='space-y-2'>
              {[
                {
                  text: 'Mortality Data',
                  url: '/public-charts/mortality-total',
                },
                { text: 'Calving Data', url: '/public-charts/calving' },
                { text: 'Injury Data', url: '/public-charts/injury-total' },
                // { text: 'Custom Analysis', url: '/monitoring/custom' },
                // { text: 'Data Table', url: '/monitoring/table' },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className='text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200'
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className='space-y-4'>
            <h3 className='text-blue-900 font-bold text-lg'>Resources</h3>
            <ul className='space-y-2'>
              {[
                { text: 'New England Aquarium', url: 'https://www.neaq.org' },
              ].map((link) => (
                <li key={link.text}>
                  <a
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200'
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <h3 className='text-blue-900 font-bold text-lg'>Contact</h3>
            <div className='space-y-2'>
              <p className='text-slate-600 text-sm'>
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
        </div>

        {/* Divider */}
        <div className='border-t border-slate-200 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Copyright */}
            <p className='text-slate-500 text-sm'>
              © {new Date().getFullYear()} NARW Anthropogenic Injury Event
              Tracker. All rights reserved.
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
