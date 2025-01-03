'use client'
import React from 'react'
import { Table } from '@tanstack/react-table'
import { InjuryCase } from '@/app/types/monitoring'
import { YearRangeSlider } from '../monitoring/YearRangeSlider'
import { useFilteredData } from '@/app/hooks/useFilteredData'
import Select from 'react-select'

interface FilterProps {
  column: string
  value: string | string[]
  onChange: (value: string | string[]) => void
  options?: string[]
  isMulti?: boolean
}

const TextFilter: React.FC<FilterProps> = ({ value, onChange }) => (
  <input
    type='text'
    value={value as string}
    onChange={(e) => onChange(e.target.value)}
    placeholder='Filter...'
    className='px-3 py-1 border rounded text-sm'
  />
)

const SelectFilter: React.FC<FilterProps> = ({
  value,
  onChange,
  options = [],
  isMulti = false,
}) => {
  const selectOptions = options.map((option) => ({
    value: option,
    label: option,
  }))
  const selectedValue = isMulti
    ? Array.isArray(value)
      ? value.map((v) => ({ value: v, label: v }))
      : []
    : value
    ? { value: value as string, label: value as string }
    : null

  return (
    <Select
      isMulti={isMulti}
      value={selectedValue}
      onChange={(selected) => {
        if (isMulti) {
          const values = selected
            ? Array.isArray(selected)
              ? selected.map((option) => option.value)
              : []
            : []
          onChange(values)
        } else {
          const singleValue = selected as { value: string } | null
          onChange(singleValue?.value || '')
        }
      }}
      options={selectOptions}
      className='text-sm'
      placeholder='Select...'
      isClearable
    />
  )
}

const YearFilter: React.FC<FilterProps & { data: InjuryCase[] }> = ({
  value,
  onChange,
  data,
}) => {
  // Calculate min and max years from data
  const { minYear, maxYear } = React.useMemo(() => {
    const years = data
      .map((item) => new Date(item.DetectionDate).getFullYear())
      .filter((year) => !isNaN(year))
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
    }
  }, [data])

  // Update yearRange when value changes (including reset)
  React.useEffect(() => {
    if (!value || Array.isArray(value)) {
      setYearRange([minYear, maxYear])
      return
    }
    try {
      const [min, max] = JSON.parse(value as string)
      setYearRange([min ?? minYear, max ?? maxYear])
    } catch {
      setYearRange([minYear, maxYear])
    }
  }, [value, minYear, maxYear])

  const [yearRange, setYearRange] = React.useState<[number, number]>([
    minYear,
    maxYear,
  ])

  const handleChange = (newRange: [number, number]) => {
    setYearRange(newRange)
    onChange(JSON.stringify(newRange))
  }

  return (
    <div className='w-full'>
      <YearRangeSlider
        yearRange={yearRange}
        minYear={minYear}
        maxYear={maxYear}
        onChange={handleChange}
      />
    </div>
  )
}

interface TableFiltersProps {
  table: Table<InjuryCase>
  data: InjuryCase[]
  className?: string
  defaultFilters?: Record<string, any>
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  table,
  data,
  className = '',
  defaultFilters,
}) => {
  const setFilteredData = useFilteredData((state) => state.setFilteredData)

  // Get unique values for each column that needs a select filter
  const filterOptions = React.useMemo(() => {
    const options: Record<string, Set<string>> = {
      InjuryTypeDescription: new Set(),
      InjuryAccountDescription: new Set(),
      InjurySeverityDescription: new Set(),
      DetectionAreaDescription: new Set(),
      UnusualMortalityEventDescription: new Set(),
      IsActiveCase: new Set(['Yes', 'No']),
    }

    data.forEach((item) => {
      Object.entries(options).forEach(([key, set]) => {
        if (key === 'IsActiveCase') return // Skip as we already set the options
        const value = item[key as keyof InjuryCase]
        if (value) set.add(value.toString())
      })
    })

    return Object.fromEntries(
      Object.entries(options).map(([key, set]) => [key, Array.from(set).sort()])
    )
  }, [data])

  const resetFilters = () => {
    table.resetColumnFilters()
    setFilteredData(data) // Reset to full dataset
  }

  // Add effect to set initial filters
  React.useEffect(() => {
    if (defaultFilters) {
      Object.entries(defaultFilters).forEach(([columnId, value]) => {
        const column = table.getColumn(columnId)
        if (column) {
          column.setFilterValue(value)
        }
      })
    }
  }, [defaultFilters, table])

  return (
    <div className={`space-y-4 bg-gray-50 p-4 ${className}`}>
      <div className='flex justify-between items-center'>
        <h3 className='text-sm font-medium text-gray-700'>Filters</h3>
        <button
          onClick={resetFilters}
          className='px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded shadow-sm hover:bg-gray-50'
        >
          Reset Filters
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {table.getAllColumns().map((column) => {
          const columnId = column.id as keyof typeof filterOptions
          const filterValue = (column.getFilterValue() as string) ?? ''

          return (
            <div key={column.id} className='flex flex-col gap-1'>
              <label className='text-xs font-medium text-gray-500 uppercase'>
                {column.columnDef.header as string}
              </label>
              {column.id === 'DetectionDate' ? (
                <YearFilter
                  column={column.id}
                  value={filterValue}
                  onChange={(value) => column.setFilterValue(value)}
                  data={data}
                />
              ) : ['EGNo', 'FieldId'].includes(column.id) ? (
                <TextFilter
                  column={column.id}
                  value={filterValue}
                  onChange={(value) => column.setFilterValue(value)}
                />
              ) : (
                <SelectFilter
                  column={column.id}
                  value={filterValue}
                  onChange={(value) => column.setFilterValue(value)}
                  options={filterOptions[columnId] || []}
                  isMulti={column.id === 'UnusualMortalityEventDescription'}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 
