'use client'
import React from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const text: Record<
    string,
    { title: string; description: string | React.ReactNode }
  > = {
    '/injury/overview': {
      title: 'Introduction to the Data',
      description: (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Data Sources and Methodology
          </h2>
          <p className='text-lg text-gray-700 leading-relaxed'>
            The ability to monitor North Atlantic right whale anthropogenic
            injuries and their impacts is entirely dependent on the North
            Atlantic Right Whale Consortium Identification Database (Catalog),
            curated by the Anderson Cabot Center for Ocean Life at the New
            England Aquarium and supported by decades of dedication by field
            survey teams, researchers, and managers throughout the range of this
            species.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Since 1998, the New England Aquarium has carried out annual
            assessments of entanglement and vessel strike injuries to North
            Atlantic right whales. These assessments are comprehensive and
            include visual inspection of imagery from all sightings of known
            right whales to detect and evaluate indicators of injury presence
            and characteristics, as well as an evaluation of ancillary data
            associated with these injuries (e.g. gear and vessel forensics,
            injury response information, injury outcome, etc). These annual
            assessments are completed once all right whale data have been
            received and processed for a given year and as such, there is
            generally a two-year lag in these assessments. Additionally, these
            injury assessments are completed only for cataloged individuals and
            therefore, injured whales who have not been cataloged are not
            represented in these data.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            In addition to annual assessment of entanglements and vessel strikes
            described above, the New England Aquarium initiated efforts in 2013
            to collaborate with survey teams to identify, report, and monitor
            sightings of injured right whales in near real-time. These efforts
            include assessments of all sighted right whales, both cataloged and
            not, for entanglement and vessel strike injuries, as well as
            injuries of unknown origin with the potential to impact right whale
            health and survival. These data are updated upon receipt of new
            and/or additional imagery and injury related information.
            Additionally, historical sightings of injured non-cataloged right
            whales not captured elsewhere are included in these monitoring
            efforts.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            North Atlantic right whale injury data accessible here represent a
            combination of annual entanglement and vessel strike injury
            assessments and near real-time monitoring efforts and are meant to
            provide comprehensive injury information and context to the state of
            human impacts on the species. Information presented here represents
            the best available data at the time of visualization and may update
            as more information becomes available.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Because systematic surveys for North Atlantic right whales began in
            the early 1980s, graphs presented on this site default to a 1980
            start year. Users can select prior years using the sliding year
            range bar if desired.
          </p>
        </div>
      ),
    },
    '/injury/injury-type': {
      title: 'Total Annual Injuries',
      description: 'View injury types categorized by year.',
    },
    '/injury/entanglement': {
      title: 'Entanglement',
      description: 'View entanglement-related injuries.',
    },
    '/injury/vessel-strike': {
      title: 'Vessel Strikes',
      description: 'View vessel strike incidents by year.',
    },
    '/injury/entanglement/timeframe': {
      title: 'Entanglement Timeframe',
      description: 'View entanglement-related injuries by timeframe.',
    },
    '/injury/entanglement/type-and-severity': {
      title: 'Entanglement Type and Severity',
      description: 'View entanglement-related injuries by type and severity.',
    },
    '/injury/entanglement/age': {
      title: 'Entanglement by Age Class',
      description: 'View entanglement-related injuries by age class.',
    },
    '/injury/vessel-strike/timeframe': {
      title: 'Vessel Strike Timeframe',
      description: 'View vessel strike incidents by timeframe.',
    },
    '/injury/vessel-strike/type-and-severity': {
      title: 'Vessel Strike Type and Severity',
      description: 'View vessel strike incidents by type and severity.',
    },
  }

  const categories = [
    {
      title: 'OVERVIEW',
      links: [
        {
          href: '/injury/overview',
          label: 'Introduction to the Data',
        },
      ],
    },
    {
      title: 'INJURY',
      links: [
        {
          href: '/injury/injury-type',
          label: 'Total Annual Injuries',
        },
        {
          href: '/injury/entanglement',
          label: 'Entanglement',
        },
        {
          href: '/injury/vessel-strike',
          label: 'Vessel Strikes',
        },
      ],
    },
    {
      title: 'ENTANGLEMENT',
      links: [
        {
          href: '/injury/entanglement/timeframe',
          label: 'Timeframe',
        },
        {
          href: '/injury/entanglement/type-and-severity',
          label: 'Type and Severity',
        },
        {
          href: '/injury/entanglement/age',
          label: 'Age Class',
        },
      ],
    },
    {
      title: 'VESSEL STRIKES',
      links: [
        {
          href: '/injury/vessel-strike/timeframe',
          label: 'Timeframe',
        },
        {
          href: '/injury/vessel-strike/type-and-severity',
          label: 'Type and Severity',
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
