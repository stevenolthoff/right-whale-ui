'use client'
import React from 'react'
import type { Table, Column } from '@tanstack/react-table'
import { WhaleInjury } from '@/app/types/whaleInjury'
import { YearRangeSlider } from '@/app/components/monitoring/YearRangeSlider'
import { AgeRangeSlider } from '@/app/components/monitoring/AgeRangeSlider'
import { TimeframeSlider } from './TimeframeSlider'
import Select, { OnChangeValue } from 'react-select'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid'

type OptionType = { value: string; label: string }

const DebouncedInput: React.FC<
  {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className='w-full text-sm p-2 border rounded bg-white'
    />
  )
}

const SelectFilter: React.FC<{
  column: Column<WhaleInjury, unknown>
  options: string[]
  isMulti?: boolean
}> = ({ column, options, isMulti = false }) => {
  const filterValue = column.getFilterValue()
  const selectOptions: OptionType[] = options.map((option) => ({
    value: option,
    label: option,
  }))

  const selectedValue = isMulti
    ? Array.isArray(filterValue)
      ? filterValue.map((v) => ({ value: v, label: v }))
      : []
    : filterValue
    ? { value: filterValue as string, label: filterValue as string }
    : null

  return (
    <Select
      isMulti={isMulti}
      value={selectedValue}
      onChange={(selected: OnChangeValue<OptionType, boolean>) => {
        if (isMulti) {
          const values = ((selected as OptionType[]) || []).map(
            (option) => option.value
          )
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

const AgeSliderFilter: React.FC<{
  column: Column<WhaleInjury, unknown>
  data: WhaleInjury[]
}> = ({ column, data }) => {
  const { minAge, maxAge } = React.useMemo(() => {
    const ages = data
      .map((item) => (item.InjuryAge ? parseInt(item.InjuryAge, 10) : null))
      .filter((age): age is number => age !== null && !isNaN(age))
    return {
      minAge: ages.length > 0 ? Math.min(...ages) : 0,
      maxAge: ages.length > 0 ? Math.max(...ages) : 100,
    }
  }, [data])

  const filterValue = column.getFilterValue() as [number, number] | undefined
  const ageRange = filterValue ?? [minAge, maxAge]

  return (
    <AgeRangeSlider
      ageRange={ageRange}
      minAge={minAge}
      maxAge={maxAge}
      onChange={(range) => column.setFilterValue(range)}
    />
  )
}

const TimeframeSliderFilter: React.FC<{
  column: Column<WhaleInjury, unknown>
  data: WhaleInjury[]
}> = ({ column, data }) => {
  const { minTimeframe, maxTimeframe } = React.useMemo(() => {
    const timeframes = data
      .map((d) => d.InjuryTimeFrame)
      .filter((t): t is number => t !== null && t !== undefined)
    return {
      minTimeframe: timeframes.length > 0 ? Math.min(...timeframes) : 0,
      maxTimeframe: timeframes.length > 0 ? Math.max(...timeframes) : 5000,
    }
  }, [data])

  const filterValue = column.getFilterValue() as [number, number] | undefined
  const timeframeRange = filterValue ?? [0, 1095] // Default 0-3 years

  return (
    <TimeframeSlider
      timeframeRange={timeframeRange}
      minTimeframe={minTimeframe}
      maxTimeframe={maxTimeframe}
      onChange={(range) => column.setFilterValue(range)}
    />
  )
}

const LastSightedAliveYearFilter: React.FC<{
  column: Column<WhaleInjury, unknown>
  data: WhaleInjury[]
}> = ({ column, data }) => {
  const { minYear, maxYear } = React.useMemo(() => {
    const years = data
      .map((item) =>
        item.LastSightedAliveDate
          ? new Date(item.LastSightedAliveDate).getFullYear()
          : null
      )
      .filter((year): year is number => year !== null && !isNaN(year))
    return {
      minYear: years.length > 0 ? Math.min(...years) : 1970,
      maxYear: years.length > 0 ? Math.max(...years) : new Date().getFullYear(),
    }
  }, [data])

  const filterValue = column.getFilterValue() as [number, number] | undefined
  const yearRange = filterValue ?? [minYear, maxYear]

  return (
    <YearRangeSlider
      yearRange={yearRange}
      minYear={minYear}
      maxYear={maxYear}
      onChange={(range) => column.setFilterValue(range)}
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

export const InjuryTableFilters: React.FC<TableFiltersProps> = ({
  table,
  data,
  yearRange,
  setYearRange,
  minYear,
  maxYear,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const existingColumnIds = React.useMemo(
    () => new Set(table.getAllColumns().map((c) => c.id)),
    [table]
  )

  const filterOptions = React.useMemo(() => {
    const options: Record<string, Set<string>> = {
      InjuryTypeDescription: new Set(),
      InjuryAccountDescription: new Set(),
      InjurySeverityDescription: new Set(),
      InjuryAgeClass: new Set(),
      GenderDescription: new Set(),
      Cow: new Set(),
      UnusualMortalityEventDescription: new Set(),
      CountryOriginDescription: new Set(),
      GearOriginDescription: new Set(),
      GearComplexityDescription: new Set(),
      ConstrictingWrap: new Set(),
      Disentangled: new Set(),
      GearRetrieved: new Set(),
      IsDead: new Set(),
      DeathCauseDescription: new Set(),
      ForensicsCompleted: new Set(),
      VesselSizeDescription: new Set(),
    }

    if (data) {
      data.forEach((item) => {
        Object.keys(options).forEach((key) => {
          const value = item[key as keyof WhaleInjury]
          if (typeof value === 'boolean') {
            options[key].add(value ? 'Yes' : 'No')
          } else if (typeof value === 'string' && value) {
            if (
              key === 'ConstrictingWrap' ||
              key === 'Disentangled' ||
              key === 'GearRetrieved' ||
              key === 'ForensicsCompleted'
            ) {
              if (value === 'Y') options[key].add('Yes')
              else if (value === 'N') options[key].add('No')
              else if (value) options[key].add(value)
            } else {
              options[key].add(value)
            }
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

  const filtersConfig = [
    { id: 'EGNo', label: 'EGNo', type: 'text' },
    { id: 'DetectionDate', label: 'Detection Year', type: 'year-slider' },
    { id: 'InjuryAge', label: 'Age', type: 'age-slider' },
    { id: 'InjuryAgeClass', label: 'Age Class', type: 'select' },
    { id: 'GenderDescription', label: 'Sex', type: 'select' },
    { id: 'Cow', label: 'Reproductive Female', type: 'select' },
    {
      id: 'InjuryTypeDescription',
      label: 'Injury Type',
      type: 'select',
      isMulti: true,
    },
    {
      id: 'InjuryAccountDescription',
      label: 'Injury Description',
      type: 'select',
    },
    {
      id: 'InjurySeverityDescription',
      label: 'Injury Severity',
      type: 'select',
    },
    {
      id: 'UnusualMortalityEventDescription',
      label: 'UME Status',
      type: 'select',
    },
    {
      id: 'CountryOriginDescription',
      label: 'Injury Country Origin',
      type: 'select',
    },
    { id: 'GearOriginDescription', label: 'Gear Origin', type: 'select' },
    {
      id: 'GearComplexityDescription',
      label: 'Gear Complexity',
      type: 'select',
    },
    { id: 'ConstrictingWrap', label: 'Constricting Wrap', type: 'select' },
    { id: 'Disentangled', label: 'Disentangled', type: 'select' },
    { id: 'GearRetrieved', label: 'Gear Retrieved', type: 'select' },
    { id: 'ForensicsCompleted', label: 'Forensics Completed', type: 'select' },
    {
      id: 'VesselSizeDescription',
      label: 'Vessel Size',
      type: 'select',
    },
    {
      id: 'InjuryTimeFrame',
      label: 'Timeframe (days)',
      type: 'timeframe-slider',
    },
    {
      id: 'LastSightedAliveDate',
      label: 'Last Sighted Alive Year',
      type: 'last-sighted-slider',
    },
    { id: 'IsDead', label: 'Is Dead from Injury', type: 'select' },
    { id: 'DeathCauseDescription', label: 'Cause of Death', type: 'select' },
  ]

  return (
    <div className='space-y-4 bg-gray-50 p-4 rounded-lg'>
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {filtersConfig.map(({ id, label, type, isMulti }) => {
            if (!existingColumnIds.has(id)) {
              return null
            }
            const column = table.getColumn(id)!
            return (
              <div key={id}>
                <label className='text-xs font-medium text-gray-500 uppercase'>
                  {label}
                </label>
                {type === 'text' && (
                  <DebouncedInput
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(value) => column.setFilterValue(value)}
                    placeholder={`Search ${label}...`}
                  />
                )}
                {type === 'select' && (
                  <SelectFilter
                    column={column}
                    options={
                      filterOptions[id as keyof typeof filterOptions] || []
                    }
                    isMulti={isMulti}
                  />
                )}
                {type === 'year-slider' && (
                  <YearRangeSlider
                    yearRange={yearRange}
                    minYear={minYear}
                    maxYear={maxYear}
                    onChange={setYearRange}
                  />
                )}
                {type === 'age-slider' && (
                  <AgeSliderFilter column={column} data={data} />
                )}
                {type === 'timeframe-slider' && (
                  <TimeframeSliderFilter column={column} data={data} />
                )}
                {type === 'last-sighted-slider' && (
                  <LastSightedAliveYearFilter column={column} data={data} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 
