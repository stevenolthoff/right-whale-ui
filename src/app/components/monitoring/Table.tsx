'use client'

import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table'
import { useMonitoringData } from '../../hooks/useMonitoringData'
import { InjuryCase } from '../../types/monitoring'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
import { TableFilters } from './TableFilters'
import { useFilteredData } from '@/app/hooks/useFilteredData'
import CaseDetailsPopup from './CaseDetailsPopup'
import { useYearRangeStore } from '../../stores/useYearRangeStore'

interface MonitoringTableProps {
  showFilters?: boolean
  defaultFilters?: {
    DetectionDate?: [number, number]
    IsActiveCase?: 'Yes' | 'No'
    MonitoringCaseAge?: [number, number]
    UnusualMortalityEventDescription?: string[] | 'all-yes'
    [key: string]:
      | [number, number]
      | 'Yes'
      | 'No'
      | string[]
      | 'all-yes'
      | undefined
  }
  visibleColumns?: string[]
  filtersExpanded?: boolean
}

const MonitoringTable: React.FC<MonitoringTableProps> = ({
  showFilters = true,
  defaultFilters,
  filtersExpanded,
}) => {
  const { results, loading, error } = useMonitoringData()
  const setFilteredData = useFilteredData((state) => state.setFilteredData)
  const { yearRange } = useYearRangeStore()
  const columnHelper = createColumnHelper<InjuryCase>()

  const [selectedCase, setSelectedCase] = React.useState<InjuryCase | null>(
    null
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<InjuryCase, any>[]>(() => {
    return [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => {
          const egNo = info.getValue()
          if (!egNo) return null

          return (
            <a
              href={`https://rwcatalog.neaq.org/#/whales/${egNo}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md'
            >
              {egNo}
            </a>
          )
        },
      }),
      columnHelper.accessor('CaseId', {
        header: 'Case ID',
        cell: (info) => (
          <button
            onClick={() => setSelectedCase(info.row.original)}
            className='text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-md'
          >
            {info.getValue()}
          </button>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const value = row.getValue(columnId)
          return value != null
            ? value.toString() === filterValue.toString()
            : false
        },
      }),
      columnHelper.accessor('FieldId', {
        header: 'Field EG No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('IsActiveCase', {
        header: 'Active Case',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const value = row.getValue(columnId)
          return filterValue === 'Yes' ? value === true : value === false
        },
      }),
      columnHelper.accessor('InjuryTypeDescription', {
        header: 'Injury Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Description',
        cell: (info) => info.getValue(),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          return row.getValue(columnId) === filterValue
        },
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Injury Severity',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('DetectionDate', {
        header: 'Detection Year',
        cell: (info) => new Date(info.getValue()).getFullYear(),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const year = new Date(row.getValue(columnId)).getFullYear()
          let minYear: number | null = null
          let maxYear: number | null = null
          if (typeof filterValue === 'string') {
            ;[minYear, maxYear] = JSON.parse(filterValue)
          } else if (Array.isArray(filterValue)) {
            ;[minYear, maxYear] = filterValue
          }
          if (minYear !== null && year < minYear) return false
          if (maxYear !== null && year > maxYear) return false
          return true
        },
      }),
      columnHelper.accessor('DetectionAreaDescription', {
        header: 'Detection Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('MonitorRemoveDate', {
        header: 'Date Made Inactive',
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue() as string).getFullYear()
            : 'N/A',
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const dateVal = row.getValue(columnId) as string | null
          if (!dateVal) return false
          const year = new Date(dateVal).getFullYear()
          let minYear: number | null = null
          let maxYear: number | null = null
          if (typeof filterValue === 'string') {
            try {
              ;[minYear, maxYear] = JSON.parse(filterValue)
            } catch (e) {
              return true
            }
          } else if (Array.isArray(filterValue)) {
            ;[minYear, maxYear] = filterValue
          }
          if (minYear !== null && year < minYear) return false
          if (maxYear !== null && year > maxYear) return false
          return true
        },
      }),
      columnHelper.accessor('CountryOriginDescription', {
        header: 'Injury Country Origin',
        cell: (info) => info.getValue(),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const value = row.getValue(columnId)
          return value === filterValue
        },
      }),
      columnHelper.accessor('UnusualMortalityEventDescription', {
        header: 'UME Status',
        cell: (info) => info.getValue() || 'N/A',
        filterFn: (row, columnId, filterValue) => {
          if (
            !filterValue ||
            !Array.isArray(filterValue) ||
            filterValue.length === 0
          )
            return true
          const value = row.getValue(columnId) || 'N/A'
          return filterValue.includes(value)
        },
      }),
      columnHelper.accessor(
        (row) => {
          if (!row.BirthYear) return null
          const currentYear = new Date().getFullYear()
          return currentYear - row.BirthYear
        },
        {
          id: 'Age',
          header: 'Age',
          cell: (info) => info.getValue() ?? 'Unknown',
          filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true
            const age = row.getValue<number | null>(columnId)
            if (age === null) return false

            let minAge: number | null = null
            let maxAge: number | null = null
            if (typeof filterValue === 'string') {
              ;[minAge, maxAge] = JSON.parse(filterValue)
            } else if (Array.isArray(filterValue)) {
              ;[minAge, maxAge] = filterValue
            }
            if (minAge !== null && age < minAge) return false
            if (maxAge !== null && age > maxAge) return false
            return true
          },
        }
      ),
      columnHelper.accessor('MonitoringCaseAgeClass', {
        header: 'Age Class',
        cell: (info) => info.getValue() || 'N/A',
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true
          const value = row.getValue(columnId) || 'N/A'
          return filterValue.includes(value)
        },
      }),
      columnHelper.accessor('GenderDescription', {
        header: 'Sex',
        cell: (info) => info.getValue() || 'Unknown',
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const value = row.getValue(columnId) || 'Unknown'
          return value === filterValue
        },
      }),
      columnHelper.accessor('Cow', {
        header: 'Reproductive Female',
        cell: (info) => {
          const value = info.getValue()
          return value === true ? 'Yes' : 'No'
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true
          const value = row.getValue(columnId)
          return filterValue === 'Yes' ? value === true : value === false
        },
      }),
    ]
  }, [columnHelper])

  const table = useReactTable({
    data: results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: 'DetectionDate',
          desc: true,
        },
      ],
      columnFilters: [
        {
          id: 'DetectionDate',
          value: yearRange,
        },
        ...(defaultFilters?.IsActiveCase
          ? [
              {
                id: 'IsActiveCase',
                value: defaultFilters.IsActiveCase,
              },
            ]
          : []),
      ],
    },
  })

  // Update filtered data when table state changes
  React.useEffect(() => {
    setFilteredData(table.getFilteredRowModel().rows.map((row) => row.original))
  }, [table.getFilteredRowModel(), setFilteredData])

  const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
    if (!isSorted) return <ChevronUpDownIcon className='w-4 h-4 ml-1 inline' />
    if (isSorted === 'asc')
      return <ChevronUpIcon className='w-4 h-4 ml-1 inline' />
    return <ChevronDownIcon className='w-4 h-4 ml-1 inline' />
  }

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error loading data</div>

  return (
    <div className='w-full max-w-screen-xl mx-auto'>
      <CaseDetailsPopup
        caseData={selectedCase}
        isOpen={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
      />
      {showFilters && (
        <TableFilters
          table={table}
          data={results || []}
          defaultFilters={defaultFilters}
          defaultExpanded={filtersExpanded}
        />
      )}
      <div className='relative overflow-hidden border rounded-lg shadow'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className='sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 hover:text-blue-500 uppercase tracking-wider cursor-pointer whitespace-nowrap'
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className='flex items-center'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {getSortIcon(header.column.getIsSorted())}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex items-center justify-between gap-2 mt-4'>
        <div className='flex items-center gap-2'>
          <button
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <span className='text-sm text-gray-700'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  )
}

export default MonitoringTable
