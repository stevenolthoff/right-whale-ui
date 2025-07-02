import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Injury Timeframe Statistics | Health Monitoring Dashboard',
  description:
    'Comprehensive data on Right Whale vessel strike incidents. Analyze patterns, frequencies, and impacts of vessel strikes on whale populations.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
