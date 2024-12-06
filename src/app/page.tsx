'use client'
import NoSsr from './components/NoSsr.tsx'
import React, { useState } from 'react'
import Hero from '@/components/hero.tsx'
import HomeInfo from '@/components/homeInfo.tsx'
import { twMerge } from 'tailwind-merge'
import { useLocalStorage } from '@uidotdev/usehooks'

export function Popup() {
  const [seenPopup, setSeenPopup] = useLocalStorage('seenPopup', false)
  const [open, setOpen] = useState(!seenPopup)

  return (
    <>
      <dialog
        id='my_modal_2'
        className={twMerge('modal', open ? 'modal-open' : '')}
      >
        <div className='modal-box'>
          <form method='dialog'>
            <button
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
              onClick={() => {
                setOpen(false)
                setSeenPopup(true)
              }}
            >
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Disclaimer</h3>
          <p className='py-4'>
            Disclaimer text: Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Praesent id iaculis eros. Suspendisse tempor quam in elit
            molestie varius sit amet ac arcu. In vulputate, justo eget efficitur
            lacinia, quam velit blandit nisl, et elementum ante lacus
            sollicitudin justo.
          </p>
          <button
            type='button'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white text-base tracking-wide px-6 py-3 rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl'
            onClick={() => {
              setOpen(false)
              setSeenPopup(true)
            }}
          >
            Accept
          </button>
        </div>
        <form
          method='dialog'
          className='modal-backdrop'
          onClick={() => {
            setOpen(false)
            setSeenPopup(true)
          }}
        >
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default function Home() {
  return (
    <NoSsr>
      <main>
        <Hero></Hero>
        <HomeInfo></HomeInfo>
        <Popup></Popup>
      </main>
    </NoSsr>
  )
}
