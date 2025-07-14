'use client'

import React, { useRef, useMemo } from 'react'
import { useWhaleInjuryDataStore } from '@/app/stores/useWhaleInjuryDataStore'
import { DataChart } from '@/app/components/monitoring/DataChart'
import { ChartLayout } from '@/app/components/charts/ChartLayout'
import { WhaleInjury } from '@/app/types/whaleInjury'

const AGE_GROUPS_ORDER = ['0-2yr', '3-5yr', '6-8yr', '9+yr', 'Unknown']
const ROPE_DIAMETER_ORDER = ['<7/16", 11mm', '> 1/2", 12mm', 'Other', 'Unknown']

const getAgeGroup = (ageStr: string | null): string => {
  if (ageStr === null || ageStr === undefined) return 'Unknown'
  const age = parseInt(ageStr, 10)
  if (isNaN(age)) return 'Unknown'

  if (age <= 2) return '0-2yr'
  if (age <= 5) return '3-5yr'
  if (age <= 8) return '6-8yr'
  if (age >= 9) return '9+yr'

  return 'Unknown'
}

const smallRopeValues = ['1/4 (6)', '5/16 (8)', '3/8 (10)', '7/16 (11)']
const largeRopeValues = [
  '1/2 (12)',
  '9/16 (14)',
  '5/8 (16)',
  '3/4 (18)',
  '7/8 (22)',
  '1 (24)',
  '1-1/8 (28)',
  '1-1/4 (30)',
  '1-1/2 (36)',
  '1-5/8 (40)',
]

const getRopeDiameterGroup = (
  diameters: { RopeDiameterDescription: string }[]
): string => {
  if (!diameters || diameters.length === 0) {
    return 'Unknown'
  }
  const desc = diameters[0].RopeDiameterDescription
  if (smallRopeValues.includes(desc)) {
    return '<7/16", 11mm'
  }
  if (largeRopeValues.includes(desc)) {
    return '> 1/2", 12mm'
  }
  if (desc && desc.trim() !== '') {
    return 'Other'
  }
  return 'Unknown'
}

export default function EntanglementByRopeAndAgePage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { data: allData, loading, error } = useWhaleInjuryDataStore()

  const entanglementData = useMemo(() => {
    if (!allData) return []
    return allData.filter(
      (item) => item.InjuryTypeDescription === 'Entanglement'
    )
  }, [allData])

  const chartData = useMemo(() => {
    if (!entanglementData.length) return []

    const ageGroupData: Record<string, Record<string, number>> = {}
    AGE_GROUPS_ORDER.forEach((ageGroup) => {
      ageGroupData[ageGroup] = {}
      ROPE_DIAMETER_ORDER.forEach((ropeGroup) => {
        ageGroupData[ageGroup][ropeGroup] = 0
      })
    })

    entanglementData.forEach((item: WhaleInjury) => {
      const ageGroup = getAgeGroup(item.InjuryAge)
      const ropeGroup = getRopeDiameterGroup(item.RopeDiameters)
      if (
        ageGroupData[ageGroup] &&
        ageGroupData[ageGroup][ropeGroup] !== undefined
      ) {
        ageGroupData[ageGroup][ropeGroup]++
      }
    })

    return AGE_GROUPS_ORDER.map((ageGroup) => ({
      ageGroup,
      ...ageGroupData[ageGroup],
    }))
  }, [entanglementData])

  const totalEntanglements = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum +
        Object.values(item).reduce(
          (acc, val) => (typeof val === 'number' ? acc + val : acc),
          0
        ),
      0
    )
  }, [chartData])

  return (
    <ChartLayout
      title='Entanglement by Rope Diameter and Age Group'
      chartRef={chartRef}
      exportFilename='entanglement-rope-by-age.png'
      totalCount={totalEntanglements}
      loading={loading}
      error={error || undefined}
      description='Data represents entanglement cases of North Atlantic Right Whales, categorized by rope diameter and the age of the whale at the time of injury.'
    >
      <DataChart
        data={chartData}
        xAxisDataKey='ageGroup'
        xAxisLabel='Age Group'
        xAxisInterval={0}
        xAxisTickAngle={0}
        xAxisTextAnchor='middle'
        stacked={true}
        yAxisLabel='Number of Entanglements'
        customOrder={ROPE_DIAMETER_ORDER}
        showTotal={false}
      />
    </ChartLayout>
  )
}
