'use client'
import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface YearRangeSliderProps {
  yearRange: [number, number]
  minYear: number
  maxYear: number
  onChange: (range: [number, number]) => void
}

export const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
  yearRange,
  minYear,
  maxYear,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 h-[32px]">
      <span className="text-xs text-gray-500 min-w-[32px]">{yearRange[0]}</span>
      <Slider
        range
        min={minYear}
        max={maxYear}
        value={yearRange}
        onChange={(value) => onChange(value as [number, number])}
        className="flex-1"
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
      <span className="text-xs text-gray-500 min-w-[32px]">{yearRange[1]}</span>
    </div>
  )
}
