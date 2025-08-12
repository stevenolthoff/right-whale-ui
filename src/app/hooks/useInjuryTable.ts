'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table'
import { useYearRange } from './useYearRange'
import { WhaleInjury } from '../types/whaleInjury'

interface UseInjuryTableProps<T extends WhaleInjury> {
  initialData: T[]
  columns: ColumnDef<T, any>[]
  chartFilterColumnId: string
  chartFilterColumnValues: readonly string[]
}

export function useInjuryTable<T extends WhaleInjury>({
  initialData,
  columns,
  chartFilterColumnId,
  chartFilterColumnValues,
}: UseInjuryTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedInjury, setSelectedInjury] = useState<WhaleInjury | null>(null)

  const yearRangeProps = useYearRange(initialData, undefined, 1980)

  const table = useReactTable({
    data: initialData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    autoResetPageIndex: false,
  })

  // Sync year range slider with the table's DetectionDate filter
  useEffect(() => {
    table.getColumn('DetectionDate')?.setFilterValue(yearRangeProps.yearRange)
  }, [yearRangeProps.yearRange, table])

  // Logic for Chart -> Table filtering
  const handleHiddenSeriesChange = useCallback(
    (hidden: Set<string>) => {
      const column = table.getColumn(chartFilterColumnId)
      if (!column) return

      const visibleValues = chartFilterColumnValues.filter(
        (bin) => !hidden.has(bin)
      )

      if (
        visibleValues.length === 0 ||
        visibleValues.length === chartFilterColumnValues.length
      ) {
        column.setFilterValue(undefined)
      } else {
        column.setFilterValue(visibleValues)
      }
    },
    [table, chartFilterColumnId, chartFilterColumnValues]
  )

  // Logic for Table -> Chart filtering
  const hiddenSeries = useMemo(() => {
    const filter = columnFilters.find(
      (f) => f.id === chartFilterColumnId
    )?.value as string[] | undefined

    if (!filter || filter.length === 0) {
      return new Set<string>()
    }
    return new Set(
      chartFilterColumnValues.filter((bin) => !filter.includes(bin))
    )
  }, [columnFilters, chartFilterColumnId, chartFilterColumnValues])

  const tableFilteredData = useMemo(
    () => table.getFilteredRowModel().rows.map((row) => row.original),
    [table.getFilteredRowModel().rows]
  )

  const totalCountInView = useMemo(() => tableFilteredData.length, [
    tableFilteredData,
  ])

  return {
    table,
    tableFilteredData,
    yearRangeProps,
    selectedInjury,
    setSelectedInjury,
    hiddenSeries,
    handleHiddenSeriesChange,
    totalCountInView,
  }
}
