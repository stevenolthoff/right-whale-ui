'use client'
import React from 'react'
import { Table } from '@tanstack/react-table'
import { InjuryCase } from '@/app/types/monitoring'
import { YearRangeSlider } from '../monitoring/YearRangeSlider'

interface FilterProps {
  column: string
  value: string
  onChange: (value: string) => void
  options?: string[]
}

const TextFilter: React.FC<FilterProps> = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Filter..."
    className="px-3 py-1 border rounded text-sm"
  />
)

const SelectFilter: React.FC<FilterProps> = ({ value, onChange, options = [] }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-1 border rounded text-sm"
  >
    <option value="">All</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
)

const YearFilter: React.FC<FilterProps & { data: InjuryCase[] }> = ({ value, onChange, data }) => {
  // Calculate min and max years from data
  const { minYear, maxYear } = React.useMemo(() => {
    const years = data
      .map(item => new Date(item.DetectionDate).getFullYear())
      .filter(year => !isNaN(year))
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    }
  }, [data])

  const [yearRange, setYearRange] = React.useState<[number, number]>(() => {
    try {
      const [min, max] = JSON.parse(value || `[${minYear},${maxYear}]`)
      return [min ?? minYear, max ?? maxYear]
    } catch {
      return [minYear, maxYear]
    }
  })

  const handleChange = (newRange: [number, number]) => {
    setYearRange(newRange)
    onChange(JSON.stringify(newRange))
  }

  return (
    <div className="px-2">
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
}

export const TableFilters: React.FC<TableFiltersProps> = ({ table, data }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 border-b">
      {table.getAllColumns().map((column) => {
        const columnId = column.id as keyof typeof filterOptions
        const filterValue = column.getFilterValue() as string ?? ''

        return (
          <div key={column.id} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase">
              {column.columnDef.header as string}
            </label>
            {column.id === 'DetectionDate' ? (
              <div className="lg:col-span-3">
                <YearFilter
                  column={column.id}
                  value={filterValue}
                  onChange={(value) => column.setFilterValue(value)}
                  data={data}
                />
              </div>
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
              />
            )}
          </div>
        )
      })}
    </div>
  )
} 
