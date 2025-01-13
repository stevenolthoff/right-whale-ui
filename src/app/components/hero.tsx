import Link from 'next/link'

export default function Hero() {
  return (
    <div className='relative bg-gradient-to-b from-blue-900 to-blue-800 py-24 lg:py-32'>
      <div className='absolute inset-0'>
        <img
          src='hero.webp'
          alt='Background Image'
          className='w-full h-full object-cover opacity-60 mix-blend-overlay'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent'></div>
      </div>

      <div className='relative max-w-screen-xl mx-auto px-8 z-10 text-center text-white'>
        <h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-8 [text-shadow:_0px_2px_4px_rgba(0,0,0,0.3)]'>
          Tracking Right Whale Injuries and Mortality
        </h1>
        <p className='text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light [text-shadow:_0px_2px_3px_rgba(0,0,0,0.3)]'>
          Empowering Awareness and Action Through Up-to-Date Data and Insights
        </p>
        <div className='flex flex-col md:flex-row gap-4 justify-center'>
          <Link href='/public-charts/mortality-total'>
            <button
              type='button'
              className='bg-white hover:bg-blue-500 hover:text-white text-blue-900 font-bold text-lg tracking-wide px-8 py-4 rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              Explore the Data
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
