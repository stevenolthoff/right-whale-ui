import Image from 'next/image'

export default function Recognition() {
  const funders = [
    {
      name: 'NOAA',
      logo: '/logos/noaa.svg',
      alt: 'NOAA Logo',
      url: 'https://www.noaa.gov/',
    },
    {
      name: 'NARWC',
      logo: '/logos/narwc.png',
      alt: 'NARWC Logo',
      url: 'https://www.narwc.org/',
    },
    {
      name: 'Axiom',
      logo: '/logos/axiom.png',
      alt: 'Axiom Logo',
      url: 'https://axiomdatascience.com/',
    },
    {
      name: 'Volgenau',
      logo: '/logos/volgenau.png',
      alt: 'Volgenau Logo',
      url: 'https://www.volgenaufoundation.org/',
    },
    {
      name: 'Parallax',
      logo: '/logos/parallax.png',
      alt: 'Parallax Logo',
      url: 'https://www.parallax-consulting.com/',
    },
  ]

  return (
    <div className='space-y-4'>
      <h3 className='text-blue-900 font-bold text-lg'>Recognition</h3>
      <p className='text-slate-600 text-sm leading-relaxed'>
        We gratefully acknowledge our funders and supporters who make this work
        possible.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-center'>
        {funders.map((funder) => (
          <a
            key={funder.name}
            href={funder.url}
            target='_blank'
            rel='noopener noreferrer'
            className='relative h-16 w-full transition-transform duration-200 hover:scale-105'
          >
            <Image
              src={funder.logo}
              alt={funder.alt}
              fill
              className='object-contain'
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          </a>
        ))}
      </div>
    </div>
  )
}
