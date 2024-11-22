'use client' // This is a client component 👈🏽

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ChartOption = 'injury' | 'entanglement' | 'gear' | 'vessel' | 'custom'

export default function InjuryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [selected, setSelected] = useState<ChartOption>('injury')
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
      <div></div>
      <div>{children}</div>
    </div>
  )
}
