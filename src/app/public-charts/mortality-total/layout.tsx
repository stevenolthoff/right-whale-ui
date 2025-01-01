import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Total Mortality Statistics | Health Monitoring Dashboard',
  description: 'Interactive visualization of total mortality statistics across different regions and time periods. Explore comprehensive mortality data and trends.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
