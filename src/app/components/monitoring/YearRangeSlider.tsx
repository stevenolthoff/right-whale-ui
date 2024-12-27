import React from 'react'

interface YearRangeSliderProps {
  yearRange: [number, number]
  minYear: number
  maxYear: number
  onChange: (range: [number, number]) => void
}

export const YearRangeSlider = ({
  yearRange,
  minYear,
  maxYear,
  onChange,
}: YearRangeSliderProps) => (
  <div className='flex items-center space-x-4'>
    <span className='text-sm text-gray-600'>{yearRange[0]}</span>
    <input
      type='range'
      min={minYear}
      max={yearRange[1]}
      value={yearRange[0]}
      onChange={(e) => onChange([parseInt(e.target.value), yearRange[1]])}
      className='flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer'
    />
    <span className='text-sm text-gray-600'>{yearRange[1]}</span>
    <input
      type='range'
      min={yearRange[0]}
      max={maxYear}
      value={yearRange[1]}
      onChange={(e) => onChange([yearRange[0], parseInt(e.target.value)])}
      className='flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer'
    />
  </div>
)
