'use client'

const ChartAttribution = () => {
  return (
    <div className='text-sm text-slate-500 px-4 py-16'>
      {`Data and visualizations from the Right Whale Anthropogenic Injury Visualization Site. ${new Date().getFullYear()}. Boston, MA: New England Aquarium. Accessed ${new Date().toLocaleDateString(
        'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )}. ${window.location.origin}`}
    </div>
  )
}

export default ChartAttribution
