import React from 'react'

const FloatingInfoButton = () => {
  return (
    <button
      className='fixed bottom-6 right-6 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors'
      onClick={() => {
        // Add your click handler here
      }}
    >
      <span className='text-xl font-semibold'>i</span>
    </button>
  )
}

export default FloatingInfoButton
