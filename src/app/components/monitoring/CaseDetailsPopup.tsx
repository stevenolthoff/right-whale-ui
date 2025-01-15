import React, { useEffect, useCallback, useState } from 'react'
import { InjuryCase } from '../../types/monitoring'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CaseDetailsContentProps {
  caseData: InjuryCase
}

const CaseDetailsContent: React.FC<CaseDetailsContentProps> = ({
  caseData,
}) => {
  const detailRows = [
    { label: 'EG No', value: caseData.EGNo },
    { label: 'Case ID', value: caseData.CaseId },
    { label: 'Field EG No', value: caseData.FieldId },
    { label: 'Active Case', value: caseData.IsActiveCase ? 'Yes' : 'No' },
    { label: 'Injury Type', value: caseData.InjuryTypeDescription },
    { label: 'Injury Description', value: caseData.InjuryAccountDescription },
    { label: 'Injury Severity', value: caseData.InjurySeverityDescription },
    {
      label: 'Detection Year',
      value: new Date(caseData.DetectionDate).getFullYear(),
    },
    { label: 'Detection Location', value: caseData.DetectionAreaDescription },
    {
      label: 'UME Status',
      value: caseData.UnusualMortalityEventDescription || 'N/A',
    },
  ]

  return (
    <div className='space-y-4 max-h-[75vh] sm:max-h-[65vh] overflow-y-auto pr-4 -mr-4 pb-16'>
      {detailRows.map(({ label, value }) => (
        <div
          key={label}
          className='group grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-8 py-4 border-b border-gray-100 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors'
        >
          <div className='font-medium text-gray-500 text-sm sm:text-base'>
            {label}
          </div>
          <div className='text-gray-900 text-base sm:text-lg break-words'>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}

interface CaseDetailsPopupProps {
  caseData: InjuryCase | null
  isOpen: boolean
  onClose: () => void
}

const CaseDetailsPopup: React.FC<CaseDetailsPopupProps> = ({
  caseData,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'additional'>(
    'details'
  )

  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscapeKey)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, handleEscapeKey])

  if (!isOpen || !caseData) return null

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/25 backdrop-blur-sm'
      onClick={handleBackdropClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='case-details-title'
    >
      <div className='flex items-center justify-center min-h-screen sm:p-4'>
        <div className='relative bg-white w-full min-h-screen sm:min-h-fit sm:max-w-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 z-[10000] sm:mx-auto sm:my-8 animate-in fade-in duration-300 slide-in-from-bottom-4'>
          {/* Header Section */}
          <div className='flex flex-col space-y-1 mb-4'>
            <div className='flex justify-between items-center'>
              <h2
                id='case-details-title'
                className='text-2xl sm:text-3xl font-semibold text-gray-900'
              >
                Case {caseData.CaseId}
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
              Details for North Atlantic Right Whale #{caseData.EGNo}
            </p>
          </div>

          {/* Tabs */}
          <div className='border-b border-gray-200 mb-6'>
            <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
              <button
                onClick={() => setActiveTab('details')}
                className={`${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('additional')}
                className={`${
                  activeTab === 'additional'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Additional Info
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <CaseDetailsContent caseData={caseData} />
          ) : (
            <div className='h-96 flex items-center justify-center text-gray-500'>
              Additional information will be added here
            </div>
          )}

          {/* Footer - Mobile Only */}
          <div className='sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100'>
            <button
              onClick={onClose}
              className='w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetailsPopup
