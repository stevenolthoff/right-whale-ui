import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Injury Timeframe Analysis | Health Monitoring Dashboard',
  description:
    'Comprehensive data on Right Whale injury timeframes. Analyze the duration between last known clean sightings and injury detection.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
