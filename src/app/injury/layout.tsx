'use client'
import React, { useEffect } from 'react'
import Sidebar from '../components/monitoring/Sidebar'
import { usePathname } from 'next/navigation'
import { useWhaleInjuryDataStore } from '../stores/useWhaleInjuryDataStore'
import { useAuthStore } from '../store/auth'

// Helper function to compute the incomplete years
// Based on client explanation: data becomes "completed" towards the end of the year
// So if we're in 2024, years 2022-2024 are considered incomplete
function getIncompleteYears(): { startYear: number; endYear: number } {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 2
  const endYear = currentYear
  return { startYear, endYear }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { token } = useAuthStore()
  const fetchData = useWhaleInjuryDataStore((state) => state.fetchData)

  useEffect(() => {
    if (token) {
      fetchData(token)
    }
  }, [token, fetchData])

  // Get the incomplete years for the disclaimer
  const { startYear, endYear } = getIncompleteYears()
  const disclaimerText = `Data for ${startYear}-${endYear} are not yet complete and should not be interpreted as such.`

  const text: Record<
    string,
    { title: string; description: string | React.ReactNode }
  > = {
    '/injury/overview': {
      title: '',
      description: (
        <div className='space-y-4'>
          <div className='text-3xl font-bold mb-6'>
            Introduction to the Data
          </div>
          <p className='text-lg text-gray-700 leading-relaxed'>
            The ability to monitor North Atlantic right whale anthropogenic
            injuries and their impacts is entirely dependent on the{' '}
            <a
              href='http://www.narwc.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              North Atlantic Right Whale Consortium
            </a>{' '}
            Identification Database (Catalog), curated by the Kraus Marine
            Mammal Conservation Program in the{' '}
            <a
              href='https://www.neaq.org/conservation-and-research/anderson-cabot-center-for-ocean-life/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              Anderson Cabot Center for Ocean Life
            </a>{' '}
            at the{' '}
            <a
              href='http://www.neaq.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              New England Aquarium
            </a>{' '}
            and supported by decades of dedication by field survey teams,
            researchers, and managers throughout the range of this species.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Since 1998, researchers at the New England Aquarium have carried out
            annual assessments of entanglement and vessel strike injuries to
            North Atlantic right whales. These assessments are comprehensive and
            include visual inspection of imagery from all sightings of known
            right whales to detect and evaluate indicators of injury presence
            and characteristics, as well as an evaluation of ancillary data
            associated with these injuries (e.g. fishing gear and vessel
            forensics, event response information, whale outcome, etc). These
            annual assessments are completed once all right whale data have been
            received and processed for a given year and as such, there is
            generally a two-year lag in these assessments. Additionally, these
            injury assessments are completed only for cataloged individuals and
            therefore, injured whales who have not been cataloged are not
            represented in these data.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            In addition to annual assessment of entanglements and vessel strikes
            described above, researchers at the New England Aquarium initiated
            efforts in 2013 to collaborate with survey teams to identify,
            report, and monitor sightings of injured right whales in near
            real-time. These efforts include assessments of all sighted right
            whales, both cataloged and not, for entanglement and vessel strike
            injuries, as well as injuries of unknown origin with the potential
            to impact right whale health and survival. These data are updated
            upon receipt of new and/or additional imagery and injury related
            information. Additionally, historical sightings of injured
            non-cataloged right whales not captured elsewhere are included in
            these monitoring efforts.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            North Atlantic right whale injury data accessible here represent a
            combination of annual entanglement and vessel strike injury
            assessments and near real-time monitoring efforts and are meant to
            provide comprehensive injury information and context to the state of
            human impacts on the species. For reasons outlined below, data here
            represent a minimum of injury events and are likely underestimates.
          </p>
          <ul className='text-lg text-gray-700 leading-relaxed space-y-2 ml-6 list-disc font-bold'>
            <li>Injuries must be detected to be counted.</li>
            <li>
              Poor quality, distant, and partial images of a whale as well as
              undetected mortalities of a whale may preclude the detection of an
              injury.
            </li>
            <li>
              There is generally a 2 year delay in the annual assessment data
              and therefore injury data displayed in visualizations and tables
              for the last two completed calendar years and forward should be
              considered a minimum number and underestimate of total injuries.
            </li>
          </ul>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Information presented in these injury page visualizations and data
            represents the best available data at the time of visualization and
            may be updated as more information becomes available.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Because systematic surveys for North Atlantic right whales began in
            the early 1980s, graphs presented on this site default to a 1980
            start year. Users can select prior years using the sliding year
            range bar if desired.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Data and visualizations available here may not be used or shared
            without an approved data access request from the{' '}
            <a
              href='http://www.narwc.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              North Atlantic Right Whale Consortium
            </a>
            .
          </p>
          <p className='text-lg text-gray-700 leading-relaxed font-semibold'>
            {disclaimerText}
          </p>
        </div>
      ),
    },
    '/injury/injury-type': {
      title: 'Total Annual Injuries',
      description: (
        <div className='space-y-4'>
          <p>
            Injury cases displayed here represent documented injuries to right
            whales to date, including entanglements, vessel strikes, and
            significant injuries of unknown or other (i.e. not entanglement or
            vessel strike) origin. Injuries are represented for both cataloged
            and unknown ID right whales. Additional narrative and analyses to
            entanglement and vessel strike injuries can be found in case studies
            and gear reports linked in the resources section of this site.
            Unknown/Other injuries captured here represent those that have the
            perceived potential to impact health and/or survival and do not
            reflect every documented injury/scar detected on right whales.
            Additionally, since assessments for these injury types began in 2013
            under the right whale monitoring work, injuries of unknown origin
            prior to 2013 are not captured here. Whales listed as &ldquo;Poor
            Body Condition&rdquo; and &ldquo;Dependent Calf&rdquo; are cases
            specific to the ongoing North Atlantic right whale Unusual Mortality
            Event (UME) which began in 2017. Broader population wide information
            on right whale health over time is accessible through the Visual
            Health Assessment Database via a NARWC data access request.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement': {
      title: 'Entanglement',
      description: (
        <div>
          <p>View entanglement-related injuries.</p>
          <p className='font-semibold mt-2'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/vessel-strike': {
      title: 'Vessel Strikes',
      description: (
        <div>
          <p>View vessel strike incidents by year.</p>
          <p className='font-semibold mt-2'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement/timeframe': {
      title: 'Entanglement Timeframe',
      description: (
        <div className='space-y-4'>
          <p>
            Detected entanglement events for North Atlantic right whales by
            timeframe of injury acquisition and year. Timeframe is calculated as
            days between the pre-injury sighting and the initial injury
            detection sighting. Whales for which there is no pre-injury
            detection sighting (i.e. unknown ID whale, whale&apos;s first
            sighting is with injury) do not have calculated timeframes.
          </p>
          <div>
            <span className='font-semibold'>
              Timeframes are defined as follows:
            </span>
            <ul className='mt-2 ml-6 list-disc space-y-1'>
              <li>
                <span className='font-mono'>&lt;3m</span> (
                <span className='font-mono'>&lt;90 days</span>)
              </li>
              <li>
                <span className='font-mono'>3-6m</span> (
                <span className='font-mono'>90-180 days</span>)
              </li>
              <li>
                <span className='font-mono'>6m – 1 yr</span> (
                <span className='font-mono'>181-365 days</span>)
              </li>
              <li>
                <span className='font-mono'>1yr-2yr</span> (
                <span className='font-mono'>366-730 days</span>)
              </li>
              <li>
                <span className='font-mono'>2yr-3yr</span> (
                <span className='font-mono'>731-1,095 days</span>)
              </li>
              <li>
                <span className='font-mono'>3+yr</span> (
                <span className='font-mono'>&gt;1,095 days</span>)
              </li>
              <li>
                <span className='font-mono'>Unknown</span>
              </li>
            </ul>
          </div>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement/type-and-severity': {
      title: 'Entanglement Type and Severity',
      description: (
        <div className='space-y-4'>
          <p>
            Detected entanglement events for North Atlantic right whales by type
            and severity for both known (cataloged) and unknown ID whales.
            Entanglements can be detected with attached gear (i.e.{' '}
            <span className='font-mono'>Gear</span>) or by wounds only and no
            attached gear (i.e. <span className='font-mono'>No Gear</span>).
            Severity is an assessment of the resulting entanglement injury and
            is classified as <strong>Minor</strong>, <strong>Moderate</strong>,
            or <strong>Severe</strong>:
          </p>
          <ul className='ml-6 list-disc space-y-1'>
            <li>
              <strong>Minor:</strong> Injuries or scars in the skin that were
              less than ~2cm in width and did not appear to penetrate into the
              blubber.
            </li>
            <li>
              <strong>Moderate:</strong> Injuries or scars that were greater
              than ~2cm in width, and/or between 2 and ~8cm in depth. This would
              include injuries that extend into the blubber (hypodermis layer).
            </li>
            <li>
              <strong>Severe:</strong> Injuries that were greater than ~8cm in
              depth and/or are known to extend into bone or muscle. This also
              includes cases of significant deformity or discoloration of fluke
              or flipper, for example a twisted fluke caused by torquing by
              rope/gear. A discolored appendage can indicate circulation
              impairment even in cases in which the entanglement itself is not
              visible.
            </li>
          </ul>
          <p>
            See{' '}
            <a
              href='https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/cobi.12590'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              Knowlton et al 2016
            </a>{' '}
            for additional information.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement/age': {
      title: 'Entanglement by Age Class',
      description: (
        <div className='space-y-4'>
          <p>
            Detected entanglement events for North Atlantic right whales by age
            class and year. Age class for right whales with known birth years
            are as follows:
          </p>
          <ul className='ml-4 list-disc'>
            <li>
              <strong>Calf (C)</strong> = &lt;1yr
            </li>
            <li>
              <strong>Juvenile (J)</strong> = 1-8yrs
            </li>
            <li>
              <strong>Adult (A)</strong> = 9+ yrs
            </li>
          </ul>
          <p>
            Whales of unknown birth year are considered{' '}
            <strong>Unknown (U)</strong> age class until their 9th year of
            sighting at which point they are classified as Adults. Whales that
            are unknown ID and are not cataloged are classified as Unknown age
            class.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement/gear': {
      title: 'Entanglement Gear Retrieved',
      description: (
        <div className='space-y-4'>
          <p>
            Gear retrieval status for North Atlantic right whale entanglement
            cases. Entanglements can be detected with attached gear (i.e. Gear)
            or by wounds only and no attached gear (i.e. No Gear). Gear
            retrieval status is listed for those cases with attached gear. Cases
            for which there was no gear attached are flagged as such.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/entanglement/rope': {
      title: 'Entanglement by Rope Diameter & Age',
      description: (
        <div className='space-y-4'>
          <p>
            Rope diameters of attached gear for North Atlantic right whale
            entanglement cases by age of whale. Not all entangled whales have
            attached gear and not all attached gear is retrieved off of
            entangled whales. Cases with multiple rope types have each
            represented in the graph. Case details can be viewed via the
            interactive data table to see specific information related to rope
            diameter for each.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/vessel-strike/timeframe': {
      title: 'Vessel Strike Timeframe',
      description: (
        <div className='space-y-4'>
          <p>
            Detected vessel strike events for North Atlantic right whales by
            timeframe of injury acquisition and year. Timeframe is calculated as
            days between the pre-injury sighting and the initial injury
            detection sighting. Whales for which there is no pre-injury
            detection sighting (i.e. unknown ID whale, whale&apos;s first
            sighting is with injury) do not have calculated timeframes.
          </p>
          <div>
            <span className='font-semibold'>
              Timeframes are defined as follows:
            </span>
            <ul className='mt-2 ml-6 list-disc space-y-1'>
              <li>
                <span className='font-mono'>&lt;3m</span> (
                <span className='font-mono'>&lt;90 days</span>)
              </li>
              <li>
                <span className='font-mono'>3-6m</span> (
                <span className='font-mono'>90-180 days</span>)
              </li>
              <li>
                <span className='font-mono'>6m – 1 yr</span> (
                <span className='font-mono'>181-365 days</span>)
              </li>
              <li>
                <span className='font-mono'>1yr-2yr</span> (
                <span className='font-mono'>366-730 days</span>)
              </li>
              <li>
                <span className='font-mono'>2yr-3yr</span> (
                <span className='font-mono'>731-1,095 days</span>)
              </li>
              <li>
                <span className='font-mono'>3+yr</span> (
                <span className='font-mono'>&gt;1,095 days</span>)
              </li>
              <li>
                <span className='font-mono'>Unknown</span>
              </li>
            </ul>
          </div>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/vessel-strike/type-and-severity': {
      title: 'Vessel Strike Type and Severity',
      description: (
        <div className='space-y-4'>
          <p>
            Detected vessel strike events by type and severity for both known
            (catalogued) and unknown ID North Atlantic right whales. Vessel
            strike types can include propeller cuts (Prop), blunt force trauma
            (Blunt), large open wounds (Gash), and others such as skeg wounds
            (Other). Severity is an assessment of the resulting vessel strike
            injury and is classified as Superficial (&lt;2cm penetrating depth),
            Shallow (2-8cm penetrating depth), or Deep (&gt; 8cm penetrating
            depth). Because Blunt cases are almost exclusively detected
            post-mortem, the severity for those cases is listed as Blunt.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/vessel-strike/age': {
      title: 'Vessel Strike by Age Class',
      description: (
        <div className='space-y-4'>
          <p>
            Detected vessel strike events for North Atlantic right whales by age
            class and year. Age class for right whales with known birth years
            are as follows:
          </p>
          <ul className='ml-4 list-disc'>
            <li>
              <strong>Calf (C)</strong> = &lt;1yr
            </li>
            <li>
              <strong>Juvenile (J)</strong> = 1-8yrs
            </li>
            <li>
              <strong>Adult (A)</strong> = 9+ yrs
            </li>
          </ul>
          <p>
            Whales of unknown birth year are considered{' '}
            <strong>Unknown (U)</strong> age class until their 9th year of
            sighting at which point they are classified as Adults. Whales that
            are unknown ID and are not cataloged are classified as Unknown age
            class.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/vessel-strike/forensics': {
      title: 'Vessel Strike Forensics',
      description: (
        <div>
          <p>
            Vessel strike forensics for North Atlantic right whale vessel strike
            cases. Forensic analyses are not possible for all vessel strike
            cases.
          </p>
          <p className='font-semibold mt-2'>{disclaimerText}</p>
        </div>
      ),
    },
    '/injury/unknown-other': {
      title: 'Unknown/Other Injuries',
      description: (
        <div className='space-y-4'>
          <p>
            Detected injury cases for North Atlantic right whales of unknown or
            other (i.e. not entanglement or vessel strike) origin. Cases
            captured here represent injuries that have the perceived potential
            to impact health and/or survival and do not reflect every documented
            injury/scar detected on right whales. Additionally, since
            assessments for these injury types began in 2013 under the right
            whale monitoring work, injuries of unknown/other origin prior to
            2013 are not captured here. Whales listed as &ldquo;Poor Body
            Condition&rdquo; and &ldquo;Dependent Calf&rdquo; are cases specific
            to the ongoing North Atlantic right whale Unusual Mortality Event
            (UME) which began in 2017. Broader population wide information on
            right whale health over time is accessible through the Visual Health
            Assessment Database via a NARWC data access request.
          </p>
          <p className='font-semibold'>{disclaimerText}</p>
        </div>
      ),
    },
  }

  const categories = [
    {
      title: 'OVERVIEW',
      links: [
        {
          href: '/injury/overview',
          label: 'Introduction to the Data',
        },
      ],
    },
    {
      title: 'ALL INJURIES',
      links: [
        {
          href: '/injury/injury-type',
          label: 'Total Annual Injuries',
        },
        // {
        //   href: '/injury/entanglement',
        //   label: 'Entanglement',
        // },
        // {
        //   href: '/injury/vessel-strike',
        //   label: 'Vessel Strikes',
        // },
      ],
    },
    {
      title: 'ENTANGLEMENT',
      links: [
        {
          href: '/injury/entanglement/type-and-severity',
          label: 'Type and Severity',
        },
        {
          href: '/injury/entanglement/age',
          label: 'Age Class',
        },
        {
          href: '/injury/entanglement/timeframe',
          label: 'Injury Timeframe',
        },
        {
          href: '/injury/entanglement/gear',
          label: 'Gear Retrieved',
        },
        {
          href: '/injury/entanglement/rope',
          label: 'Rope Diameter by Age Group',
        },
      ],
    },
    {
      title: 'VESSEL STRIKES',
      links: [
        {
          href: '/injury/vessel-strike/type-and-severity',
          label: 'Type and Severity',
        },
        {
          href: '/injury/vessel-strike/age',
          label: 'Age Class',
        },
        {
          href: '/injury/vessel-strike/timeframe',
          label: 'Injury Timeframe',
        },
        {
          href: '/injury/vessel-strike/forensics',
          label: 'Vessel Strike Forensics',
        },
      ],
    },
    {
      title: 'UNKNOWN/OTHER INJURIES',
      links: [
        {
          href: '/injury/unknown-other',
          label: 'Unknown/Other Injuries',
        },
      ],
    },
  ]

  return (
    <div className='flex bg-white pt-[70px] overflow-visible min-h-screen'>
      <Sidebar categories={categories} />
      <main className='flex-1 p-2 md:p-12 min-w-0 transition-all duration-200 peer-[.-translate-x-full]:ml-0 bg-white md:border-l md:border-gray-200'>
        <div className='text-3xl font-bold'>{text[pathname].title}</div>
        <div className='max-w-prose mx-auto mt-4 mb-8'>
          {text[pathname].description}
        </div>
        {children}
      </main>
    </div>
  )
}
