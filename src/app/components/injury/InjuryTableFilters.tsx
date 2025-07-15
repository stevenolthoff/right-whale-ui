'use client'
import React from 'react'
import type { Table, Column } from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import Select, { OnChangeValue } from 'react-select'
import { ChevronUpIcon, ChevronDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid'

type OptionType = { value: string; label: string };

interface FilterProps {
  column: Column<WhaleInjury, unknown>
  options: string[]
  isMulti?: boolean
}

const SelectFilter: React.FC<FilterProps> = ({ column, options, isMulti = false }) => {
  const filterValue = column.getFilterValue()
  const selectOptions: OptionType[] = options.map(option => ({ value: option, label: option }))
  
  const selectedValue = isMulti 
    ? Array.isArray(filterValue) ? filterValue.map(v => ({ value: v, label: v })) : []
    : filterValue ? { value: filterValue as string, label: filterValue as string } : null

  return (
    <Select
      isMulti={isMulti}
      value={selectedValue}
      onChange={(selected: OnChangeValue<OptionType, boolean>) => {
        if (isMulti) {
          const values = (selected as OptionType[] || []).map(option => option.value)
          column.setFilterValue(values.length > 0 ? values : undefined)
        } else {
          column.setFilterValue((selected as OptionType)?.value || undefined)
        }
      }}
      options={selectOptions}
      className='text-sm'
      placeholder='Select...'
      isClearable
    />
  )
}

interface TableFiltersProps {
  table: Table<WhaleInjury>
  data: WhaleInjury[]
  yearRange: [number, number]
  setYearRange: (range: [number, number]) => void
  minYear: number
  maxYear: number
}

export const InjuryTableFilters: React.FC<TableFiltersProps> = ({ table, data, yearRange, setYearRange, minYear, maxYear }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const filterOptions = React.useMemo(() => {
    const options: Record<string, Set<string>> = {
      InjuryTypeDescription: new Set(),
      InjurySeverityDescription: new Set(),
      InjuryAgeClass: new Set(),
      GenderDescription: new Set(),
    }

    if(data) {
      data.forEach((item) => {
        Object.keys(options).forEach(key => {
          const value = item[key as keyof WhaleInjury]
          if (typeof value === 'string' && value) {
            options[key].add(value)
          }
        })
      })
    }

    return Object.fromEntries(
      Object.entries(options).map(([key, set]) => [key, Array.from(set).sort()])
    )
  }, [data])

  const resetFilters = () => {
    table.resetColumnFilters()
  }

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className='flex justify-between items-center'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900'
        >
          <h3>Filters</h3>
          {isExpanded ? <ChevronUpIcon className='w-4 h-4' /> : <ChevronDownIcon className='w-4 h-4' />}
        </button>
        <button
          onClick={resetFilters}
          className='px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center gap-1'
        >
          <ArrowPathIcon className='w-4 h-4' />
          Reset Filters
        </button>
      </div>
      {isExpanded && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div>
            <label className='text-xs font-medium text-gray-500 uppercase'>Detection Year</label>
            <YearRangeSlider yearRange={yearRange} minYear={minYear} maxYear={maxYear} onChange={setYearRange} />
          </div>
          {['InjuryTypeDescription', 'InjurySeverityDescription', 'InjuryAgeClass', 'GenderDescription'].map(id => {
            const column = table.getColumn(id)
            if (!column) return null
            return (
              <div key={id}>
                <label className='text-xs font-medium text-gray-500 uppercase'>
                  {column.columnDef.header as string}
                </label>
                <SelectFilter 
                  column={column}
                  options={filterOptions[id as keyof typeof filterOptions] || []} 
                  isMulti={id === 'InjuryTypeDescription'}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 
