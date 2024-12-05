'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'
import ChartLayout from '../../components/chartLayout.tsx'

export default function Entanglement() {
  const viewofVesselStrikeSliderRef = useRef<HTMLDivElement>(null)
  const vesselStrikeTotalsPlotRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      if (name === 'viewof vesselStrikeSlider')
        return new Inspector(viewofVesselStrikeSliderRef.current)
      if (name === 'vesselStrikeTotalsPlot')
        return new Inspector(vesselStrikeTotalsPlotRef.current)
      return [
        'vesselStrikeFilteredData',
        'vesselStrikeTotalsFiltered',
        'strikeTypeStackedBar',
        'vesselStrikeTotalsFilteredWithYear',
      ].includes(name)
    })
    return () => runtime.dispose()
  }, [])
  return (
    <ChartLayout
      title='Vessel Strike'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    >
      <div className='flex flex-col gap-4 py-8'>
        <div
          ref={vesselStrikeTotalsPlotRef}
          className='min-w-[950px] min-h-[500px] animate-fade-in'
        />
        <div
          ref={viewofVesselStrikeSliderRef}
          className='outline outline-slate-200 rounded-md px-8 py-4 w-fit mx-auto min-w-[408px] min-h-[58px] animate-fade-in'
        />
      </div>
    </ChartLayout>
  )
}
