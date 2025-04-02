'use client'
import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface AgeRangeSliderProps {
  ageRange: [number, number]
  minAge: number
  maxAge: number
  onChange: (range: [number, number]) => void
}

export const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({
  ageRange,
  minAge,
  maxAge,
  onChange,
}) => {
  return (
    <div className='flex items-center gap-2 h-[32px]'>
      <span className='text-xs text-gray-500 min-w-[32px]'>{ageRange[0]}</span>
      <Slider
        range
        min={minAge}
        max={maxAge}
        value={ageRange}
        onChange={(value) => onChange(value as [number, number])}
        className='flex-1'
        railStyle={{ backgroundColor: '#E5E7EB' }}
        trackStyle={[{ backgroundColor: '#3B82F6' }]}
        handleStyle={[
          {
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            width: 14,
            height: 14,
          },
          {
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            width: 14,
            height: 14,
          },
        ]}
      />
      <span className='text-xs text-gray-500 min-w-[32px]'>{ageRange[1]}</span>
    </div>
  )
}
