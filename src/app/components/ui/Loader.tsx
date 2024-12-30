'use client'
import React from 'react'

export const Loader = () => {
  return (
    <div className='flex flex-col space-y-4 bg-white p-4 animate-pulse'>
      {/* Year slider skeleton */}
      <div className='h-12 bg-gray-200 rounded' />
      
      {/* Chart skeleton with fixed height to prevent CLS */}
      <div className='h-[500px] bg-gray-100 rounded flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    </div>
  )
} 
