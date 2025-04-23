import React, { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import { PopupSection } from '../layout'

interface DisclaimerPopupProps {
  open: boolean
  onClose: () => void
  initialSection: PopupSection
}

export function DisclaimerPopup({
  open,
  onClose,
  initialSection,
}: DisclaimerPopupProps) {
  const aboutSectionRef = useRef<HTMLHeadingElement>(null)
  const dataAccessSectionRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open && initialSection) {
      setTimeout(() => {
        if (initialSection === 'about') {
          aboutSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        } else if (initialSection === 'data-access') {
          dataAccessSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 100) // Small delay to ensure the popup is fully rendered
    }
  }, [open, initialSection])

  return (
    <>
      <dialog
        id='my_modal_2'
        className={twMerge('modal bg-black/60', open ? 'modal-open' : '')}
      >
        <div className='modal-box bg-white max-w-none md:max-w-4xl p-0 overflow-hidden flex flex-col h-screen md:h-[90vh] w-full md:w-auto m-0 md:m-auto rounded-none md:rounded-lg'>
          {/* Header */}
          <div className='p-6 flex justify-between items-center border-b flex-shrink-0'>
            <h1 className='text-2xl font-bold'>
              Welcome to the North Atlantic Right Whale Anthropogenic
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

          {/* Scrollable Content */}
          <div className='flex-grow overflow-y-auto'>
            {/* Hero Image */}
            <div className='relative w-full h-48 md:h-64 flex-shrink-0'>
              <Image
                src='/whale-info.webp'
                alt='Whale Tail'
                fill
                className='object-cover'
              />
            </div>

            <div className='p-4 md:p-6'>
              <p className='mb-6'>
                The North Atlantic Right Whale Anthropogenic Injury
                Visualization Site was developed to provide improved access to,
                and visualization of, information and data associated with
                anthropogenic injuries to right whales. The data illustrated on
                this site represent a nearly 50-year collaboration of
                stakeholders in the North Atlantic Right Whale Consortium.
              </p>

              <p className='mb-6'>
                To learn more about North Atlantic Right Whales and
                anthropogenic impacts on the species, please visit the&nbsp;
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

              <h2
                ref={aboutSectionRef}
                className='text-xl font-bold mb-3 scroll-mt-6'
              >
                About the Platform
              </h2>
              <p className='mb-6'>
                The North Atlantic right whale remains one of the most
                endangered large whales in the world, and the population has
                been in decline since 2010. Anthropogenic sources of mortality
                continue to plague this species; all adult and juvenile right
                whale mortalities from 2003-2018 for which a cause of death
                could be determined were due to human activities (entanglement
                or vessel strike). Anthropogenic injuries, including vessel
                strikes and entanglement in fishing gear, may also have a more
                significant impact on the growth rates of the North Atlantic
                population than other large whale species and are likely
                reducing the biological potential of reproductive females.
              </p>

              <p className='mb-6'>
                The ability to comprehensively evaluate trends in and
                characteristics of anthropogenic injury on right whales is
                critical to not only understanding their biological impact but
                also to effectively mitigate deleterious interactions between
                right whales and humans and evaluate these mitigation measures.
                Although the data to do so exist in various locations,
                consistent and standardized outputs that can be easily accessed
                and provided to interested parties have not been available.
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
                Atlantic Right Whale Consortium Identification Database),
                allowing for semi-automated linkage and retrieval of injury and
                life history related information for individual whales.
              </p>

              <p className='mb-6'>
                The Right Whale Anthropogenic Event Visualization Site allows
                for public access to, and viewing of, general mortality,
                calving, and injury data. Additionally, permissioned users can
                interact with and view AED data through data filters and
                pre-packaged queries. Data visualization output products are
                available for regularly sought after data extracts.
              </p>

              <h2
                ref={dataAccessSectionRef}
                className='text-xl font-bold mb-3 scroll-mt-6'
              >
                Data Access & Use
              </h2>
              <p className='mb-6'>
                The Right Whale Anthropogenic Event Visualization Site serves
                multiple user purposes and as such, data and visualization
                output access varies by user. Publicly available data and
                graphics are accessible through the &quot;Explore&quot; tab.
                Near real time injury monitoring data are accessible by field
                teams and managers and are meant to facilitate efforts in
                support of the ongoing Unusual Mortality Event. Injury event
                data, derived from detailed annual assessments of scars, active
                entanglements, and associated data, are accessible for
                management and related activities. Access to, and use of, data
                on this site are under the purview of the North Atlantic Right
                Whale Consortium Data Access Protocols. Data may not be shared
                or used without a formal data access request submission
                available through the{' '}
                <a
                  href='https://www.narwc.org/accessing-narwc-data.html'
                  className='text-blue-500'
                >
                  NARWC
                </a>
                &nbsp;For questions about site/data access, please contact the{' '}
                <a href='mailto:hpettis@neaq.org' className='text-blue-500'>
                  site admin
                </a>
                .
              </p>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className='border-t p-4 flex justify-end flex-shrink-0 bg-white'>
            <button
              type='button'
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out'
              onClick={onClose}
            >
              CLOSE
            </button>
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
        <form
          method='dialog'
          className='modal-backdrop bg-black/60'
          onClick={onClose}
        >
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default DisclaimerPopup
