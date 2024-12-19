export default function Footer() {
  return (
    <footer className='bg-white py-16 border-t border-slate-300'>
      <div className='max-w-6xl mx-auto flex justify-between items-center px-6'>
        {/* Footer Text */}
        <p className='text-slate-600 text-sm tracking-widest uppercase'>
          © {new Date().getFullYear()} | NARW Anthropogenic Injury Event Tracker
        </p>
        {/* LinkedIn Icon */}
        <a
          href=''
          target='_blank'
          rel='noopener noreferrer'
          className='text-slate-600 hover:text-slate-900'
        >
          {/* <FaLinkedin size={20} /> */}
        </a>
      </div>
    </footer>
  )
}
