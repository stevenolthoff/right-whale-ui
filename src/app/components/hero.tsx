import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], ['0%', '30%'])

  return (
    <div className='relative bg-blue-950 py-24 lg:py-32 overflow-hidden'>
      <div className='absolute inset-0'>
        <motion.div style={{ y }} className='absolute inset-0 scale-110'>
          <img
            src='hero-2.webp'
            alt='Background Image'
            className='w-full h-full object-cover'
          />
        </motion.div>
        {/* <div className='absolute inset-0 backdrop-blur-[2px] backdrop-brightness-105'></div> */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 mix-blend-overlay'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-blue-950/30 via-transparent to-transparent'></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_60%)] mix-blend-overlay'></div>
      </div>

      <div className='relative max-w-screen-xl mx-auto px-8 z-10 text-center text-white'>
        <motion.h1
          className='text-5xl md:text-6xl font-extrabold leading-tight mb-8 [text-shadow:_0px_2px_4px_rgba(0,0,0,0.3)]'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          North Atlantic Right Whale Anthropogenic Injury Visualization
        </motion.h1>

        <motion.p
          className='text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light [text-shadow:_0px_2px_3px_rgba(0,0,0,0.3)]'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          Empowering Awareness and Action Through Up-to-Date Data and Insights
        </motion.p>

        <motion.div
          className='flex flex-col md:flex-row gap-4 justify-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <Link href='/public-charts/overview'>
            <motion.button
              type='button'
              className='relative group bg-white/90 backdrop-blur-sm text-blue-900 font-medium text-lg tracking-wide px-8 py-4 rounded-2xl transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <span className='bg-gradient-to-r from-blue-600/20 to-blue-400/20 absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
              Explore the Data
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
