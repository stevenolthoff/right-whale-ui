import React from 'react'
import { twMerge } from 'tailwind-merge'

interface DisclaimerPopupProps {
  open: boolean
  onClose: () => void
}

export function DisclaimerPopup({ open, onClose }: DisclaimerPopupProps) {
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
              onClick={onClose}
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
            onClick={onClose}
          >
            Accept
          </button>
        </div>
        <form method='dialog' className='modal-backdrop' onClick={onClose}>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default DisclaimerPopup
