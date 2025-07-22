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
    '/public-charts/population': {
      title: 'Population Estimates',
      description: (
        <>
          Annually, the North Atlantic Right Whale population size is estimated
          using Catalog data in a capture-recapture framework (see{' '}
          <Link
            href='https://onlinelibrary.wiley.com/doi/full/10.1002/ece3.3406'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Pace et al 2017
          </Link>
          ) with a newly incorporated birth integration approach that aims to
          more quickly capture calves of the year in the estimate (see{' '}
          <Link
            href='https://doi.org/10.25923/bjn8-kx95'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Linden 2024
          </Link>
          ). The population estimate is run each fall with the most up to date
          data and is presented at the Annual North Atlantic Right Whale
          Consortium Meeting and included in the Annual North Atlantic Right
          Whale Consortium Report Card. The population estimate for a given year
          is an estimate of the number of whales alive at the start of a given
          year between December (Year-1) and November (Year). The most recent
          population estimate is 372 (-12/+11) for 2023.{' '}
        </>
      ),
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
          identified are listed as "Unknown." Mortalities listed as "Other"
          include a fetus that washed ashore, shark predation, and a hunted
          animal.
        </>
      ),
    },
    '/public-charts/mortality-by-cause-of-death-and-country': {
      title: 'Mortality by Cause and Country',
      description:
        'Cause of death and detection location for North Atlantic right whale mortalities. Cause of death cannot be determined for all cases due to carcass inaccessibility, decomposition, and other factors. Those mortalities for which a cause of death could not be identified are listed as "Unknown." Mortalities listed as "Other" include fetuses that washed ashore, shark predation, and a hunted animal. Detection location is not necessarily indicative of where a whale was injured or where it died.',
    },
    '/public-charts/calving': {
      title: 'Calving',
      description:
        'North Atlantic right whale mother/calf pairs sighted by year. These data are updated at the end of the calving season which runs December – March annually. Calves who are seen without a mother and are not genetically sampled (and therefore cannot be linked to a mother), are not included in these counts.',
    },
    '/public-charts/injury-total': {
      title: 'Injury Total',
      description:
        'North Atlantic right whale anthropogenic injuries detected by year for both known (catalogued) and unknown ID. These data include anthropogenic injuries only and do not include those injuries for which a source could not be identified. These data are assessed on an annual basis once all sighting and photographic information have been received. As such, there is generally a two-year lag in data visualization.',
    },
    '/public-charts/entanglement': {
      title: 'Entanglement',
      description: (
        <>
          Detected entanglement events by type and severity for both known
          (catalogued) and unknown ID. Entanglements can be detected with
          attached gear (i.e. Gear) or by wounds only and no attached gear (i.e.
          No Gear). Severity is an assessment of the resulting entanglement
          injury and is classified as Minor, Moderate, or Severe.
          <br />
          <br />
          <ul className='list-disc list-inside'>
            <li>
              Minor: Injuries or scars in the skin that were less than ~2cm in
              width and did not appear to penetrate into the blubber.
            </li>
            <li>
              Moderate: Injuries or scars that were greater than ~ 2 cm in
              width, and/or between 2 and ~8 cm in depth. This would include
              injuries that extend into the blubber (hypodermis later).
            </li>
            <li>
              Severe: Injuries that were greater than ~8 cm in depth and/or are
              known to extend into bone or muscle. This also includes cases of
              significant deformity or discoloration of fluke or flipper, for
              example a twisted fluke caused by torquing by rope/gear. A
              discolored appendage can indicate circulation impairment even in
              cases in which the entanglement itself is not visible
            </li>
          </ul>
          <br />
          <br />
          See{' '}
          <Link
            href='https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/cobi.12590'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-700'
          >
            Knowlton et al 2016
          </Link>{' '}
          for additional information. For reasons outlined below, data here
          represent a minimum of entanglement events and are likely an
          underestimate. Unidentified whales with detected entanglement injuries
          are not included here.
          <br />
          <br />
          <ol className='list-decimal list-inside'>
            <li>
              Entanglements (with gear and those indicated by injury only) must
              be detected to be counted.
            </li>
            <li>
              Poor quality, distant, and partial images of a whale as well as
              undetected mortalities of a whale may preclude the detection of an
              injury.
            </li>
          </ol>
        </>
      ),
    },
    '/public-charts/vessel-strike': {
      title: 'Vessel Strike',
      description: (
        <>
          Detected vessel strike events by type and severity for both known
          (catalogued) and unknown ID. Vessel strike types can include propeller
          cuts (Prop), blunt force trauma (Blunt), large open wounds (Gash), and
          others such as skeg wounds (Other). Severity is an assessment of the
          resulting vessel strike injury and is classified as Superficial
          (&lt;2cm penetrating depth), Shallow (2-8cm penetrating depth), or
          Deep (&gt; 8cm penetrating depth). Because Blunt cases are almost
          exclusively detected post-mortem, the severity for those cases is
          listed as Blunt. For reasons outlined below, data here represent a
          minimum of entanglement events and are likely an underestimate. <br />
          <br />
          <ol className='list-decimal list-inside'>
            <li>Vessel strike injuries must be detected to be counted.</li>
            <li>
              Poor quality, distant, and partial images of a whale as well as
              undetected mortalities of a whale may preclude the detection of an
              injury.
            </li>
          </ol>
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
      title: 'POPULATION ESTIMATE',
      links: [
        {
          href: '/public-charts/population',
          label: 'Population Estimate',
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
        {
          href: '/public-charts/vessel-strike',
          label: 'Vessel Strike',
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
