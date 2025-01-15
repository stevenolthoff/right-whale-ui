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
  // Prevent background scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
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
    <div className='fixed inset-0 z-[9999] overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen sm:p-4'>
        {/* Overlay */}
        <div
          className='fixed inset-0 bg-black opacity-40'
          onClick={onClose}
        ></div>

        {/* Popup content */}
        <div className='relative bg-white w-full min-h-screen sm:min-h-fit sm:max-w-2xl sm:rounded-lg shadow-xl p-4 sm:p-6 z-[10000] sm:mx-auto sm:my-8'>
          <div className='flex justify-between items-start mb-6'>
            <h2 className='text-lg sm:text-xl font-semibold pr-8'>
              Case Details: {caseData.CaseId}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-500 absolute top-4 right-4'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          <div className='space-y-3 max-h-[85vh] sm:max-h-[70vh] overflow-y-auto pb-8'>
            {detailRows.map(({ label, value }) => (
              <div
                key={label}
                className='grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-3 border-b border-gray-100'
              >
                <div className='font-medium text-gray-600 text-sm sm:text-base'>
                  {label}
                </div>
                <div className='text-gray-800 text-sm sm:text-base break-words'>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetailsPopup
