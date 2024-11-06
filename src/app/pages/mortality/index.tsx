'use client' // This is a client component 👈🏽

import React, { useRef, useEffect } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from 'f38218f71bb1a1f8'

export default function Mortality() {
  const viewofYearSliderRef = useRef()
  const mortalitiesByYearPlotRef = useRef()
  const countryMortalitiesByYearPlotRef = useRef()
  const causeOfDeathMortalitiesByYearPlotRef = useRef()

  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      if (name === 'viewof yearSlider')
        return new Inspector(viewofYearSliderRef.current)
      if (name === 'mortalitiesByYearPlot')
        return new Inspector(mortalitiesByYearPlotRef.current)
      if (name === 'countryMortalitiesByYearPlot')
        return new Inspector(countryMortalitiesByYearPlotRef.current)
      if (name === 'causeOfDeathMortalitiesByYearPlot')
        return new Inspector(causeOfDeathMortalitiesByYearPlotRef.current)
      return [
        'filteredRows',
        'thresholds',
        'groupedData',
        'countries',
        'flatData',
        'stackedData',
      ].includes(name)
    })
    return () => runtime.dispose()
  }, [])

  return (
    <div className='flex flex-col gap-4 items-center'>
      <div ref={viewofYearSliderRef} className='sticky top-0 pt-8' />
      <div ref={mortalitiesByYearPlotRef} />
      <div ref={countryMortalitiesByYearPlotRef} />
      <div ref={causeOfDeathMortalitiesByYearPlotRef} />
    </div>
  )
}
