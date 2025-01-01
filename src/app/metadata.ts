import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Right Whale Health Monitoring',
    default: 'Right Whale Health Monitoring Dashboard',
  },
  description: 'Comprehensive dashboard for monitoring North Atlantic Right Whale health, mortality, injuries, and population trends. Access real-time data and historical statistics.',
  keywords: ['Right Whale', 'marine conservation', 'whale monitoring', 'mortality tracking', 'marine biology', 'whale health'],
  authors: [{ name: 'Right Whale Research Team' }],
  openGraph: {
    title: 'Right Whale Health Monitoring Dashboard',
    description: 'Track and analyze North Atlantic Right Whale health data and conservation efforts.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
} 
