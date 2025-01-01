import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Active Monitoring Dashboard | Health Statistics',
  description: 'Real-time health monitoring dashboard showing active statistics and trends. Track and analyze current health data.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
