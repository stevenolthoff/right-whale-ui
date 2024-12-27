'use client'

import React from 'react'
import CustomChart from '../../components/monitoring/CustomChart.tsx'
import Table from '../../components/monitoring/Table.tsx'

const CustomPage: React.FC = () => {
  return (
    <div>
      <CustomChart />
      <Table />
    </div>
  )
}

export default CustomPage
