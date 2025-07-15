'use client'
import React from 'react'
import { flexRender, Table as TanstackTable } from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface InjuryTableProps {
  table: TanstackTable<WhaleInjury>
}

export const InjuryTable: React.FC<InjuryTableProps> = ({ table }) => {
  const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
    if (!isSorted) return <ChevronUpDownIcon className='w-4 h-4 ml-1 inline' />
    if (isSorted === 'asc') return <ChevronUpIcon className='w-4 h-4 ml-1 inline' />
    return <ChevronDownIcon className='w-4 h-4 ml-1 inline' />
  }

  return (
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
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
                  <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-between gap-2 p-4 border-t'>
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
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  )
} 
