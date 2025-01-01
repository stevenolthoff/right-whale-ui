interface ErrorMessageProps {
  error: string
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className='p-8 text-center'>
      <div className='inline-flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg'>
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className='font-medium'>Error: {error}</span>
      </div>
    </div>
  )
} 
