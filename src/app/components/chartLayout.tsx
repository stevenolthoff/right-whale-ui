interface IChartLayoutProps {
  title: string
  description: string
  children?: React.ReactNode
}

export default function ChartLayout({
  title,
  description,
  children,
}: IChartLayoutProps) {
  return (
    <div className=''>
      <div className='text-3xl'>{title}</div>
      <div className='max-w-[800px]'>{description}</div>
      {children}
    </div>
  )
}
