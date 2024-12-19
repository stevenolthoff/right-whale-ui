export default function HomeInfo() {
  return (
    <div className=' bg-sky-50 px-4 py-12'>
      <div className='grid lg:grid-cols-2 gap-12 lg:max-w-6xl max-w-2xl mx-auto'>
        <div className='text-left'>
          <h2 className='text-blue-600 text-3xl font-bold mb-6'>
            Welcome to the North Atlantic Right Whale Anthropogenic Events
            Visualization Site
          </h2>
          <p className='text-sm text-neutral-800'>
            The North Atlantic Right Whale Anthropogenic Events Visualization
            Site was developed to provide improved access to, and visualization
            of, data associated with anthropogenic injuries to right whales.
          </p>
          <p className='mt-4'>
            <a
              href='https://www.neaq.org/animal/right-whales/'
              className='text-sm font-bold underline text-blue-800 hover:text-blue-500'
            >
              New England Aquarium
            </a>
          </p>
        </div>
        <div>
          <img
            src='whale-info.webp'
            alt='Placeholder Image'
            className='rounded-lg object-contain w-full h-full'
          />
        </div>
      </div>
    </div>
  )
}
