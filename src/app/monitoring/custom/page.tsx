'use client'

import React from 'react'
import CustomChart from '../../components/monitoring/CustomChart.tsx'
import Table from '../../components/monitoring/Table.tsx'
import Download from '../../components/monitoring/Download.tsx'

const CustomPage: React.FC = () => {
  return (
    <div>
      <CustomChart />
      <Download />
      <Table />
    </div>
  )
}

export default CustomPage
