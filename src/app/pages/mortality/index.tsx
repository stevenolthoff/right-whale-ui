'use client' // This is a client component 👈🏽

import React, { useRef, useEffect } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from 'f38218f71bb1a1f8'
import ScrollIntoView from 'react-scroll-into-view'

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

  const listItemClassName =
    'text-xl text-slate-800 hover:cursor-pointer hover:text-blue-500 active:text-blue-800'

  return (
    <div className='flex h-full'>
      <div className='sticky top-0 pt-8 pl-8 h-full w-1/4 flex flex-col gap-2'>
        <p className='uppercase font-semibold text-slate-500'>Mortality</p>
        <ScrollIntoView
          selector='#mortalitiesByYearPlot'
          scrollOptions={{ block: 'center' }}
        >
          <p className={listItemClassName}>Total</p>
        </ScrollIntoView>
        <ScrollIntoView
          selector='#countryMortalitiesByYearPlot'
          scrollOptions={{ block: 'center' }}
        >
          <p className={listItemClassName}>By Country</p>
        </ScrollIntoView>
        <ScrollIntoView
          selector='#causeOfDeathMortalitiesByYearPlot'
          scrollOptions={{ block: 'center' }}
        >
          <p className={listItemClassName}>By Cause of Death</p>
        </ScrollIntoView>
        <p className={listItemClassName}>By Cause of Death and Country</p>
        <p className='uppercase font-semibold text-slate-500'>Calving</p>
        <p className='uppercase font-semibold text-slate-500'>Injury</p>
        <p className={listItemClassName}>Total</p>
        <p className={listItemClassName}>Entanglement: Gear VS No Gear</p>
      </div>
      <div className='flex flex-col gap-4 items-center'>
        <div ref={viewofYearSliderRef} className='sticky top-0 pt-8' />
        <div id='mortalitiesByYearPlot' ref={mortalitiesByYearPlotRef} />
        <div
          id='countryMortalitiesByYearPlot'
          ref={countryMortalitiesByYearPlotRef}
        />
        <div
          id='causeOfDeathMortalitiesByYearPlot'
          ref={causeOfDeathMortalitiesByYearPlotRef}
        />
      </div>
    </div>
  )
}
