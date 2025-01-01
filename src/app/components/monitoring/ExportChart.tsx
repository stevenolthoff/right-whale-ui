'use client'
import React from 'react'
import * as htmlToImage from 'html-to-image'

interface ExportChartProps {
  chartRef: React.RefObject<HTMLDivElement>
  filename: string
  title?: string
  caption?: string
}

export const ExportChart: React.FC<ExportChartProps> = ({ 
  chartRef, 
  filename,
  title,
  caption 
}) => {
  const handleExport = async () => {
    if (!chartRef.current) return
    
    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        quality: 1.0,
        backgroundColor: 'white',
      })
      
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting chart:', error)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 
        bg-gradient-to-r from-blue-600 to-blue-500 
        hover:from-blue-700 hover:to-blue-600
        text-white font-semibold text-sm rounded-lg
        shadow-sm hover:shadow-md
        transform hover:-translate-y-0.5
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        active:transform active:translate-y-0
        ml-4"
      aria-label="Export chart as image"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 transition-transform group-hover:translate-y-0.5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className="relative top-px">Export Chart</span>
    </button>
  )
} 
