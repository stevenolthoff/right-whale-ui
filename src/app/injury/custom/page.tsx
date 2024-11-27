'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'

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
    <div>
      <div ref={viewofColumnDropdownRef} />
      <div ref={viewofColumnValueInputRef} />
      <div ref={viewofCustomPlotSliderRef} />
      <div ref={customBarPlotRef} />
    </div>
  )
}
