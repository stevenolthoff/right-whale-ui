'use client'

import React from 'react'
import CustomChart from '../../components/monitoring/CustomChart'
import Table from '../../components/monitoring/Table'
import Download from '../../components/monitoring/Download'

const CustomPage: React.FC = () => {
  return (
    <div>
      <CustomChart />
      <Download />
      <Table
      // defaultFilters={{
      //   IsActiveCase: 'Yes',
      //   DetectionDate: [2020, 2024],
      // }}
      />
    </div>
  )
}

export default CustomPage
