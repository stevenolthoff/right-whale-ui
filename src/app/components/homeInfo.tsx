export default function HomeInfo() {
  return (
    <div id="learn-more" className='bg-gradient-to-b from-sky-50 to-white px-4 py-20'>
      <div className='grid lg:grid-cols-2 gap-16 lg:max-w-7xl max-w-2xl mx-auto items-center'>
        <div className='text-left space-y-6'>
          <h2 className='text-blue-800 text-4xl font-bold leading-tight'>
            Welcome to the North Atlantic Right Whale Anthropogenic Events
            Visualization Site
          </h2>
          <p className='text-lg text-neutral-700 leading-relaxed'>
            The North Atlantic Right Whale Anthropogenic Events Visualization
            Site was developed to provide improved access to, and visualization
            of, data associated with anthropogenic injuries to right whales.
          </p>
          <div className='pt-4'>
            <a
              href='https://www.neaq.org/animal/right-whales/'
              className='inline-flex items-center text-blue-600 font-semibold hover:text-blue-500 transition-colors'
            >
              Learn more about our work at New England Aquarium
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
        <div className='relative'>
          <div className='absolute -inset-4 bg-blue-100 rounded-2xl transform -rotate-2'></div>
          <img
            src='whale-info.webp'
            alt='North Atlantic Right Whale'
            className='relative rounded-xl shadow-lg object-cover w-full h-[400px]'
          />
        </div>
      </div>
    </div>
  )
}
