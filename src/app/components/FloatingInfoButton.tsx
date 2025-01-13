import React from 'react'

interface FloatingInfoButtonProps {
  onClick: () => void
}

const FloatingInfoButton = ({ onClick }: FloatingInfoButtonProps) => {
  return (
    <button
      className='fixed bottom-6 right-6 text-3xl md:text-base w-20 h-20 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors'
      onClick={onClick}
    >
      <span className='font-semibold'>i</span>
    </button>
  )
}

export default FloatingInfoButton
