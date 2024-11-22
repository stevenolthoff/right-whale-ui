'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'

export default function Entanglement() {
  const viewofEntanglementSliderRef = useRef<HTMLDivElement>(null)
  const gearStackedBarPlotRef = useRef<HTMLDivElement>(null)
  const entanglementTotalBarPlotRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      if (name === 'viewof entanglementSlider')
        return new Inspector(viewofEntanglementSliderRef.current)
      if (name === 'gearStackedBarPlot')
        return new Inspector(gearStackedBarPlotRef.current)
      if (name === 'entanglementTotalBarPlot')
        return new Inspector(entanglementTotalBarPlotRef.current)
      return [
        'entanglementFilteredData',
        'gearStackedProcessedData',
        'entanglementTotalFormattedData',
        'gearStackedFormattedData',
      ].includes(name)
    })
    return () => runtime.dispose()
  }, [])
  return (
    <div>
      <div ref={viewofEntanglementSliderRef} />
      <div>Gear VS No Gear</div>
      <div ref={gearStackedBarPlotRef} />
      <div>Entanglement Total</div>
      <div ref={entanglementTotalBarPlotRef} />
    </div>
  )
}
