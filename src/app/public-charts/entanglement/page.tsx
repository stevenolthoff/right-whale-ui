'use client' // This is a client component 👈🏽
import React, { useRef, useEffect } from 'react'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from 'f38218f71bb1a1f8'
import ChartLayout from '../../components/chartLayout.tsx'

export default function MortalityTotal() {
  const viewofYearSliderRef = useRef<HTMLDivElement>(null)
  const entanglementSeverityStackedBarPlotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name: string) => {
      if (name === 'viewof yearSlider')
        return new Inspector(viewofYearSliderRef.current)
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

  return (
    <ChartLayout
      title='Entanglement'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    >
      <div className='flex flex-col gap-4 py-8'>
        <div ref={entanglementSeverityStackedBarPlotRef} />
        <div
          ref={viewofYearSliderRef}
          className='outline outline-slate-200 rounded-md px-8 py-4 w-fit mx-auto'
        />
      </div>
    </ChartLayout>
  )
}
