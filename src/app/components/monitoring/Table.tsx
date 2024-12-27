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

const MonitoringTable = () => {
  const { results, loading, error } = useMonitoringData()
  const columnHelper = createColumnHelper<InjuryCase>()

  const columns = React.useMemo<ColumnDef<InjuryCase, any>[]>(
    () => [
      columnHelper.accessor('CaseId', {
        header: 'Case ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('InjuryId', {
        header: 'Injury ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('FieldId', {
        header: 'Field ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('EGNo', {
        header: 'EG No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('BirthYear', {
        header: 'Birth Year',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('GenderCode', {
        header: 'Gender',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('FirstYearSighted', {
        header: 'First Year Sighted',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('IsUnusualMortalityEvent', {
        header: 'Unusual Mortality',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
      }),
      columnHelper.accessor('InjuryTypeDescription', {
        header: 'Injury Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('InjuryAccountDescription', {
        header: 'Injury Account',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('InjurySeverityDescription', {
        header: 'Severity',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('PreinjuryDate', {
        header: 'Pre-injury Date',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor('DetectionDate', {
        header: 'Detection Date',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor('DetectionAreaDescription', {
        header: 'Detection Area',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('IsActiveCase', {
        header: 'Active',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
      }),
      columnHelper.accessor('IsDead', {
        header: 'Deceased',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
      }),
    ],
    [columnHelper]
  )

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
    },
  })

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error loading data</div>

  return (
    <div className='w-full max-w-screen-xl mx-auto'>
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
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
