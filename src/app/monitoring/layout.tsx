'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const text: Record<
    string,
    { title: string; description: string | React.ReactNode }
  > = {
    '/monitoring/overview': {
      title: 'Introduction to the Data',
      description: '',
    },
    '/monitoring/active': {
      title: 'Active Monitoring Cases',
      description: (
        <>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            Monitoring Cases displayed here represent right whale injury cases
            actively being monitored. These are whales for which we request
            follow-up sightings (data and photographs). Cases are made inactive
            when one of the following conditions apply:
          </p>
          <ul className='text-lg text-gray-700 list-disc pl-8 mb-4'>
            <li>The whale dies</li>
            <li>The whale becomes presumed dead (no sightings for 6 years)</li>
            <li>
              Condition improves and/or is such that monitoring is no longer
              necessary
            </li>
          </ul>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Cases are displayed by injury type: Entanglement, Vessel Strike,
            Unknown/Other. Data displayed in the filter table below are sortable
            by column name. Additionally, two fields are hyperlinked. EGNO will
            take users to the online Right Whale Catalog page for that whale and
            Case ID will open additional information about the monitoring case.
            Data exports, when available, will download a csv of all data fields
            related to each monitoring case in addition to those visible in the
            filter.
          </p>
        </>
      ),
    },
    '/monitoring/unusual': {
      title: 'Unusual Mortality Event Cases',
      description: (
        <>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            Monitoring Cases displayed here represent those captured in the
            ongoing North Atlantic Right Whale Mortality Event (UME) 2017-2025.
            More information on the UME is available on NOAA's{' '}
            <Link
              href='https://www.fisheries.noaa.gov/national/marine-life-distress/2017-2025-north-atlantic-right-whale-unusual-mortality-event'
              className='text-blue-500 hover:text-blue-700'
            >
              UME site
            </Link>
            . UME cases may or may not be active monitoring cases.
          </p>

          <p className='text-lg text-gray-700 leading-relaxed'>
            Cases are displayed by UME designation: Mortality, Serious Injury,
            or Morbidity. Data displayed in the filter table below are sortable
            by column name. Additionally, two fields are hyperlinked. EGNO will
            take users to the online Right Whale Catalog page for that whale and
            Case ID will open additional information about the monitoring case.
            Data exports, when available, will download a csv of all data fields
            related to each monitoring case in addition to those visible in the
            filter.
          </p>
        </>
      ),
    },
    '/monitoring/custom': {
      title: 'Search All Data',
      description: (
        <>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            Monitoring Case data can be filtered by data fields below. Cases
            displayed can be sorted by column heading. Additionally, EGNO and
            Case ID are linked for more information on the whale and the
            monitoring case, respectively.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Data exports, when available, will download a csv of all data fields
            related to each monitoring case in addition to those visible in the
            filter.
          </p>
        </>
      ),
    },
  }

  const categories = [
    {
      title: 'OVERVIEW',
      links: [
        {
          href: '/monitoring/overview',
          label: 'Introduction to the Data',
        },
      ],
    },
    {
      title: 'MONITORING',
      links: [
        {
          href: '/monitoring/active',
          label: 'Active Monitoring Cases',
        },
        {
          href: '/monitoring/unusual',
          label: 'Unusual Mortality Event Cases',
        },
        {
          href: '/monitoring/custom',
          label: 'Search All Data',
        },
      ],
    },
  ]

  return (
    <div className='flex min-h-screen bg-white pt-[70px]'>
      <Sidebar categories={categories} />
      <main className='flex-1 p-2 md:p-12 min-w-0 transition-all duration-200 peer-[.-translate-x-full]:ml-0 bg-white'>
        <div className='text-3xl font-bold'>{text[pathname].title}</div>
        <div className='max-w-[800px] mt-4 mb-8'>
          {text[pathname].description}
        </div>
        {children}
      </main>
    </div>
  )
}
export default Layout
