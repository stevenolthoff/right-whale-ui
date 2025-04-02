'use client'
import React from 'react'

export default function Overview() {
  return (
    <div className=''>
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p className='text-lg'>
          The ability to monitor North Atlantic right whale vital rates and
          anthropogenic impacts is entirely dependent on the North Atlantic
          Right Whale Consortium Identification Database (Catalog), curated by
          the Anderson Cabot Center for Ocean Life at the New England Aquarium
          and supported by decades of dedication by field survey teams,
          researchers, and managers throughout the range of this species.
        </p>

        <p className='text-lg'>
          North Atlantic right whale population, calving, injury, and mortality
          data accessible here are meant to provide general context to the state
          of the North Atlantic right whale. Information presented here
          represents the best available data at the time of visualization and
          may update as more information becomes available.
        </p>
        <p className='text-lg'>
          Because systematic surveys for North Atlantic right whales began in
          the early 1980s, graphs presented on this site default to a 1980 start
          year, with the exception of the population estimate graph which starts
          in 1990. Users can select prior years using the sliding year range bar
          if desired.
        </p>
        <div className='mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>
            Data Usage and Citation
          </h2>
          <p className='text-lg'>
            Data and visualizations available here may <b>only</b> be used with
            the following credit:
          </p>
          <div className='mt-4 p-4 bg-white rounded flex items-center gap-4'>
            <p className='font-mono text-sm flex-1'>
              Right Whale Anthropogenic Injury Visualization Site. 2025. Boston,
              MA: New England Aquarium. Accessed&nbsp;
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              . {window.location.origin}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Right Whale Anthropogenic Injury Visualization Site. 2025. Boston, MA: New England Aquarium. Accessed ${new Date().toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}. ${window.location.origin}`
                )
              }}
              className='shrink-0 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label='Copy citation to clipboard'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
