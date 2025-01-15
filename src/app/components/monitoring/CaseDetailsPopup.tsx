import React, { useEffect } from 'react'
import { InjuryCase } from '../../types/monitoring'
import { XMarkIcon } from '@heroicons/react/24/outline'

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !caseData) return null

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
    <div
      className='fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/25 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='flex items-center justify-center min-h-screen sm:p-4'>
        {/* Popup content */}
        <div className='relative bg-white w-full min-h-screen sm:min-h-fit sm:max-w-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 z-[10000] sm:mx-auto sm:my-8 animate-in fade-in duration-300 slide-in-from-bottom-4'>
          {/* Header Section */}
          <div className='flex flex-col space-y-1 mb-8'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl sm:text-3xl font-semibold text-gray-900'>
                Case {caseData.CaseId}
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <p className='text-sm text-gray-500'>
              Details for North Atlantic Right Whale #{caseData.EGNo}
            </p>
          </div>

          {/* Content Section */}
          <div className='space-y-4 max-h-[75vh] sm:max-h-[65vh] overflow-y-auto pr-4 -mr-4 pb-8'>
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
