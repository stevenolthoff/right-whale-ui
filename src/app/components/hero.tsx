import Link from 'next/link'

export default function Hero() {
  return (
    <div className='relative bg-gradient-to-b from-blue-900 to-blue-800 py-16 '>
      <div className='absolute inset-0'>
        <img
          src='hero.webp'
          alt='Background Image'
          className='w-full h-full object-cover opacity-75'
        />
      </div>

      <div className='relative max-w-screen-xl mx-auto px-8 z-10 text-center text-white'>
        <h1 className='text-4xl md:text-5xl font-extrabold leading-tight mb-6 '>
          Tracking Right Whale Injuries and Mortality
        </h1>
        <p className='text-lg md:text-xl mb-12 [text-shadow:_3px_6px_7px_rgb(0_0_0_/_80%)]'>
          Empowering Awareness and Action Through Up-to-Date Data and Insights
        </p>
        <Link href='/public-charts/mortality-total'>
          <button
            type='button'
            className='bg-white hover:bg-orange-100 hover:text-black text-black font-bold text-base tracking-wide px-6 py-3 rounded-md transition duration-300 ease-in-out shadow-lg hover:shadow-xl'
          >
            Explore the Data
          </button>
        </Link>
      </div>
    </div>
  )
}
