'use client'
import Link from 'next/link'
import React from 'react'

export default function Overview() {
  return (
    <div className='min-h-[120vh]'>
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p className='text-lg'>
          Beginning in 2013, The New England Aquarium initiated an effort to
          collaborate with survey teams to identify, report, and monitor
          sightings of injured right whales in near real time. Initially
          developed to support the National Marine Fisheries Service&apos;s
          revised process for distinguishing serious from non-serious injuries
          in large whales, these efforts also support the ongoing North Atlantic
          right whale Unusual Mortality Event (UME) that was initiated in 2017.
          Additionally, because annual assessments of anthropogenic scars on
          right whales only capture entanglement and vessel strike injuries for
          known, cataloged right whales, these monitoring efforts have been
          expanded to include anthropogenic injuries as well as significant
          injuries of unknown origin for uncatalogued, unknown right whales.
        </p>

        <p className='text-lg'>
          The Right Whale Anthropogenic Events Database captures key information
          including:
        </p>
        <ul className='text-lg list-disc pl-8 mb-4'>
          <li>Whale identification (if known)</li>
          <li>Injury type and severity</li>
          <li>Visual health assessment</li>
          <li>General case comments</li>
          <li>Unusual Mortality Event status</li>
        </ul>

        <p className='text-lg'>
          Additional whale sightings and follow-up injury assessments are added
          to the initial case entry, creating a streamlined process to track
          injury details over time. This data is stored within the Right Whale
          Identification Database (Catalog), enabling integration with life
          history data. More information on the Right Whale Anthropogenic Events
          Database is available{' '}
          <Link
            href='https://www.narwc.org/anthropogenic-events-database.html'
            className='text-blue-500 hover:text-blue-700'
          >
            HERE
          </Link>{' '}
          .
        </p>

        <p className='text-lg'>
          Since injury monitoring relies on real-time field identification, the
          data likely underestimates actual right whale injuries. Comprehensive
          annual assessments are performed once all sighting data for a given
          year has been processed. Injury Data is available to permissioned
          users via the Injury Case pages.
        </p>

        <p className='text-lg'>
          Survey teams are encouraged to submit images from sightings of known
          and new injury cases to the shared{' '}
          <Link
            href='https://drive.google.com/drive/folders/1MbC_qXcOnQUSMH9OkReeuLgjFwzz1gQj?usp=sharing'
            className='text-blue-500 hover:text-blue-700'
            target='_blank'
            rel='noopener noreferrer'
          >
            Monitoring Drive
          </Link>
          .
        </p>

        <p className='text-lg font-bold'>
          Data and visualizations available here may not be used or shared
          without an approved data access request from the{' '}
          <Link
            href='https://www.narwc.org/accessing-narwc-data.html'
            className='text-blue-500 hover:text-blue-700'
          >
            North Atlantic Right Whale Consortium
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
