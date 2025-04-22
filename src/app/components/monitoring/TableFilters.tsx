'use client'
import React from 'react'
import { Table } from '@tanstack/react-table'
import { InjuryCase } from '@/app/types/monitoring'
import { YearRangeSlider } from '../monitoring/YearRangeSlider'
import { AgeRangeSlider } from '../monitoring/AgeRangeSlider'
import { useFilteredData } from '@/app/hooks/useFilteredData'
import Select from 'react-select'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid'
import { useYearRangeStore } from '../../stores/useYearRangeStore'

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

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
    className='px-3 py-1 border rounded text-sm bg-white'
  />
)

const SelectFilter: React.FC<FilterProps> = ({
  value,
  onChange,
  options = [],
  isMulti = false,
  column,
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

  const handleSelectAllYes = () => {
    const yesOptions = options.filter((option) => option.startsWith('Yes'))
    onChange(yesOptions)
  }

  return (
    <div className='space-y-2'>
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
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'white',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'white',
          }),
        }}
      />
      {isMulti &&
        column === 'UnusualMortalityEventDescription' &&
        options.some((opt) => opt.startsWith('Yes')) && (
          <button
            onClick={handleSelectAllYes}
            className='text-xs text-blue-600 hover:text-blue-800'
          >
            Select All Yes
          </button>
        )}
    </div>
  )
}

const YearFilter: React.FC<FilterProps & { data: InjuryCase[] }> = ({
  value,
  onChange,
  data,
}) => {
  const {
    yearRange,
    setYearRange,
    isUpdating,
    minYear,
    maxYear,
    setMinMaxYears,
  } = useYearRangeStore()

  // Set min/max years when data changes
  React.useEffect(() => {
    if (data?.length) {
      setMinMaxYears(data)
    }
  }, [data, setMinMaxYears])

  // Only update the store when the filter value changes and we're not already updating
  React.useEffect(() => {
    if (isUpdating) return
    if (!value) return // Don't automatically reset to min/max

    try {
      const [min, max] = Array.isArray(value)
        ? value
        : JSON.parse(value as string)
      const newRange: [number, number] = [
        Number(min) || minYear,
        Number(max) || maxYear,
      ]
      if (newRange[0] !== yearRange[0] || newRange[1] !== yearRange[1]) {
        setYearRange(newRange)
      }
    } catch {
      // Don't reset on error
      console.warn('Failed to parse year range value:', value)
    }
  }, [value, minYear, maxYear, setYearRange, yearRange, isUpdating])

  const handleChange = React.useCallback(
    (newRange: [number, number]) => {
      if (!isUpdating) {
        onChange(JSON.stringify(newRange))
      }
    },
    [onChange, isUpdating]
  )

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

const AgeFilter: React.FC<FilterProps & { data: InjuryCase[] }> = ({
  value,
  onChange,
  data,
}) => {
  // Calculate min and max ages from data
  const { minAge, maxAge } = React.useMemo(() => {
    const ages = data
      .map((item) => {
        if (!item.BirthYear) return null
        const currentYear = new Date().getFullYear()
        return currentYear - item.BirthYear
      })
      .filter((age): age is number => age !== null)
    return {
      minAge: ages.length ? Math.min(...ages) : 0,
      maxAge: ages.length ? Math.max(...ages) : 100,
    }
  }, [data])

  // Update ageRange when value changes (including reset)
  React.useEffect(() => {
    if (!value || Array.isArray(value)) {
      setAgeRange([minAge, maxAge])
      return
    }
    try {
      const [min, max] = JSON.parse(value as string)
      setAgeRange([min ?? minAge, max ?? maxAge])
    } catch {
      setAgeRange([minAge, maxAge])
    }
  }, [value, minAge, maxAge])

  const [ageRange, setAgeRange] = React.useState<[number, number]>([
    minAge,
    maxAge,
  ])

  const handleChange = (newRange: [number, number]) => {
    setAgeRange(newRange)
    onChange(JSON.stringify(newRange))
  }

  return (
    <div className='w-full'>
      <AgeRangeSlider
        ageRange={ageRange}
        minAge={minAge}
        maxAge={maxAge}
        onChange={handleChange}
      />
    </div>
  )
}

interface TableFiltersProps {
  table: Table<InjuryCase>
  data: InjuryCase[]
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultFilters?: Record<string, any>
  defaultExpanded?: boolean
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  table,
  data,
  className = '',
  defaultFilters,
  defaultExpanded,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isExpanded, setIsExpanded] = React.useState(
    defaultExpanded ?? isDesktop
  )

  // Update expanded state when screen size changes and defaultExpanded is not set
  React.useEffect(() => {
    if (defaultExpanded === undefined) {
      setIsExpanded(isDesktop)
    }
  }, [isDesktop, defaultExpanded])

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
      MonitoringCaseAgeClass: new Set(),
      GenderDescription: new Set(),
    }

    data.forEach((item) => {
      Object.entries(options).forEach(([key, set]) => {
        if (key === 'IsActiveCase') return // Skip as we already set the options
        const value = item[key as keyof InjuryCase]
        if (value) set.add(value.toString())
        else if (key === 'MonitoringCaseAgeClass') set.add('N/A')
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
    if (defaultFilters && data.length > 0) {
      // First, collect all filter values to set
      const filtersToSet = Object.entries(defaultFilters).map(
        ([columnId, value]) => {
          if (
            columnId === 'UnusualMortalityEventDescription' &&
            value === 'all-yes'
          ) {
            const yesOptions =
              filterOptions[columnId]?.filter((opt) => opt.startsWith('Yes')) ||
              []
            return { columnId, value: yesOptions }
          }
          if (columnId === 'DetectionDate' && Array.isArray(value)) {
            return { columnId, value: JSON.stringify(value) }
          }
          return { columnId, value }
        }
      )

      // Then apply all filters at once
      filtersToSet.forEach(({ columnId, value }) => {
        const column = table.getColumn(columnId)
        if (column) {
          column.setFilterValue(value)
        }
      })

      // Finally update filtered data once
      setFilteredData(
        table.getFilteredRowModel().rows.map((row) => row.original)
      )
    }
  }, [data, defaultFilters, table, filterOptions, setFilteredData])

  return (
    <div className={`space-y-4 bg-gray-50 p-4 ${className}`}>
      <div className='flex justify-between items-center'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900'
        >
          <h3>Filters</h3>
          {isExpanded ? (
            <ChevronUpIcon className='w-4 h-4' />
          ) : (
            <ChevronDownIcon className='w-4 h-4' />
          )}
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
                ) : column.id === 'Age' ? (
                  <AgeFilter
                    column={column.id}
                    value={filterValue}
                    onChange={(value) => column.setFilterValue(value)}
                    data={data}
                  />
                ) : ['EGNo', 'FieldId', 'CaseId'].includes(column.id) ? (
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
                    isMulti={
                      column.id === 'UnusualMortalityEventDescription' ||
                      column.id === 'MonitoringCaseAgeClass'
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 
