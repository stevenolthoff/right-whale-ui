import React, { useEffect, useCallback, useState, useRef } from 'react'
import { InjuryCase } from '../../types/monitoring'
import {
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useAuthStore } from '@/app/store/auth'
import { usePopupExpandStore } from '@/app/stores/usePopupExpandStore'
import { RW_BACKEND_URL_CONFIG, url_join } from '@/app/config'
import { Loader } from '@/app/components/ui/Loader'

interface ImageMetadata {
  monitorImageId: number
  fileName: string
  contentType: string
  createdDate: string
}

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
}

const ImagesContent: React.FC<{ caseData: InjuryCase }> = ({ caseData }) => {
  const [images, setImages] = useState<ImageMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    if (!caseData.CaseId) return

    const fetchImageMetadata = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/images/`
        )
        const response = await axios.get<{ images: ImageMetadata[] }>(url, {
          headers: { Authorization: `token ${token}` },
        })
        setImages(response.data.images)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch image metadata.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchImageMetadata()
  }, [caseData.CaseId, token])

  const handleDownloadAll = async () => {
    if (!caseData.CaseId || images.length === 0 || isDownloading) return

    setIsDownloading(true)
    try {
      for (const image of images) {
        try {
          const url = url_join(
            RW_BACKEND_URL_CONFIG.BASE_URL,
            `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/image/${image.monitorImageId}/`
          )
          const response = await axios.get(url, {
            headers: { Authorization: `token ${token}` },
            responseType: 'blob',
          })
          const blob = new Blob([response.data], {
            type: image.contentType,
          })
          const objectUrl = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = objectUrl
          link.download = image.fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(objectUrl)
        } catch (err) {
          console.error(`Failed to download ${image.fileName}:`, err)
        }
      }
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) return <Loader />
  if (error) return <div className='text-red-500 text-center'>{error}</div>
  if (images.length === 0)
    return <div className='text-center text-gray-500'>No images found.</div>

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none mb-4 flex justify-end'>
        <button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className='flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed'
        >
          {isDownloading ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
              Downloading...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className='w-4 h-4' />
              Download All
            </>
          )}
        </button>
      </div>
      <div className='flex-1 overflow-y-auto pr-3 -mr-3'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {images.map((image) => (
            <DisplayImage
              key={image.monitorImageId}
              caseId={caseData.CaseId!}
              imageMetadata={image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const DisplayImage: React.FC<{
  caseId: number
  imageMetadata: ImageMetadata
}> = ({ caseId, imageMetadata }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    let isMounted = true
    let objectUrl: string | null = null

    const fetchImage = async () => {
      setLoading(true)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_cases/${caseId}/image/${imageMetadata.monitorImageId}/`
        )
        const response = await axios.get(url, {
          headers: { Authorization: `token ${token}` },
          responseType: 'blob',
        })
        const blob = new Blob([response.data], {
          type: imageMetadata.contentType,
        })
        objectUrl = URL.createObjectURL(blob)
        if (isMounted) {
          setImageUrl(objectUrl)
        }
      } catch (err) {
        console.error('Failed to load image', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchImage()

    return () => {
      isMounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [caseId, imageMetadata.monitorImageId, token])

  if (loading) {
    return (
      <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
        <Loader size='sm' />
      </div>
    )
  }

  return (
    <a
      href={imageUrl!}
      target='_blank'
      rel='noopener noreferrer'
      className='group'
    >
      <img
        src={imageUrl!}
        alt={imageMetadata.fileName}
        className='w-full h-auto aspect-square object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow'
      />
      <p className='text-xs text-gray-500 mt-1 truncate'>
        {imageMetadata.fileName}
      </p>
    </a>
  )
}

const CaseDetailsContent: React.FC<CaseDetailsContentProps> = ({
  caseData,
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
    {
      label: 'Injury Country of Origin',
      value: caseData.CountryOriginDescription || 'N/A',
    },
    {
      label: 'Date Last Assessed',
      value: caseData.LastAssessedDate
        ? new Date(caseData.LastAssessedDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })
        : 'N/A',
    },
    {
      label: 'Date Made Inactive',
      value: caseData.MonitorRemoveDate
        ? new Date(caseData.MonitorRemoveDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })
        : 'N/A',
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
    </div>
  )
}

interface CommentsContentProps {
  comments: string[] | null
  isLoadingComments: boolean
}

const CommentsContent: React.FC<CommentsContentProps> = ({
  comments,
  isLoadingComments,
}) => {
  return (
    <div className='h-full overflow-y-auto pr-3 -mr-3'>
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
        <div className='text-sm text-gray-500 text-center py-8'>
          No comments available
        </div>
      )}
    </div>
  )
}

interface CounterBadgeProps {
  count: number | null
  isLoading: boolean
}

const CounterBadge: React.FC<CounterBadgeProps> = ({ count, isLoading }) => {
  // Always render the badge container to prevent layout shift
  const shouldShow = !isLoading && count !== null

  return (
    <>
      <style>
        {`
          @keyframes badgeFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .badge-fade-in {
            opacity: 0;
            animation: badgeFadeIn 0.2s ease-in forwards;
          }
        `}
      </style>
      <span
        className={`ml-1.5 inline-flex items-center justify-center px-1.5 min-w-[1.25rem] h-5 text-xs font-medium rounded-full ${
          shouldShow
            ? `badge-fade-in ${
                count > 0
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`
            : 'invisible'
        }`}
      >
        {shouldShow ? count : '0'}
      </span>
    </>
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
    ...(caseData.GenderDescription?.toLowerCase() === 'female'
      ? [{ label: 'Reproductive Female', value: caseData.Cow ? 'Yes' : 'No' }]
      : []),
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

interface CaseStudyContentProps {
  caseData: InjuryCase
}

interface NecropsyContentProps {
  caseData: InjuryCase
}

const NecropsyContent: React.FC<NecropsyContentProps> = ({ caseData }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchPdf = async () => {
      if (!caseData.CaseId) {
        setError('Case ID is missing.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/necropsy/`
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
  }, [caseData.CaseId, token])

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
        <p>Error loading necropsy report: {error}</p>
      </div>
    )
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className='w-full h-full'
        title={`Necropsy Report for Case ${caseData.CaseId}`}
      />
    )
  }

  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      <p>No necropsy report available.</p>
    </div>
  )
}

const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ caseData }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchPdf = async () => {
      if (!caseData.CaseId) {
        setError('Case ID is missing.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const url = url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/case_study/`
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
  }, [caseData.CaseId, token])

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
        <p>Error loading case study: {error}</p>
      </div>
    )
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        className='w-full h-full'
        title={`Case Study for Case ${caseData.CaseId}`}
      />
    )
  }

  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      <p>No case study available.</p>
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
    | 'details'
    | 'whale-info'
    | 'additional'
    | 'comments'
    | 'case-study'
    | 'necropsy'
    | 'images'
  >('details')
  const [assessmentData, setAssessmentData] =
    useState<AssessmentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [comments, setComments] = useState<string[] | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [imageCount, setImageCount] = useState<number | null>(null)
  const [isLoadingImageCount, setIsLoadingImageCount] = useState(false)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(false)
  const { isExpanded, toggleExpanded } = usePopupExpandStore()
  const tabsRef = useRef<HTMLElement>(null)

  // Handle tab navigation with arrow keys
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !caseData) return

      const tabs: (
        | 'details'
        | 'whale-info'
        | 'additional'
        | 'comments'
        | 'case-study'
        | 'necropsy'
        | 'images'
      )[] = [
        'details',
        'whale-info',
        'additional',
        'comments',
        ...(caseData.HasNecropsyReport ? (['necropsy'] as const) : []),
        ...(caseData.HasCaseStudy ? (['case-study'] as const) : []),
        ...(caseData.HasImages ? (['images'] as const) : []),
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
        case 'F11':
          event.preventDefault()
          toggleExpanded()
          break
      }
    },
    [isOpen, activeTab, onClose, caseData]
  )

  // Handle scroll for gradient indicators
  const handleTabScroll = useCallback(() => {
    if (!tabsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
    setShowLeftGradient(scrollLeft > 0)
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  // Fetch assessment data
  const fetchAssessments = async (page: number) => {
    if (!caseData || !hasMore) return

    setIsLoading(true)
    try {
      const response = await axios.get<AssessmentResponse>(
        url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_assessments/?Case__CaseId=${caseData.CaseId}&page=${page}&page_size=25`
        ),
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
        url_join(
          RW_BACKEND_URL_CONFIG.BASE_URL,
          `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/`
        ),
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

      if (caseData.HasImages) {
        setIsLoadingImageCount(true)
        const fetchImageCount = async () => {
          try {
            const url = url_join(
              RW_BACKEND_URL_CONFIG.BASE_URL,
              `/anthro/api/v1/monitoring_cases/${caseData.CaseId}/images/`
            )
            const response = await axios.get<{ images: ImageMetadata[] }>(url, {
              headers: {
                Authorization: `token ${useAuthStore.getState().token}`,
              },
            })
            setImageCount(response.data.images.length)
          } catch (error) {
            console.error('Error fetching image count:', error)
            setImageCount(0)
          } finally {
            setIsLoadingImageCount(false)
          }
        }
        fetchImageCount()
      } else {
        setImageCount(0)
      }
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
      setImageCount(null)
      setIsLoadingImageCount(false)
    }
  }, [isOpen])

  // Initialize gradient states when tabs change
  useEffect(() => {
    if (isOpen && tabsRef.current) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        handleTabScroll()
      }, 0)
    }
  }, [isOpen, activeTab, handleTabScroll])

  // Reset active tab if user is on case-study tab but case doesn't have case study
  useEffect(() => {
    if (
      isOpen &&
      caseData &&
      activeTab === 'case-study' &&
      !caseData.HasCaseStudy
    ) {
      setActiveTab('details')
    }
  }, [isOpen, caseData, activeTab])

  // Reset active tab if user is on necropsy tab but case doesn't have necropsy report
  useEffect(() => {
    if (
      isOpen &&
      caseData &&
      activeTab === 'necropsy' &&
      !caseData.HasNecropsyReport
    ) {
      setActiveTab('details')
    }
  }, [isOpen, caseData, activeTab])

  // Reset active tab if user is on images tab but case doesn't have images
  useEffect(() => {
    if (isOpen && caseData && activeTab === 'images' && !caseData.HasImages) {
      setActiveTab('details')
    }
  }, [isOpen, caseData, activeTab])

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
        <div
          className={`relative bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'w-screen h-screen rounded-none'
              : 'w-full h-screen sm:h-[600px] sm:max-w-2xl sm:rounded-2xl sm:mx-auto sm:my-8'
          } animate-in fade-in duration-300 slide-in-from-bottom-4`}
        >
          {/* Header Section */}
          <div className='flex-none flex flex-col space-y-1 p-4 sm:p-8 pb-4 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
              <h2
                id='case-details-title'
                className='text-2xl sm:text-3xl font-semibold text-gray-900'
              >
                Case {caseData.CaseId}
              </h2>
              <div className='flex items-center gap-2'>
                <button
                  onClick={toggleExpanded}
                  className='hidden sm:block text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
                  aria-label={isExpanded ? 'Shrink dialog' : 'Expand dialog'}
                >
                  {isExpanded ? (
                    <ArrowsPointingInIcon className='h-6 w-6' />
                  ) : (
                    <ArrowsPointingOutIcon className='h-6 w-6' />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
                  aria-label='Close dialog'
                >
                  <XMarkIcon className='h-6 w-6' />
                </button>
              </div>
            </div>
            <p className='text-sm text-gray-500'>
              Details for North Atlantic Right Whale #{caseData.EGNo}
            </p>
          </div>

          {/* Tabs */}
          <div className='flex-none px-4 sm:px-8 border-b border-gray-200'>
            <div className='relative'>
              {/* Scroll gradient indicators */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
                  showLeftGradient ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div
                className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
                  showRightGradient ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <nav
                ref={tabsRef}
                onScroll={handleTabScroll}
                className='flex space-x-8 overflow-x-auto scrollbar-hide pb-2 -mb-2'
                aria-label='Tabs'
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {(() => {
                  const tabs: (
                    | 'details'
                    | 'whale-info'
                    | 'additional'
                    | 'comments'
                    | 'case-study'
                    | 'necropsy'
                    | 'images'
                  )[] = ['details', 'whale-info', 'additional', 'comments']
                  if (caseData.HasCaseStudy) {
                    tabs.push('case-study')
                  }
                  if (caseData.HasNecropsyReport) {
                    tabs.push('necropsy')
                  }
                  if (caseData.HasImages) {
                    tabs.push('images')
                  }
                  return tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center flex-shrink-0`}
                    >
                      {tab
                        .replace('-', ' ')
                        .split(' ')
                        .map((w) => w[0].toUpperCase() + w.substring(1))
                        .join(' ')}
                      {tab === 'comments' && (
                        <CounterBadge
                          count={comments === null ? null : comments.length}
                          isLoading={isLoadingComments}
                        />
                      )}
                      {tab === 'images' && (
                        <CounterBadge
                          count={imageCount === null ? null : imageCount}
                          isLoading={isLoadingImageCount}
                        />
                      )}
                    </button>
                  ))
                })()}
              </nav>
            </div>
          </div>

          {/* Content Container */}
          <div className='flex-1 p-4 sm:p-8 pt-6 min-h-0'>
            <div hidden={activeTab !== 'details'} className='h-full'>
              <CaseDetailsContent caseData={caseData} />
            </div>
            <div hidden={activeTab !== 'whale-info'} className='h-full'>
              <WhaleInfoContent caseData={caseData} />
            </div>
            <div hidden={activeTab !== 'additional'} className='h-full'>
              <AssessmentContent
                assessments={assessmentData?.results || []}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
              />
            </div>
            <div hidden={activeTab !== 'comments'} className='h-full'>
              <CommentsContent
                comments={comments}
                isLoadingComments={isLoadingComments}
              />
            </div>
            {caseData.HasNecropsyReport && (
              <div hidden={activeTab !== 'necropsy'} className='h-full'>
                <NecropsyContent caseData={caseData} />
              </div>
            )}
            {caseData.HasCaseStudy && (
              <div hidden={activeTab !== 'case-study'} className='h-full'>
                <CaseStudyContent caseData={caseData} />
              </div>
            )}
            {caseData.HasImages && (
              <div hidden={activeTab !== 'images'} className='h-full'>
                <ImagesContent caseData={caseData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetailsPopup
