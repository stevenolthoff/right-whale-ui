import { Loader } from '@/app/components/ui/Loader'
// ... other imports

export default function VesselStrike() {
  const { data, loading, error } = useInjuryData()
  // ...

  if (loading) return <Loader />
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>
} 
