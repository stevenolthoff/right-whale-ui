import Link from 'next/link'
import Recognition from './recognition'

export default function Footer() {
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
              {[
                { text: 'New England Aquarium', url: 'https://www.neaq.org' },
              ].map((link) => (
                <li key={link.text}>
                  <a
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200'
                  >
                    {link.text}
                  </a>
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

          {/* About Section */}
          <div className='space-y-4 order-4 lg:col-span-6'>
            <h3 className='text-[#2B4380] font-bold text-lg'>About</h3>
            <p className='text-gray-700 text-sm leading-relaxed'>
              The North Atlantic right whale remains one of the most endangered
              large whales in the world, and the population has been in decline
              since 2010. Anthropogenic sources of mortality continue to plague
              this species; all adult and juvenile right whale mortalities from
              2003-2018 for which a cause of death could be determined were due
              to human activities (entanglement or vessel strike).
            </p>
          </div>

          {/* Data Access and Use */}
          <div className='space-y-4 order-5 lg:col-span-6'>
            <h3 className='text-[#2B4380] font-bold text-lg'>
              Data Access and Use
            </h3>
            <p className='text-gray-700 text-sm leading-relaxed'>
              The Right Whale Anthropogenic Event Visualization Site serves
              multiple user purposes and as such, data and visualization output
              access varies by user. Publicly available data and graphics are
              accessible through the &quot;Explore&quot; tab. Near real time
              injury monitoring data are accessible by field teams and managers
              and are meant to facilitate efforts in support of the ongoing
              Unusual Mortality Event.
            </p>
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
