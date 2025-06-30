'use client'

import { useEffect, useState } from 'react'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { useAuthStore } from '@/app/store/auth'
import { Loader } from '@/app/components/ui/Loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/app/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<WhaleInjury>[] = [
  {
    accessorKey: 'DetectionDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Year
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('DetectionDate') as string
      return new Date(date).getFullYear()
    },
  },
  {
    accessorKey: 'InjuryAgeClass',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Age
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'InjuryTypeDescription',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Injury Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'InjuryAccountDescription',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Injury Description
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'InjurySeverityDescription',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Severity
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
]

interface InjurySummaryTableProps {
  egno: string
}

// Reusable table component for WhaleInjury data
type WhaleInjuryTableProps = {
  columns: ColumnDef<WhaleInjury>[]
  data: WhaleInjury[]
  loading?: boolean
  title?: string
  sorting?: SortingState
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>
}

export const WhaleInjuryTable = ({
  columns,
  data,
  loading,
  title,
  sorting: sortingProp,
  setSorting: setSortingProp,
}: WhaleInjuryTableProps) => {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const sorting = sortingProp !== undefined ? sortingProp : internalSorting
  const setSorting =
    setSortingProp !== undefined ? setSortingProp : setInternalSorting
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (loading) {
    return <Loader />
  }

  if (data.length === 0) {
    return <p>No injury events found for this whale.</p>
  }

  return (
    <div>
      {title && (
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>{title}</h3>
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.RecordId}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const InjurySummaryTable = ({ egno }: InjurySummaryTableProps) => {
  const [injuries, setInjuries] = useState<WhaleInjury[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!egno) {
      setLoading(false)
      return
    }

    const fetchInjuryData = async () => {
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
          `https://stage-rwanthro-backend.srv.axds.co/anthro/api/v1/whale_injuries/?EGNo=${egno}`,
          { headers }
        )
        const data = await res.json()
        if (data.results) {
          setInjuries(data.results)
        }
      } catch (error) {
        console.error('Failed to fetch injury data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInjuryData()
  }, [egno])

  return (
    <WhaleInjuryTable
      columns={columns}
      data={injuries}
      loading={loading}
      title='Injury Event Summary'
    />
  )
}

export default InjurySummaryTable
