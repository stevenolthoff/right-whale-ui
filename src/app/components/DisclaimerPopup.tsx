import React from 'react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

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
        <div className='modal-box max-w-4xl p-0 overflow-hidden'>
          {/* Header */}
          <div className='p-6 flex justify-between items-center border-b'>
            <h1 className='text-2xl font-bold'>
              Welcome to the North Atlantic Right Whale Anthropogenic Events
              Visualization Site
            </h1>
            <Image
              src='/logo.png'
              alt='NEAQ Logo'
              width={50}
              height={50}
              className='ml-4 w-0 h-0 md:w-[178px] md:h-[100px]'
            />
          </div>

          {/* Hero Image */}
          <div className='relative w-full h-64'>
            <Image
              src='/whale-info.webp'
              alt='Whale Tail'
              fill
              className='object-cover'
            />
          </div>

          {/* Content */}
          <div className='p-6'>
            <p className='mb-6'>
              The North Atlantic Right Whale Anthropogenic Events Visualization
              Site was developed to provide improved access to, and
              visualization of, information and data associated with
              anthropogenic injuries to right whales. The data illustrated on
              this site represent a nearly 50-year collaboration of stakeholders
              in the North Atlantic Right Whale Consortium.
            </p>

            <p className='mb-6'>
              To learn more about North Atlantic Right Whales and anthropogenic
              impacts on the species, please visit the&nbsp;
              <a href='/resources' className='text-blue-500'>
                resources page
              </a>
              .
            </p>

            <p className='mb-6'>
              Click here to visit the{' '}
              <a
                href='https://www.neaq.org/animal/right-whales/'
                className='text-blue-500'
              >
                New England Aquarium Site
              </a>
              .
            </p>

            {/* Button Section */}
            <div className='grid grid-cols-3 gap-4 mb-8'>
              <button className='btn bg-blue-700 hover:bg-blue-800 text-white'>
                ABOUT
              </button>
              <button className='btn bg-blue-700 hover:bg-blue-800 text-white'>
                DATA ACCESS & USE
              </button>
              <button className='btn bg-blue-700 hover:bg-blue-800 text-white'>
                USER'S GUIDE
              </button>
            </div>

            <h2 className='text-xl font-bold mb-3'>About the Platform</h2>
            <p className='mb-6'>
              This platform was designed for exploring the spatial and temporal
              patterns of acoustic detection data of cetacean species. A series
              of interactive data visualization tools can be used to view
              detections over different seasons, years, and areas.
            </p>

            {/* Close button */}
            <div className='flex justify-end mt-8'>
              <button
                type='button'
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out'
                onClick={onClose}
              >
                CLOSE
              </button>
            </div>
          </div>

          {/* X button */}
          <form method='dialog'>
            <button
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white'
              onClick={onClose}
            >
              ✕
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop' onClick={onClose}>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default DisclaimerPopup
