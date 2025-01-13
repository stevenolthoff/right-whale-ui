'use client'
import React from 'react'

export default function Overview() {
  return (
    <div className=''>
      <div className='space-y-6 text-gray-700 leading-relaxed'>
        <p className='text-lg'>
          North Atlantic right whale mortality, calving, and injury data
          accessible here are the product of decades of dedication by field
          survey teams, researchers, and managers throughout the range of this
          species. Information presented here represents the best available data
          at the time of visualization and may update as more information
          becomes available.
        </p>

        <p className='text-lg'>
          Because systematic surveys for North Atlantic right whales began in
          the early 1980s, graphs presented on this site default to a 1980 start
          year. Users can select prior years using the sliding year range bar if
          desired.
        </p>

        <div className='mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>
            Data Usage and Citation
          </h2>
          <p className='text-lg'>
            Data and visualizations available here are publicly available and
            may be used with the following credit:
          </p>
          <p className='mt-4 p-4 bg-white rounded font-mono text-sm'>
            Right Whale Anthropogenic Event Visualization Site. 2025. Boston,
            MA: New England Aquarium [accessed date]. {window.location.origin}
          </p>
        </div>
      </div>
    </div>
  )
}
