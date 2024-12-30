'use client'
import React from 'react'
import { useInjuryData } from '@/app/hooks/useInjuryData'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { useYearRange } from '@/app/hooks/useYearRange'
import { Loader } from '@/app/components/ui/Loader'

export default function VesselStrike() {
  const { data, loading, error } = useInjuryData()
  const { yearRange, setYearRange, minYear, maxYear } = useYearRange(data)

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  // ... rest of component
} 
