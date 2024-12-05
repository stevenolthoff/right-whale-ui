'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'
import ChartLayout from '../../components/chartLayout.tsx'
import './custom.css'

export default function Entanglement() {
  const viewofColumnDropdownRef = useRef<HTMLDivElement>(null)
  const viewofColumnValueInputRef = useRef<HTMLDivElement>(null)
  const viewofCustomPlotSliderRef = useRef<HTMLDivElement>(null)
  const customBarPlotRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      if (name === 'viewof columnDropdown')
        return new Inspector(viewofColumnDropdownRef.current)
      if (name === 'viewof columnValueInput')
        return new Inspector(viewofColumnValueInputRef.current)
      if (name === 'viewof customPlotSlider')
        return new Inspector(viewofCustomPlotSliderRef.current)
      if (name === 'customBarPlot')
        return new Inspector(customBarPlotRef.current)
      return ['columnOptions', 'filteredCustomPlotRows'].includes(name)
    })
    return () => runtime.dispose()
  }, [])
  return (
    <ChartLayout
      title='Build Your Own Chart'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    >
      <div className='flex flex-col gap-4 py-8'>
        <div
          ref={viewofColumnDropdownRef}
          className='custom-chart outline outline-slate-200 rounded-md px-8 py-4 w-fit mx-auto min-w-[430px] min-h-[100px] animate-fade-in'
        />
        <div
          ref={viewofColumnValueInputRef}
          className='custom-chart outline outline-slate-200 rounded-md px-8 py-4 w-fit mx-auto min-w-[430px] min-h-[100px] animate-fade-in'
        />
        <div
          ref={customBarPlotRef}
          className='min-w-[950px] min-h-[500px] animate-fade-in'
        />
        <div
          ref={viewofCustomPlotSliderRef}
          className='outline outline-slate-200 rounded-md px-8 py-4 w-fit mx-auto min-w-[408px] min-h-[58px] animate-fade-in'
        />
      </div>
    </ChartLayout>
  )
}
