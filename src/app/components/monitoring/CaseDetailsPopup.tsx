import React, { useEffect, useCallback, useState, useRef } from 'react'
import { InjuryCase } from '../../types/monitoring'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

interface AssessmentPagination {
  next: string | null
  previous: string | null
  count: number
  page: number
  total_pages: number
  previous_page: number | null
  next_page: number | null
  start_index: number
  end_index: number
}

interface AssessmentCase {
  EGNo: string
  DetectionDate: string
}

interface Assessment {
  AssessmentId: number
  Case_id: number
  AssessmentTypeId: number
  AssessmentTypeDescription: string
  InjuryImpactId: number
  InjuryImpactDescription: string
  FirstSightingDate: string
  FirstSightingAreaCode: string
  FirstSightingAreaDescription: string
  LastSightingDate: string
  LastSightingAreaCode: string
  LastSightingAreaDescription: string
  IsMonitorRemove: boolean
  MonitorRemoveReasonId: number | null
  MonitorRemoveReasonDescription: string
  InjuryImpactComments: string
  Case: AssessmentCase
}

interface AssessmentResponse {
  pagination: AssessmentPagination
  results: Assessment[]
}

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

interface AssessmentContentProps {
  assessments: Assessment[]
  isLoading: boolean
  onLoadMore?: () => void
}

const AssessmentContent: React.FC<AssessmentContentProps> = ({
  assessments,
  isLoading,
  onLoadMore,
}) => {
  const [sortField, setSortField] = useState<
    'FirstSightingDate' | 'LastSightingDate'
  >('FirstSightingDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [impactFilter, setImpactFilter] = useState<string>('All')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      // If we're within 100px of the bottom, trigger next page load
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMore?.()
      }
    },
    [onLoadMore]
  )

  if (!assessments?.length && !isLoading) {
    return (
      <div className='h-96 flex items-center justify-center text-gray-500'>
        No assessments found
      </div>
    )
  }

  // Filter assessments
  const filteredAssessments =
    impactFilter === 'All'
      ? assessments
      : assessments.filter((a) => a.InjuryImpactDescription === impactFilter)

  // Sort filtered assessments
  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    const dateA = new Date(a[sortField]).getTime()
    const dateB = new Date(b[sortField]).getTime()
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='flex flex-col space-y-4 pb-6'>
        {/* Sort Controls */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='text-sm font-medium text-gray-700'>Sort by:</div>
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={() => setSortField('FirstSightingDate')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                sortField === 'FirstSightingDate'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              First Sighting
            </button>
            <button
              onClick={() => setSortField('LastSightingDate')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                sortField === 'LastSightingDate'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Last Sighting
            </button>
            <button
              onClick={() =>
                setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
              }
              className='inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              {sortDirection === 'desc' ? (
                <>
                  <span>Newest First</span>
                  <span className='text-gray-400'>↓</span>
                </>
              ) : (
                <>
                  <span>Oldest First</span>
                  <span className='text-gray-400'>↑</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='text-sm font-medium text-gray-700'>Impact:</div>
          <div className='flex items-center gap-3 flex-wrap'>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className='px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
            >
              {[
                'All',
                'Decline',
                'Extended Monitor',
                'Inconclusive',
                'No Impact',
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {impactFilter !== 'All' && (
              <button
                onClick={() => setImpactFilter('All')}
                className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
                aria-label='Clear filter'
              >
                <XMarkIcon className='h-4 w-4' />
              </button>
            )}
          </div>
          <div className='ml-auto text-sm text-gray-500'>
            Showing {filteredAssessments.length} of {assessments.length} results
          </div>
        </div>
      </div>

      {/* Assessment List */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className='max-h-[65vh] overflow-y-auto pr-4 -mr-4 pb-16 space-y-6'
      >
        {sortedAssessments.map((assessment) => (
          <div
            key={assessment.AssessmentId}
            className='bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-3'>
                <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full'>
                  {assessment.AssessmentTypeDescription}
                </span>
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    assessment.InjuryImpactDescription === 'No Impact'
                      ? 'bg-green-50 text-green-600'
                      : assessment.InjuryImpactDescription === 'Minor'
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {assessment.InjuryImpactDescription}
                </span>
              </div>
              <div className='text-sm text-gray-500'>
                ID: {assessment.AssessmentId}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm font-medium text-gray-500'>
                    First Sighting
                  </div>
                  <div className='text-sm'>
                    {new Date(
                      assessment.FirstSightingDate
                    ).toLocaleDateString()}{' '}
                    - {assessment.FirstSightingAreaDescription}
                  </div>
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-500'>
                    Last Sighting
                  </div>
                  <div className='text-sm'>
                    {new Date(assessment.LastSightingDate).toLocaleDateString()}{' '}
                    - {assessment.LastSightingAreaDescription}
                  </div>
                </div>
              </div>

              {assessment.InjuryImpactComments && (
                <div className='mt-3'>
                  <div className='text-sm font-medium text-gray-500 mb-1'>
                    Comments
                  </div>
                  <div className='text-sm text-gray-700 bg-gray-50 p-3 rounded-lg'>
                    {assessment.InjuryImpactComments}
                  </div>
                </div>
              )}

              <div className='mt-3 flex items-center justify-between text-sm text-gray-500'>
                <div>
                  Monitor Remove: {assessment.IsMonitorRemove ? 'Yes' : 'No'}
                </div>
                {assessment.MonitorRemoveReasonDescription !== 'No' && (
                  <div>Reason: {assessment.MonitorRemoveReasonDescription}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-center py-4'>
            <div className='animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent'></div>
          </div>
        )}
      </div>
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
  const [assessmentData, setAssessmentData] =
    useState<AssessmentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch assessment data
  const fetchAssessments = async (page: number) => {
    if (!caseData || !hasMore) return

    setIsLoading(true)
    try {
      const response = await axios.get<AssessmentResponse>(
        `https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/monitoring_assessments/?case_id=${caseData.CaseId}&page=${page}&page_size=25`,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'token 8186f023f5f80b21498be6162280820fd6144d75',
            'X-CSRFToken':
              'TgNK6RFXdMwTkfwpKhgxJLPhIFvoZf3hHyROnPqNurZnzExIbbtH8wk55D0gCHcW',
          },
        }
      )

      if (page === 1) {
        setAssessmentData(response.data)
      } else {
        setAssessmentData((prev) =>
          prev
            ? {
                ...response.data,
                results: [...prev.results, ...response.data.results],
              }
            : response.data
        )
      }

      setHasMore(!!response.data.pagination.next)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch when popup opens
  useEffect(() => {
    if (isOpen && caseData) {
      setCurrentPage(1)
      setHasMore(true)
      fetchAssessments(1)
    }
  }, [isOpen, caseData])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchAssessments(currentPage + 1)
    }
  }, [isLoading, hasMore, currentPage, fetchAssessments])

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
                Assessments
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <CaseDetailsContent caseData={caseData} />
          ) : (
            <AssessmentContent
              assessments={assessmentData?.results || []}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CaseDetailsPopup
