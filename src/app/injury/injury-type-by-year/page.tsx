'use client'
import React, { useEffect, useRef } from 'react'
import notebook from 'c545da94fc314b5e'
import { Runtime, Inspector } from '@observablehq/runtime'

export default function InjuryTypeByYear() {
  const viewofInjuryTypeRef = useRef<HTMLDivElement>(null)
  const injuryTypeStackedBarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      if (name === 'viewof injuryType')
        return new Inspector(viewofInjuryTypeRef.current)
      if (name === 'injuryTypeStackedBar')
        return new Inspector(injuryTypeStackedBarRef.current)
      return ['filteredData'].includes(name)
    })
    return () => runtime.dispose()
  }, [])
  return (
    <div>
      <div ref={viewofInjuryTypeRef} />
      <div ref={injuryTypeStackedBarRef} />
    </div>
  )
}
