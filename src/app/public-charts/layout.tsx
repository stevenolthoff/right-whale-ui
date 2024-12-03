'use client' // This is a client component 👈🏽

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type ChartOption =
  | 'mortality-total'
  | 'mortality-by-country'
  | 'mortality-by-cause-of-death'
  | 'mortality-by-cause-of-death-and-country'
  | 'calving'
  | 'injury-total'
  | 'entanglement'

export default function PublicChartsLayout({
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
        <p className='uppercase font-semibold text-slate-500'>Mortality</p>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'mortality-total' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('mortality-total')}
        >
          <Link href='/public-charts/mortality-total'>Total</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'mortality-by-country'
              ? 'text-blue-500'
              : 'text-slate-800'
          )}
          onClick={() => setSelected('mortality-by-country')}
        >
          <Link href='/public-charts/mortality-by-country'>By Country</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'mortality-by-cause-of-death'
              ? 'text-blue-500'
              : 'text-slate-800'
          )}
          onClick={() => setSelected('mortality-by-cause-of-death')}
        >
          <Link href='/public-charts/mortality-by-cause-of-death'>
            By Cause of Death
          </Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'mortality-by-cause-of-death-and-country'
              ? 'text-blue-500'
              : 'text-slate-800'
          )}
          onClick={() => setSelected('mortality-by-cause-of-death-and-country')}
        >
          <Link href='/public-charts/mortality-by-cause-of-death-and-country'>
            By Cause of Death and Country
          </Link>
        </div>
        <p className='uppercase font-semibold text-slate-500 mt-4'>Calving</p>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'calving' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('calving')}
        >
          <Link href='/public-charts/calving'>Total</Link>
        </div>
        <p className='uppercase font-semibold text-slate-500 mt-4'>Injury</p>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'injury-total' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('injury-total')}
        >
          <Link href='/public-charts/injury-total'>Total</Link>
        </div>
        <div
          className={twMerge(
            listItemClassName,
            selected === 'entanglement' ? 'text-blue-500' : 'text-slate-800'
          )}
          onClick={() => setSelected('entanglement')}
        >
          <Link href='/public-charts/entanglement'>Entanglement</Link>
        </div>
      </div>
      <div></div>
      <div>{children}</div>
    </div>
  )
}
