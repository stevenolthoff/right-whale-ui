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
          <div className='p-6 overflow-scroll'>
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
              The North Atlantic right whale remains one of the most endangered
              large whales in the world, and the population has been in decline
              since 2010. Anthropogenic sources of mortality continue to plague
              this species; all adult and juvenile right whale mortalities from
              2003-2018 for which a cause of death could be determined were due
              to human activities (entanglement or vessel strike). Anthropogenic
              injuries, including vessel strikes and entanglement in fishing
              gear, may also have a more significant impact on the growth rates
              of the North Atlantic population than other large whale species
              and are likely reducing the biological potential of reproductive
              females.
            </p>

            <p className='mb-6'>
              The ability to comprehensively evaluate trends in and
              characteristics of anthropogenic injury on right whales is
              critical to not only understanding their biological impact but
              also to effectively mitigate deleterious interactions between
              right whales and humans and evaluate these mitigation measures.
              Although the data to do so exist in various locations, consistent
              and standardized outputs that can be easily accessed and provided
              to interested parties have not been available.
            </p>

            <p className='mb-6'>
              To better integrate injury data and improve efficacy and
              efficiency of data extraction and reporting, the Anthropogenic
              Events Database (AED) was created. This database is housed and
              curated at the New England Aquarium, collates available
              information on injury events (including injury type, severity,
              gear type, rope diameter and breaking strength, vessel size
              estimates, necropsy and gear reports) into one place, and is
              linked to the Right Whale Catalog (also referred to as the North
              Atlantic Right Whale Consortium Identification Database), allowing
              for semi-automated linkage and retrieval of injury and life
              history related information for individual whales.
            </p>

            <p className='mb-6'>
              The Right Whale Anthropogenic Event Visualization Site allows for
              public access to, and viewing of, general mortality, calving, and
              injury data. Additionally, permissioned users can interact with
              and view AED data through data filters and pre-packaged queries.
              Data visualization output products are available for regularly
              sought after data extracts.
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
