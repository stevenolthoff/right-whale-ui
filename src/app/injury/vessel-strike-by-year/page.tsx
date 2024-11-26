'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'

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
    <div>
      <div ref={viewofVesselStrikeSliderRef} />
      <div>Total Vessel Strikes by Year</div>
      <div ref={vesselStrikeTotalsPlotRef} />
    </div>
  )
}
