'use client'

import React, { useEffect } from 'react'
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

interface MonitoringTableProps {
  showFilters?: boolean
  defaultFilters?: {
    DetectionDate?: [number, number]
    IsActiveCase?: 'Yes' | 'No'
    [key: string]: any
  }
  visibleColumns?: string[]
}

const MonitoringTable: React.FC<MonitoringTableProps> = ({
  showFilters = true,
  defaultFilters,
  visibleColumns,
}) => {
  const { results, loading, error } = useMonitoringData()
  const setFilteredData = useFilteredData((state) => state.setFilteredData)
  const setColumns = useFilteredData((state) => state.setColumns)
  const columnHelper = createColumnHelper<InjuryCase>()

  const columns = React.useMemo<ColumnDef<InjuryCase, any>[]>(() => {
    return [
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => info.getValue(),
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
      columnHelper.accessor('UnusualMortalityEventDescription', {
        header: 'UME Status',
        cell: (info) => info.getValue() || 'N/A',
      }),
    ]
  }, [columnHelper])

  useEffect(() => {
    setColumns(columns)
  }, [columns, setColumns])

  const table = useReactTable({
    data: results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
      columnVisibility: visibleColumns?.length
        ? Object.fromEntries(
            columns.map((col) => [
              col.accessorKey || col.id,
              visibleColumns.includes(
                (col.accessorKey as string) || (col.id as string)
              ),
            ])
          )
        : {},
    },
    onRowSelectionChange: () => {
      setFilteredData(
        table.getFilteredRowModel().rows.map((row) => row.original)
      )
    },
  })

  useEffect(() => {
    setFilteredData(table.getFilteredRowModel().rows.map((row) => row.original))
  }, [table.getFilteredRowModel(), setFilteredData])

  useEffect(() => {
    if (defaultFilters && results?.length) {
      Object.entries(defaultFilters).forEach(([columnId, value]) => {
        const column = table.getColumn(columnId)
        if (column) {
          if (columnId === 'DetectionDate' && Array.isArray(value)) {
            column.setFilterValue(JSON.stringify(value))
          } else {
            column.setFilterValue(value)
          }
        }
      })
    }
  }, [defaultFilters, table, results])

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
      {showFilters && (
        <TableFilters
          table={table}
          data={results || []}
          defaultFilters={defaultFilters}
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
