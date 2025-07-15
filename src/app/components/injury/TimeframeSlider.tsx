'use client'
import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface TimeframeSliderProps {
  timeframeRange: [number, number]
  minTimeframe: number
  maxTimeframe: number
  onChange: (range: [number, number]) => void
}

export const TimeframeSlider: React.FC<TimeframeSliderProps> = ({
  timeframeRange,
  minTimeframe,
  maxTimeframe,
  onChange,
}) => {
  return (
    <div className='flex items-center gap-2 h-[32px]'>
      <span className='text-xs text-gray-500 min-w-[50px]'>{timeframeRange[0]} days</span>
      <Slider
        range
        min={minTimeframe}
        max={maxTimeframe}
        value={timeframeRange}
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
      <span className='text-xs text-gray-500 min-w-[50px] text-right'>{timeframeRange[1] === maxTimeframe ? `${maxTimeframe}+` : timeframeRange[1]} days</span>
    </div>
  )
} 
