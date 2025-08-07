'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/auth'
import { Loader } from '../components/ui/Loader'
import InjurySummaryTable from '@/app/components/whale/InjurySummaryTable'
import { WhaleInjuryTable } from '../components/whale/InjurySummaryTable'
import { WhaleInjury } from '../types/whaleInjury'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { RW_BACKEND_URL_CONFIG, url_join } from '../config'

interface WhaleData {
  EGNo: string
  BirthYear: number | null
  GenderCode: string
  FirstYearSighted: number
  LastAssessedDate: string
  IsDead: boolean
}

export default function WhalePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const egno = searchParams.get('egno')

  const [inputValue, setInputValue] = useState('')
  const [whaleData, setWhaleData] = useState<WhaleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('injury-summary')

  useEffect(() => {
    if (!egno) {
      setWhaleData(null)
      setLoading(false)
      return
    }
    setInputValue(egno)

    const fetchData = async () => {
      setLoading(true)
      try {
        const token = useAuthStore.getState().token
        const headers: HeadersInit = {
          accept: 'application/json',
        }
        if (token) {
          headers['Authorization'] = `token ${token}`
        }

        const res = await fetch(
          url_join(
            RW_BACKEND_URL_CONFIG.BASE_URL,
            `/anthro/api/v1/monitoring_cases/?EGNo=${egno}`
          ),
          { headers }
        )
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          setWhaleData(data.results[0])
        } else {
          setWhaleData(null)
        }
      } catch (error) {
        console.error('Failed to fetch whale data:', error)
        setWhaleData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [egno])

  const handleSearch = () => {
    if (inputValue) {
      router.push(`${pathname}?egno=${inputValue}`)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader />
      </div>
    )
  }

  const lastSightingYear = whaleData?.LastAssessedDate
    ? new Date(whaleData.LastAssessedDate).getFullYear()
    : null

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-slate-50'>
      <div className='max-w-7xl mx-auto px-4 pt-20 pb-8'>
        {/* Desktop Layout */}
        <div className='hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:h-[calc(100vh-8rem)]'>
          {/* Left Column - Search and Profile */}
          <div className='space-y-4'>
            {/* Search Section */}
            <div className='bg-gray-100 rounded-lg p-4'>
              <div className='font-bold text-sm mb-2'>SEARCH</div>
              <div className='text-xs text-gray-600 mb-3'>
                Find a whale by their Eubalaena glacialis ID.
              </div>
              <div className='flex items-center'>
                <input
                  className='border border-gray-300 rounded-l px-3 py-2 w-48 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                  placeholder='Enter EGNO'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
                <button
                  onClick={handleSearch}
                  className='bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                >
                  Search
                </button>
              </div>
            </div>

            {/* Whale Profile Section */}
            {whaleData ? (
              <div className='bg-white rounded-lg p-4 border border-gray-200'>
                <div className='mb-4'>
                  <div className='flex items-end justify-between'>
                    <div>
                      <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>
                        Name
                      </div>
                      <span className='text-4xl font-light tracking-tight text-gray-400'>
                        -
                      </span>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>
                        Sex
                      </div>
                      <span
                        className={`rounded-full text-white font-bold text-lg w-8 h-8 flex items-center justify-center ml-auto ${
                          whaleData?.GenderCode === 'M'
                            ? 'bg-blue-400'
                            : 'bg-pink-400'
                        }`}
                      >
                        {whaleData?.GenderCode || 'F'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      First Year Sighted
                    </div>
                    <div className='font-medium text-gray-400'>
                      {whaleData?.FirstYearSighted || '-'}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Last Year Sighted
                    </div>
                    <div className='font-medium text-gray-400'>
                      {lastSightingYear || '-'}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Birth Year
                    </div>
                    <div className='font-medium text-gray-400'>
                      {whaleData?.BirthYear || '-'}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Death Year
                    </div>
                    <div className='font-medium text-gray-400'>
                      {whaleData?.IsDead ? 'Yes' : '-'}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      First Calving Year
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Reproductive Span
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Longest Interval
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Average Interval
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Total Calves Born
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                      Years Since Last Calving
                    </div>
                    <div className='font-medium text-gray-400'>-</div>
                  </div>
                </div>
                <div className='mt-4 text-gray-500 text-xs uppercase'>
                  EGNO: <span className='font-mono'>{whaleData.EGNo}</span>
                </div>
              </div>
            ) : (
              <div className='bg-white rounded-lg p-4 border border-gray-200 text-center text-gray-500 text-sm'>
                {egno
                  ? `No data found for EGNO: ${egno}`
                  : 'Enter an EGNO to search for a whale.'}
              </div>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className='col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col'>
            {/* Tab Navigation */}
            <div className='flex border-b border-gray-200'>
              {['injury-summary', 'entanglement', 'vessel-strike'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    } ${
                      !whaleData && !egno ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!whaleData && !egno}
                  >
                    {tab === 'injury-summary'
                      ? 'Injury Summary'
                      : tab === 'entanglement'
                      ? 'Entanglement'
                      : 'Vessel Strike'}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            <div className='flex-1 p-6 overflow-auto'>
              {!whaleData && !egno ? (
                <div className='flex flex-col items-center justify-center h-full text-center text-gray-400'>
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 576 512'
                    fill='#3B82F6'
                  >
                    <path d='M327.1 96c-89.97 0-168.54 54.77-212.27 101.63L27.5 131.58c-12.13-9.18-30.24.6-27.14 14.66L24.54 256 .35 365.77c-3.1 14.06 15.01 23.83 27.14 14.66l87.33-66.05C158.55 361.23 237.13 416 327.1 416 464.56 416 576 288 576 256S464.56 96 327.1 96zm87.43 184c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24 13.26 0 24 10.74 24 24 0 13.25-10.75 24-24 24z' />
                  </svg>
                  <h2 className='text-xl font-semibold mb-2 text-gray-600'>
                    No Whale Selected
                  </h2>
                  <p className='text-gray-500'>
                    Enter an EGNO and search to view whale details and injury
                    history.
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === 'injury-summary' && whaleData && (
                    <InjurySummaryTable egno={whaleData.EGNo} />
                  )}
                  {activeTab === 'entanglement' && whaleData && (
                    <EntanglementTable egno={whaleData.EGNo} />
                  )}
                  {activeTab === 'vessel-strike' && whaleData && (
                    <VesselStrikeTable egno={whaleData.EGNo} />
                  )}
                  {activeTab === 'overview' && (
                    <div className='space-y-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Overview
                      </h3>
                      <div className='bg-gray-50 rounded-lg p-4 text-sm text-gray-600'>
                        <p className='text-gray-400'>-</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'sightings' && (
                    <div className='space-y-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Sightings
                      </h3>
                      <div className='bg-gray-50 rounded-lg p-4 text-sm text-gray-600'>
                        <p className='text-gray-400'>-</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'calving' && (
                    <div className='space-y-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Calving History
                      </h3>
                      <div className='bg-gray-50 rounded-lg p-4 text-sm text-gray-600'>
                        <p className='text-gray-400'>-</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='lg:hidden space-y-4'>
          {/* Search Section */}
          <div className='bg-gray-100 rounded-lg p-4'>
            <div className='font-bold text-sm mb-2'>SEARCH</div>
            <div className='text-xs text-gray-600 mb-3'>
              Find a whale by their Eubalaena glacialis ID.
            </div>
            <div className='flex items-center'>
              <input
                className='border border-gray-300 rounded-l px-3 py-2 flex-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                placeholder='Enter EGNO'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className='bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              >
                Search
              </button>
            </div>
          </div>

          {/* Whale Profile Section */}
          {whaleData ? (
            <div className='bg-white rounded-lg p-4 border border-gray-200'>
              <div className='mb-4'>
                <div className='flex items-end justify-between'>
                  <div>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>
                      Name
                    </div>
                    <span className='text-3xl font-light tracking-tight text-gray-400'>
                      -
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>
                      Sex
                    </div>
                    <span
                      className={`rounded-full text-white font-bold text-lg w-8 h-8 flex items-center justify-center ml-auto ${
                        whaleData?.GenderCode === 'M'
                          ? 'bg-blue-400'
                          : 'bg-pink-400'
                      }`}
                    >
                      {whaleData?.GenderCode || 'F'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    First Year Sighted
                  </div>
                  <div className='font-medium text-gray-400'>
                    {whaleData?.FirstYearSighted || '-'}
                  </div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Last Year Sighted
                  </div>
                  <div className='font-medium text-gray-400'>
                    {lastSightingYear || '-'}
                  </div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Birth Year
                  </div>
                  <div className='font-medium text-gray-400'>
                    {whaleData?.BirthYear || '-'}
                  </div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Death Year
                  </div>
                  <div className='font-medium text-gray-400'>
                    {whaleData?.IsDead ? 'Yes' : '-'}
                  </div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    First Calving Year
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Reproductive Span
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Longest Interval
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Average Interval
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Total Calves Born
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Years Since Last Calving
                  </div>
                  <div className='font-medium text-gray-400'>-</div>
                </div>
              </div>
              <div className='mt-4 text-gray-500 text-xs uppercase'>
                EGNO: <span className='font-mono'>{whaleData.EGNo}</span>
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg p-4 border border-gray-200 text-center text-gray-500 text-sm'>
              {egno
                ? `No data found for EGNO: ${egno}`
                : 'Enter an EGNO to search for a whale.'}
            </div>
          )}

          {/* Mobile Tabs */}
          <div className='bg-white rounded-lg border border-gray-200'>
            <div className='flex border-b border-gray-200'>
              {['injury-summary', 'entanglement', 'vessel-strike'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    } ${
                      !whaleData && !egno ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!whaleData && !egno}
                  >
                    {tab === 'injury-summary'
                      ? 'Injury Summary'
                      : tab === 'entanglement'
                      ? 'Entanglement'
                      : 'Vessel Strike'}
                  </button>
                )
              )}
            </div>
            <div className='p-4'>
              {!whaleData && !egno ? (
                <div className='flex flex-col items-center justify-center h-48 text-center text-gray-400'>
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 576 512'
                    fill='#3B82F6'
                  >
                    <path d='M327.1 96c-89.97 0-168.54 54.77-212.27 101.63L27.5 131.58c-12.13-9.18-30.24.6-27.14 14.66L24.54 256 .35 365.77c-3.1 14.06 15.01 23.83 27.14 14.66l87.33-66.05C158.55 361.23 237.13 416 327.1 416 464.56 416 576 288 576 256S464.56 96 327.1 96zm87.43 184c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24 13.26 0 24 10.74 24 24 0 13.25-10.75 24-24 24z' />
                  </svg>
                  <h2 className='text-lg font-semibold mb-1 text-gray-600'>
                    No Whale Selected
                  </h2>
                  <p className='text-gray-500'>
                    Enter an EGNO and search to view whale details and injury
                    history.
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === 'injury-summary' && whaleData && (
                    <InjurySummaryTable egno={whaleData.EGNo} />
                  )}
                  {activeTab === 'entanglement' && whaleData && (
                    <EntanglementTable egno={whaleData.EGNo} />
                  )}
                  {activeTab === 'vessel-strike' && whaleData && (
                    <VesselStrikeTable egno={whaleData.EGNo} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EntanglementTable({ egno }: { egno: string }) {
  const [data, setData] = useState<WhaleInjury[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    if (!egno) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = useAuthStore.getState().token
        const headers: HeadersInit = { accept: 'application/json' }
        if (token) headers['Authorization'] = `token ${token}`
        const res = await fetch(
          url_join(
            RW_BACKEND_URL_CONFIG.BASE_URL,
            `/anthro/api/v1/whale_injuries/?EGNo=${egno}`
          ),
          { headers }
        )
        const json = await res.json()
        if (json.results) {
          setData(
            json.results.filter(
              (inj: WhaleInjury) =>
                inj.InjuryTypeDescription &&
                inj.InjuryTypeDescription.toLowerCase().includes('entangle')
            )
          )
        } else {
          setData([])
        }
      } catch {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [egno])

  const columns: ColumnDef<WhaleInjury>[] = [
    {
      accessorKey: 'DetectionDate',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Year
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('DetectionDate') as string
        return new Date(date).getFullYear()
      },
    },
    {
      accessorKey: 'InjuryTypeDescription',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Event
        </button>
      ),
      cell: (info) => info.getValue() || 'N/A',
    },
    {
      accessorKey: 'InjurySeverityDescription',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Severity
        </button>
      ),
      cell: (info) => info.getValue() || 'N/A',
    },
    {
      accessorKey: 'InjuryId',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Event ID
        </button>
      ),
      cell: ({ row }) => (
        <a
          href={`#event-${row.original.InjuryId}`}
          className='underline text-blue-600 hover:text-blue-800'
        >
          {row.original.InjuryId}
        </a>
      ),
    },
    {
      accessorKey: 'CaseId',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Case ID
        </button>
      ),
      cell: ({ row }) => (
        <a
          href={`#case-${row.original.CaseId}`}
          className='underline text-blue-600 hover:text-blue-800'
        >
          {row.original.CaseId}
        </a>
      ),
    },
  ]

  return (
    <WhaleInjuryTable
      columns={columns}
      data={data}
      loading={loading}
      title='Entanglement Events'
      sorting={sorting}
      setSorting={setSorting}
    />
  )
}

function VesselStrikeTable({ egno }: { egno: string }) {
  const [data, setData] = useState<WhaleInjury[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    if (!egno) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = useAuthStore.getState().token
        const headers: HeadersInit = { accept: 'application/json' }
        if (token) headers['Authorization'] = `token ${token}`
        const res = await fetch(
          url_join(
            RW_BACKEND_URL_CONFIG.BASE_URL,
            `/anthro/api/v1/whale_injuries/?EGNo=${egno}`
          ),
          { headers }
        )
        const json = await res.json()
        if (json.results) {
          setData(
            json.results.filter(
              (inj: WhaleInjury) =>
                inj.InjuryTypeDescription &&
                inj.InjuryTypeDescription.toLowerCase().includes(
                  'vessel strike'
                )
            )
          )
        } else {
          setData([])
        }
      } catch {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [egno])

  const columns: ColumnDef<WhaleInjury>[] = [
    {
      accessorKey: 'DetectionDate',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Year
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('DetectionDate') as string
        return new Date(date).getFullYear()
      },
    },
    {
      accessorKey: 'InjuryTypeDescription',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Event
        </button>
      ),
      cell: (info) => info.getValue() || 'N/A',
    },
    {
      accessorKey: 'InjurySeverityDescription',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Severity
        </button>
      ),
      cell: (info) => info.getValue() || 'N/A',
    },
    {
      accessorKey: 'InjuryId',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Event ID
        </button>
      ),
      cell: ({ row }) => (
        <a
          href={`#event-${row.original.InjuryId}`}
          className='underline text-blue-600 hover:text-blue-800'
        >
          {row.original.InjuryId}
        </a>
      ),
    },
    {
      accessorKey: 'CaseId',
      header: ({ column }) => (
        <button
          className='font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Case ID
        </button>
      ),
      cell: ({ row }) => (
        <a
          href={`#case-${row.original.CaseId}`}
          className='underline text-blue-600 hover:text-blue-800'
        >
          {row.original.CaseId}
        </a>
      ),
    },
  ]

  return (
    <WhaleInjuryTable
      columns={columns}
      data={data}
      loading={loading}
      title='Vessel Strike Events'
      sorting={sorting}
      setSorting={setSorting}
    />
  )
}
