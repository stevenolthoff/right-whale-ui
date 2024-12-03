'use client' // This is a client component 👈🏽

import React, { useRef, useEffect } from 'react'

import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from 'f38218f71bb1a1f8'
import ScrollIntoView from 'react-scroll-into-view'

export default function Mortality() {
  const viewofYearSliderRef = useRef<HTMLDivElement>(null)
  const mortalitiesByYearPlotRef = useRef<HTMLDivElement>(null)
  const countryMortalitiesByYearPlotRef = useRef<HTMLDivElement>(null)
  const causeOfDeathMortalitiesByYearPlotRef = useRef<HTMLDivElement>(null)
  const countryCODPlotRef = useRef<HTMLDivElement>(null)
  const calvingTotalsPlotRef = useRef<HTMLDivElement>(null)
  const injuryTotalsPlotRef = useRef<HTMLDivElement>(null)
  const entanglementSeverityStackedBarPlotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name: string) => {
      if (name === 'viewof yearSlider')
        return new Inspector(viewofYearSliderRef.current)
      if (name === 'mortalitiesByYearPlot')
        return new Inspector(mortalitiesByYearPlotRef.current)
      if (name === 'countryMortalitiesByYearPlot')
        return new Inspector(countryMortalitiesByYearPlotRef.current)
      if (name === 'causeOfDeathMortalitiesByYearPlot')
        return new Inspector(causeOfDeathMortalitiesByYearPlotRef.current)
      if (name === 'countryCODPlot')
        return new Inspector(countryCODPlotRef.current)
      if (name === 'calvingTotalsPlot')
        return new Inspector(calvingTotalsPlotRef.current)
      if (name === 'injuryTotalsPlot')
        return new Inspector(injuryTotalsPlotRef.current)
      if (name === 'entanglementSeverityStackedBarPlot')
        return new Inspector(entanglementSeverityStackedBarPlotRef.current)
      return [
        'filteredRows',
        'filteredCalvingRows',
        'filteredInjuryRows',
        'thresholds',
        'entanglementSeverityProcessedData',
        'entanglementSeverityFormattedData',
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
        <p className={listItemClassName}>Total</p>
        <p className={listItemClassName}>By Country</p>
        <p className={listItemClassName}>By Cause of Death</p>
        <p className={listItemClassName}>By Cause of Death and Country</p>
        <p className='uppercase font-semibold text-slate-500 hover:cursor-pointer hover:text-blue-500 active:text-blue-800'>
          Calving
        </p>
        <p className='uppercase font-semibold text-slate-500'>Injury</p>
        <p className={listItemClassName}>Total</p>
        <p className={listItemClassName}>Entanglement: Gear VS No Gear</p>
      </div>
      <div className='flex flex-col gap-4 items-center'>
        <div
          ref={viewofYearSliderRef}
          className='sticky top-8 mt-8 bg-slate-100 outline outline-slate-200 rounded-md px-8 py-4 shadow-md'
        />
        {/* <div id='mortalitiesByYearPlot' ref={mortalitiesByYearPlotRef} />
        <div
          id='countryMortalitiesByYearPlot'
          ref={countryMortalitiesByYearPlotRef}
        />
        <div
          id='causeOfDeathMortalitiesByYearPlot'
          ref={causeOfDeathMortalitiesByYearPlotRef}
        />
        <div id='countryCODPlot' ref={countryCODPlotRef} />
        <div id='calvingTotalsPlot' ref={calvingTotalsPlotRef} />
        <div id='injuryTotalsPlot' ref={injuryTotalsPlotRef} />
        <div
          id='entanglementSeverityStackedBarPlot'
          ref={entanglementSeverityStackedBarPlotRef}
        /> */}
      </div>
    </div>
  )
}
