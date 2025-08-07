import React, { useEffect, useCallback, useState } from 'react'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useAuthStore } from '@/app/store/auth'
import { RW_BACKEND_URL_CONFIG, url_join } from '@/app/config'
import { Loader } from '@/app/components/ui/Loader'

interface InjuryDetailsPopupProps {
  injuryData: WhaleInjury | null
  isOpen: boolean
  onClose: () => void
  context: 'entanglement' | 'vessel-strike' | 'unknown-other' | 'total'
}

const formatYN = (value: string | null | undefined) => {
  if (value === 'Y') return 'Yes'
  if (value === 'N') return 'No'
  if (value) return value // To handle cases like "Unknown"
  return 'N/A'
}

const NecropsyContent: React.FC<{ injuryData: WhaleInjury }> = ({
  injuryData,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchPdf = async () => {
      if (!injuryData.RecordId) {
        setError('Record ID is missing.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/whale_injuries/${injuryData.RecordId}/necropsy/`
        )
        const response = await axios.get(url, {
          responseType: 'blob',
          headers: {
            Authorization: `token ${token}`,
          },
        })
        const file = new Blob([response.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        setPdfUrl(fileURL)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF.')
        console.error('Error fetching necropsy PDF:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injuryData.RecordId, token])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader />
        <p className='ml-2'>Loading Necropsy Report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-full text-red-500'>
        <p>Error loading necropsy report: No report found.</p>
      </div>
    )
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className='w-full h-full'
        title={`Necropsy Report for Record ${injuryData.RecordId}`}
      />
    )
  }

  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      <p>No necropsy report available.</p>
    </div>
  )
}

const CaseStudyContent: React.FC<{ injuryData: WhaleInjury }> = ({
  injuryData,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchPdf = async () => {
      if (!injuryData.RecordId) {
        setError('Record ID is missing.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/whale_injuries/${injuryData.RecordId}/case_study/`
        )
        const response = await axios.get(url, {
          responseType: 'blob',
          headers: {
            Authorization: `token ${token}`,
          },
        })
        const file = new Blob([response.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        setPdfUrl(fileURL)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF.')
        console.error('Error fetching case study PDF:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injuryData.RecordId, token])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader />
        <p className='ml-2'>Loading Case Study...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-full text-red-500'>
        <p>Error loading case study: No study found.</p>
      </div>
    )
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className='w-full h-full'
        title={`Case Study for Record ${injuryData.RecordId}`}
      />
    )
  }

  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      <p>No case study available.</p>
    </div>
  )
}

const DetailsContent: React.FC<{
  injuryData: WhaleInjury
  context: string
}> = ({ injuryData, context }) => {
  const detailRows = [
    { label: 'EG No', value: injuryData.EGNo || 'N/A' },
    { label: 'Field EG No', value: injuryData.MortalityFieldId || 'N/A' },
    {
      label: 'Injury Type',
      value: injuryData.InjuryTypeDescription,
      hide: context !== 'total',
    },
    {
      label: 'Injury Description',
      value: injuryData.InjuryAccountDescription || 'N/A',
    },
    {
      label: 'Injury Severity',
      value: injuryData.InjurySeverityDescription || 'N/A',
    },
    {
      label: 'Detection Year',
      value: new Date(injuryData.DetectionDate).getFullYear(),
    },
    {
      label: 'Detection Location',
      value: injuryData.DetectionAreaDescription || 'N/A',
    },
    { label: 'Timeframe', value: injuryData.InjuryTimeFrame ?? 'N/A' },
    {
      label: 'UME Status',
      value: injuryData.UnusualMortalityEventDescription || 'N/A',
    },
    {
      label: 'Last Sighted Alive Date',
      value: injuryData.LastSightedAliveDate
        ? new Date(injuryData.LastSightedAliveDate).toLocaleDateString()
        : 'N/A',
    },
  ].filter((row) => !row.hide)

  return (
    <div className='h-full overflow-y-auto pr-3 -mr-3 space-y-2'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {detailRows.map(({ label, value }) => (
          <div
            key={label}
            className='group bg-gray-50/50 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors'
          >
            <div className='font-medium text-gray-500 text-xs uppercase tracking-wide mb-1'>
              {label}
            </div>
            <div className='text-gray-900 text-sm break-words'>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const WhaleInfoContent: React.FC<{ injuryData: WhaleInjury }> = ({
  injuryData,
}) => {
  const whaleInfoRows = [
    { label: 'Age', value: injuryData.InjuryAge || 'N/A' },
    { label: 'Age Class', value: injuryData.InjuryAgeClass || 'N/A' },
    { label: 'Sex', value: injuryData.GenderDescription || 'N/A' },
    {
      label: 'Reproductive Female',
      value: injuryData.Cow ? 'Yes' : 'No',
      hide: injuryData.GenderDescription?.toLowerCase() !== 'female',
    },
    { label: 'Is Dead from Injury', value: injuryData.IsDead ? 'Yes' : 'No' },
    {
      label: 'Cause of Death',
      value: injuryData.DeathCauseDescription || 'N/A',
    },
    {
      label: 'Necropsy Report',
      value: injuryData.HasNecropsyReport ? 'Available' : 'Not Available',
    },
  ].filter((row) => !row.hide)

  return (
    <div className='h-full overflow-y-auto pr-3 -mr-3 space-y-2'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {whaleInfoRows.map(({ label, value }) => (
          <div
            key={label}
            className='group bg-gray-50/50 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors'
          >
            <div className='font-medium text-gray-500 text-xs uppercase tracking-wide mb-1'>
              {label}
            </div>
            <div className='text-gray-900 text-sm break-words'>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const InjuryDetailsContent: React.FC<{ injuryData: WhaleInjury }> = ({
  injuryData,
}) => {
  const isEntanglement = injuryData.InjuryTypeDescription === 'Entanglement'
  const isVesselStrike = injuryData.InjuryTypeDescription === 'Vessel Strike'

  const injuryDetailsRows = [
    {
      label: 'Injury Country Origin',
      value: injuryData.CountryOriginDescription,
    },
    {
      label: 'Gear Origin',
      value: injuryData.GearOriginDescription,
      show: isEntanglement,
    },
    {
      label: 'Gear Complexity',
      value: injuryData.GearComplexityDescription,
      show: isEntanglement,
    },
    {
      label: 'Constricting Wrap',
      value: formatYN(injuryData.ConstrictingWrap),
      show: isEntanglement,
    },
    {
      label: 'Disentangled',
      value: formatYN(injuryData.Disentangled),
      show: isEntanglement,
    },
    {
      label: 'Gear Retrieved',
      value: formatYN(injuryData.GearRetrieved),
      show: isEntanglement,
    },
    {
      label: 'Gear Type',
      value: injuryData.GearTypes?.map((gt) => gt.GearTypeDescription).join(
        ', '
      ),
      show: isEntanglement,
    },
    {
      label: 'Rope Diameter (inches/mm)',
      value: injuryData.RopeDiameters?.map(
        (rd) => rd.RopeDiameterDescription
      ).join(', '),
      show: isEntanglement,
    },
    {
      label: 'Gear Marks',
      value: injuryData.GearMarks?.map((gm) => gm.GearMarkDescription).join(
        ', '
      ),
      show: isEntanglement,
    },
    {
      label: 'Line Gone Date',
      value: injuryData.LineGoneDate
        ? new Date(injuryData.LineGoneDate).toLocaleDateString()
        : 'N/A',
      show: isEntanglement,
    },
    {
      label: 'Forensics Completed',
      value: formatYN(injuryData.ForensicsCompleted),
      show: isVesselStrike,
    },
    {
      label: 'Vessel Size',
      value: injuryData.VesselSizeDescription,
      show: isVesselStrike,
    },
    {
      label: 'Case Study',
      value: injuryData.HasCaseStudy ? 'Available' : 'Not Available',
    },
  ].filter((row) => row.show === undefined || row.show)

  return (
    <div className='h-full overflow-y-auto pr-3 -mr-3 space-y-2'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {injuryDetailsRows.map(({ label, value }) => (
          <div
            key={label}
            className='group bg-gray-50/50 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors'
          >
            <div className='font-medium text-gray-500 text-xs uppercase tracking-wide mb-1'>
              {label}
            </div>
            <div className='text-gray-900 text-sm break-words'>
              {value || 'N/A'}
            </div>
          </div>
        ))}
        {injuryDetailsRows.length === 0 && (
          <div className='col-span-2 text-center text-gray-500'>
            No injury-specific details available.
          </div>
        )}
      </div>
    </div>
  )
}

const CommentsContent: React.FC<{ injuryData: WhaleInjury }> = ({
  injuryData,
}) => {
  const comments =
    injuryData.InjuryComments?.split('\n').filter(
      (line) => line.trim().length > 0
    ) || []

  return (
    <div className='h-full overflow-y-auto pr-3 -mr-3'>
      {comments.length > 0 ? (
        <div className='space-y-2'>
          {comments.map((comment, index) => (
            <div key={index} className='bg-gray-50/50 rounded-lg p-2.5'>
              <div className='text-sm text-gray-700'>{comment}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-sm text-gray-500 text-center py-8'>
          No comments available
        </div>
      )}
    </div>
  )
}

type TabOptions = 'details' | 'whale-info' | 'injury-details' | 'comments' | 'necropsy' | 'case-study'

const InjuryDetailsPopup: React.FC<InjuryDetailsPopupProps> = ({
  injuryData,
  isOpen,
  onClose,
  context,
}) => {
  const [activeTab, setActiveTab] = useState<TabOptions>('details')

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        onClose()
      }
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Reset tab to 'details' when a new injury is selected
  useEffect(() => {
    if (isOpen) {
      setActiveTab('details')
    }
  }, [isOpen, injuryData?.InjuryId, injuryData?.CaseId])

  // Reset active tab if it's not available for the current injury data
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'necropsy' && !injuryData?.HasNecropsyReport) {
        setActiveTab('details')
      }
      if (activeTab === 'case-study' && !injuryData?.HasCaseStudy) {
        setActiveTab('details')
      }
    }
  }, [isOpen, injuryData, activeTab])

  if (!isOpen || !injuryData) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const renderTabs = () => {
    const tabs: TabOptions[] = [
      'details',
      'whale-info',
      'injury-details',
      'comments',
    ]
    if (injuryData.HasNecropsyReport) {
      tabs.push('necropsy')
    }
    if (injuryData.HasCaseStudy) {
      tabs.push('case-study')
    }

    return (
      <div className='flex-none px-4 sm:px-8 border-b border-gray-200'>
        <nav className='flex space-x-8' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab
                .replace('-', ' ')
                .split(' ')
                .map((w) => w[0].toUpperCase() + w.substring(1))
                .join(' ')}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsContent injuryData={injuryData} context={context} />
      case 'whale-info':
        return <WhaleInfoContent injuryData={injuryData} />
      case 'injury-details':
        return <InjuryDetailsContent injuryData={injuryData} />
      case 'comments':
        return <CommentsContent injuryData={injuryData} />
      case 'necropsy':
        return <NecropsyContent injuryData={injuryData} />
      case 'case-study':
        return <CaseStudyContent injuryData={injuryData} />
      default:
        return null
    }
  }

  return (
    <div
      key={injuryData.RecordId}
      className='fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-gray-900/25 backdrop-blur-sm'
      onClick={handleBackdropClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='injury-details-title'
    >
      <div className='flex items-center justify-center min-h-screen'>
        <div className='relative bg-white w-full h-screen sm:h-[600px] sm:max-w-2xl sm:rounded-2xl shadow-2xl sm:mx-auto sm:my-8 animate-in fade-in duration-300 slide-in-from-bottom-4 flex flex-col'>
          <div className='flex-none flex flex-col space-y-1 p-4 sm:p-8 pb-4 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
              <h2
                id='injury-details-title'
                className='text-2xl sm:text-3xl font-semibold text-gray-900'
              >
                Record ID: {injuryData.RecordId}
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
                aria-label='Close dialog'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <p className='text-sm text-gray-500'>
              Details for North Atlantic Right Whale #{injuryData.EGNo}
            </p>
          </div>
          {renderTabs()}
          <div className='flex-1 p-4 sm:p-8 pt-6 min-h-0'>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InjuryDetailsPopup
