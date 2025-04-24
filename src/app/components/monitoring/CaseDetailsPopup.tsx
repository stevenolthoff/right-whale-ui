import React, { useEffect, useCallback, useState, useRef } from 'react'
import { InjuryCase } from '../../types/monitoring'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useAuthStore } from '@/app/store/auth'

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

interface CaseCommentResponse {
  CaseComments: string
}

interface CaseDetailsContentProps {
  caseData: InjuryCase
  comments: string[] | null
  isLoadingComments: boolean
}

const CaseDetailsContent: React.FC<CaseDetailsContentProps> = ({
  caseData,
  comments,
  isLoadingComments,
}) => {
  const detailRows = [
    { label: 'EG No', value: caseData.EGNo },
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

      {/* Case Comments Section */}
      <div className='border-t border-gray-100 pt-4'>
        <h3 className='text-sm font-semibold text-gray-900 mb-3'>
          Case Comments
        </h3>
        {isLoadingComments ? (
          <div className='flex justify-center py-3'>
            <div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent'></div>
          </div>
        ) : comments && comments.length > 0 ? (
          <div className='space-y-2'>
            {comments.map((comment, index) => (
              <div key={index} className='bg-gray-50/50 rounded-lg p-2.5'>
                <div className='text-sm text-gray-700'>{comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-sm text-gray-500'>No comments available</div>
        )}
      </div>
    </div>
  )
}

interface WhaleInfoContentProps {
  caseData: InjuryCase
}

const WhaleInfoContent: React.FC<WhaleInfoContentProps> = ({ caseData }) => {
  const calculateAge = () => {
    console.log('calculate Age', caseData)
    if (!caseData.BirthYear) return 'Unknown'
    const currentYear = new Date().getFullYear()
    return `${currentYear - caseData.BirthYear} years`
  }

  const whaleInfoRows = [
    { label: 'Age', value: calculateAge() },
    { label: 'Age Class', value: caseData.MonitoringCaseAgeClass || 'Unknown' },
    { label: 'Sex', value: caseData.GenderDescription || 'Unknown' },
    {
      label: 'Death from Injury',
      value: caseData.IsDead ? 'Yes' : 'No',
    },
    {
      label: 'Cause of Death',
      value: caseData.DeathCauseDescription || 'N/A',
    },
  ]

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
      <div className='text-sm text-gray-500 italic mt-2 px-1'>
        Note: Reproductive female status information is not currently available
        in the data.
      </div>
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
  const [sortField] = useState<'FirstSightingDate' | 'LastSightingDate'>(
    'FirstSightingDate'
  )
  const [sortDirection] = useState<'asc' | 'desc'>('asc')
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
      <div className='h-96 flex items-center justify-center text-gray-500 text-sm'>
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
    <div className='h-full flex flex-col'>
      {/* Controls */}
      <div className='flex-none pb-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='text-sm font-medium text-gray-700'>Impact:</div>
          <div className='flex items-center gap-2 flex-wrap'>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className='px-2 py-1 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
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
                className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
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
        className='flex-1 overflow-y-auto pr-3 -mr-3 min-h-0'
      >
        <div className='space-y-2'>
          {sortedAssessments.map((assessment) => (
            <div
              key={assessment.AssessmentId}
              className='bg-gray-50/50 border border-gray-100 rounded-lg p-2.5 hover:shadow-sm transition-shadow'
            >
              {/* Header with badges */}
              <div className='flex flex-wrap items-start justify-between gap-1.5 mb-2'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full'>
                    {assessment.AssessmentTypeDescription}
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
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
                <div className='text-xs text-gray-500 shrink-0'>
                  ID: {assessment.AssessmentId}
                </div>
              </div>

              {/* Sighting Information */}
              <div className='space-y-2'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <div className='space-y-0.5'>
                    <div className='text-xs font-medium text-gray-500'>
                      First Sighting
                    </div>
                    <div className='text-sm text-gray-700'>
                      {new Date(assessment.FirstSightingDate).toLocaleString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          timeZone: 'UTC',
                        }
                      )}
                    </div>
                    <div className='text-xs text-gray-600'>
                      {assessment.FirstSightingAreaDescription}
                    </div>
                  </div>
                  <div className='space-y-0.5'>
                    <div className='text-xs font-medium text-gray-500'>
                      Last Sighting
                    </div>
                    <div className='text-sm text-gray-700'>
                      {new Date(assessment.LastSightingDate).toLocaleString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          timeZone: 'UTC',
                        }
                      )}
                    </div>
                    <div className='text-xs text-gray-600'>
                      {assessment.LastSightingAreaDescription}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {assessment.InjuryImpactComments && (
                  <div className='pt-1'>
                    <div className='text-xs font-medium text-gray-500 mb-1'>
                      Comments
                    </div>
                    <div className='text-sm text-gray-700 bg-gray-100/50 p-2 rounded'>
                      {assessment.InjuryImpactComments}
                    </div>
                  </div>
                )}

                {/* Monitor Status */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-xs text-gray-600'>
                  <div className='flex items-center gap-1.5'>
                    <span className='font-medium'>Monitor Remove:</span>
                    <span>{assessment.IsMonitorRemove ? 'Yes' : 'No'}</span>
                  </div>
                  {assessment.MonitorRemoveReasonDescription !== 'No' && (
                    <div className='flex items-center gap-1.5'>
                      <span className='font-medium'>Reason:</span>
                      <span>{assessment.MonitorRemoveReasonDescription}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className='flex justify-center py-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent'></div>
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
  const [activeTab, setActiveTab] = useState<
    'details' | 'whale-info' | 'additional'
  >('details')
  const [assessmentData, setAssessmentData] =
    useState<AssessmentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [comments, setComments] = useState<string[] | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  // Handle tab navigation with arrow keys
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      const tabs: ('details' | 'whale-info' | 'additional')[] = [
        'details',
        'whale-info',
        'additional',
      ]
      const currentIndex = tabs.indexOf(activeTab)

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          const prevIndex =
            currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
          setActiveTab(tabs[prevIndex])
          break
        case 'ArrowRight':
          event.preventDefault()
          const nextIndex =
            currentIndex === tabs.length - 1 ? 0 : currentIndex + 1
          setActiveTab(tabs[nextIndex])
          break
        case 'Escape':
          onClose()
          break
      }
    },
    [isOpen, activeTab, onClose]
  )

  // Fetch assessment data
  const fetchAssessments = async (page: number) => {
    if (!caseData || !hasMore) return

    setIsLoading(true)
    try {
      const response = await axios.get<AssessmentResponse>(
        `https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/monitoring_assessments/?Case__CaseId=${caseData.CaseId}&page=${page}&page_size=25`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `token ${useAuthStore.getState().token}`,
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

  // Fetch case comments
  const fetchComments = async () => {
    if (!caseData) return

    setIsLoadingComments(true)
    try {
      const response = await axios.get<CaseCommentResponse>(
        `https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/monitoring_cases/${caseData.CaseId}/`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `token ${useAuthStore.getState().token}`,
          },
        }
      )

      // Split the comments string by newlines and filter out empty lines
      const commentLines = response.data.CaseComments.split('\n').filter(
        (line) => line.trim().length > 0
      )

      setComments(commentLines)
    } catch (error) {
      // If it's a 404, just set comments to null silently
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setComments(null)
      } else {
        // For other errors, log them but don't show to user
        console.error('Error fetching case comments:', error)
        setComments(null)
      }
    } finally {
      setIsLoadingComments(false)
    }
  }

  // Initial fetch when popup opens
  useEffect(() => {
    if (isOpen && caseData) {
      setCurrentPage(1)
      setHasMore(true)
      fetchAssessments(1)
      fetchComments()
    }
  }, [isOpen, caseData])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchAssessments(currentPage + 1)
    }
  }, [isLoading, hasMore, currentPage, fetchAssessments])

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

  useEffect(() => {
    if (!isOpen) {
      setAssessmentData(null)
      setCurrentPage(1)
      setHasMore(true)
      setActiveTab('details')
      setComments(null)
    }
  }, [isOpen])

  if (!isOpen || !caseData) return null

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      key={caseData.CaseId}
      className='fixed inset-0 z-[9999] bg-gray-900/25 backdrop-blur-sm'
      onClick={handleBackdropClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='case-details-title'
    >
      <div className='flex items-center justify-center min-h-screen'>
        <div className='relative bg-white w-full h-screen sm:h-[600px] sm:max-w-2xl sm:rounded-2xl shadow-2xl sm:mx-auto sm:my-8 animate-in fade-in duration-300 slide-in-from-bottom-4 flex flex-col'>
          {/* Header Section */}
          <div className='flex-none flex flex-col space-y-1 p-4 sm:p-8 pb-4 border-b border-gray-100'>
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
          <div className='flex-none px-4 sm:px-8 border-b border-gray-200'>
            <nav className='flex space-x-8' aria-label='Tabs'>
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
                onClick={() => setActiveTab('whale-info')}
                className={`${
                  activeTab === 'whale-info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Whale Info
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

          {/* Content Container */}
          <div className='flex-1 p-4 sm:p-8 pt-6 min-h-0'>
            {/* Tab Content */}
            {activeTab === 'details' ? (
              <CaseDetailsContent
                caseData={caseData}
                comments={comments}
                isLoadingComments={isLoadingComments}
              />
            ) : activeTab === 'whale-info' ? (
              <WhaleInfoContent caseData={caseData} />
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
    </div>
  )
}

export default CaseDetailsPopup
