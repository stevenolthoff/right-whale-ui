'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function PublicChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const text: Record<
    string,
    { title: string; description: string | React.ReactNode }
  > = {
    '/public-charts/overview': {
      title: 'Introduction to the Data',
      description: '',
    },
    '/public-charts/mortality-total': {
      title: 'Mortality Total',
      description: (
        <>
          Total detected North Atlantic right whale mortalities over time.
          Mortalities illustrated here represent those from all sources, known
          and unknown. As detected mortalities represent a fraction of actual
          mortalities (
          <Link
            href='https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/csp2.346'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Pace et al 2017
          </Link>
          ) these counts are a minimum and likely underestimates.
        </>
      ),
    },
    '/public-charts/mortality-by-country': {
      title: 'Mortality by Country',
      description:
        'Detected North Atlantic right whale mortalities by country in which the mortality was documented. Detection location is not necessarily indicative of where a whale was injured or where it died.',
    },
    '/public-charts/mortality-by-cause-of-death': {
      title: 'Mortality by Cause',
      description: (
        <>
          Cause of death for detected North Atlantic right whale mortalities.
          See{' '}
          <Link
            href='https://www.int-res.com/abstracts/dao/v135/n1/p1-31/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Sharp et al 2019
          </Link>{' '}
          for more information. Cause of death cannot be determined for all
          cases due to carcass inaccessibility, decomposition, and other
          factors. Those mortalities for which a cause of death could not be
          identified are listed as “Unknown.” Mortalities listed as “Other”
          include a fetus that washed ashore, shark predation, and a hunted
          animal.
        </>
      ),
    },
    '/public-charts/mortality-by-cause-of-death-and-country': {
      title: 'Mortality by Cause and Country',
      description:
        'Cause of death and detection location for North Atlantic right whale mortalities. Cause of death cannot be determined for all cases due to carcass inaccessibility, decomposition, and other factors. Those mortalities for which a cause of death could not be identified are listed as “Unknown.” Mortalities listed as “Other” include fetuses that washed ashore, shark predation, and a hunted animal. Detection location is not necessarily indicative of where a whale was injured or where it died.',
    },
    '/public-charts/calving': {
      title: 'Calving',
      description:
        'North Atlantic right whale calving events by year. These data are updated at the end of the calving season which runs December – March annually. ',
    },
    '/public-charts/injury-total': {
      title: 'Injury Total',
      description:
        'North Atlantic right whale anthropogenic injuries detected by year. These data include anthropogenic injuries only and do not include those for which a source could not be identified. These data are assessed on an annual basis once all sighting and photographic information have been received. As such, there is generally a two-year lag in data visualization.',
    },
    '/public-charts/entanglement': {
      title: 'Entanglement',
      description: (
        <>
          Detected entanglement events by type and severity. Entanglements can
          be detected with attached gear (i.e. Gear) or by wounds only and no
          attached gear (i.e. No Gear). Severity is an assessment of the
          resulting entanglement injury and is classified as Minor, Moderate, or
          Severe. See{' '}
          <Link
            href='https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/cobi.12590'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Knowlton et al 2016
          </Link>{' '}
          for severity descriptions.
        </>
      ),
    },
  }

  const categories = [
    {
      title: 'OVERVIEW',
      links: [
        {
          href: '/public-charts/overview',
          label: 'Introduction to the Data',
        },
      ],
    },
    {
      title: 'MORTALITY',
      links: [
        {
          href: '/public-charts/mortality-total',
          label: 'Total',
        },
        {
          href: '/public-charts/mortality-by-country',
          label: 'By Country',
        },
        {
          href: '/public-charts/mortality-by-cause-of-death',
          label: 'By Cause of Death',
        },
        {
          href: '/public-charts/mortality-by-cause-of-death-and-country',
          label: 'By Cause of Death & Country',
        },
      ],
    },
    {
      title: 'CALVING',
      links: [
        {
          href: '/public-charts/calving',
          label: 'Total',
        },
      ],
    },
    {
      title: 'INJURY',
      links: [
        {
          href: '/public-charts/injury-total',
          label: 'Total',
        },
        {
          href: '/public-charts/entanglement',
          label: 'Entanglement',
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
