'use client' // This is a client component 👈🏽
import React, { useRef, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Runtime, Inspector } from '@observablehq/runtime'
import notebook from 'c545da94fc314b5e'

type ChartOption = 'injury' | 'entanglement' | 'gear' | 'vessel' | 'custom'

export default function InjuryTypeByYear() {
  const [selected, setSelected] = useState<ChartOption>('injury')

  const viewofInjuryTypeRef = useRef<HTMLDivElement>(null)
  const injuryTypeStackedBarRef = useRef<HTMLDivElement>(null)
  const viewofVesselStrikeSliderRef = useRef<HTMLDivElement>(null)
  const strikeTypeStackedBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const runtime = new Runtime()
    runtime.module(notebook, (name) => {
      // if (name === 'viewof injuryType')
      // return new Inspector(viewofInjuryTypeRef.current)
      //       if (name === 'injuryTypeStackedBar')
      //         return new Inspector(injuryTypeStackedBarRef.current)
      //       if (name === 'viewof vesselStrikeSlider')
      //         return new Inspector(viewofVesselStrikeSliderRef.current)
      //       if (name === 'strikeTypeStackedBar')
      //         return new Inspector(strikeTypeStackedBarRef.current)
      //       return ['filteredData', 'vesselStrikeFilteredData'].includes(name)
    })
    //     return () => runtime.dispose()
  }, [])

  const listItemClassName =
    'text-xl hover:cursor-pointer hover:text-blue-500 active:text-blue-800'

  return (
    <div className='flex p-8 gap-8'>
      <div className='flex flex-col'>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'injury' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('injury')}
        >
          Injury Type by Year
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'entanglement' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('entanglement')}
        >
          Entanglement by Year
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'gear' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('gear')}
        >
          Gear VS No Gear
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'vessel' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('vessel')}
        >
          Vessel Strike by Year
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'custom' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('custom')}
        >
          Build Your Own
        </div>
      </div>
      <div>
        <div>Title</div>
        <>
          <div ref={viewofInjuryTypeRef} />
          <div ref={injuryTypeStackedBarRef} />
        </>
        <>
          <div ref={viewofVesselStrikeSliderRef} />
          <div ref={strikeTypeStackedBarRef} />
        </>
      </div>
    </div>
  )
}
