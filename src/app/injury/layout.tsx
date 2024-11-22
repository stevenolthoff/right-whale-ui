'use client' // This is a client component 👈🏽

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type ChartOption =
  | 'injury-type-by-year'
  | 'entanglement'
  | 'gear-vs-no-gear'
  | 'vessel-strike-by-year'
  | 'custom'

export default function InjuryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const endOfPath = usePathname().split('/').pop()
  const [selected, setSelected] = useState<ChartOption>(endOfPath)
  const listItemClassName =
    'text-xl hover:cursor-pointer hover:text-blue-500 active:text-blue-800'
  return (
    <div className='flex p-8 gap-8'>
      <div className='flex flex-col'>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'injury-type-by-year'
              ? 'text-blue-500'
              : 'text-slate-800'
          )}
          onClick={() => setSelected('injury-type-by-year')}
        >
          <Link href='/injury/injury-type-by-year'>Injury Type by Year</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'entanglement' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('entanglement')}
        >
          <Link href='/injury/entanglement'>Entanglement</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'gear-vs-no-gear' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('gear-vs-no-gear')}
        >
          <Link href='/injury/gear-vs-no-gear'>Gear VS No Gear</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'vessel-strike-by-year'
              ? 'text-blue-500'
              : 'text-slate-800'
          )}
          onClick={() => setSelected('vessel-strike-by-year')}
        >
          <Link href='/injury/vessel-strike-by-year'>
            Vessel Strike by Year
          </Link>
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
