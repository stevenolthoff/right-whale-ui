import React from 'react'
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
  if (!isOpen || !caseData) return null

  return (
    <div className='fixed inset-0 z-[9999] overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4'>
        {/* Overlay */}
        <div
          className='fixed inset-0 bg-black opacity-40'
          onClick={onClose}
        ></div>

        {/* Popup content */}
        <div className='relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-[10000]'>
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-xl font-semibold'>
              Case Details: {caseData.CaseId}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-500'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          <div className='space-y-4'>
            <p>Content will go here...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetailsPopup
