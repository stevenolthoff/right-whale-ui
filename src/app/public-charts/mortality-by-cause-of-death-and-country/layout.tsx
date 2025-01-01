import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortality by Cause and Country | Health Monitoring Dashboard',
  description: 'Analyze mortality rates by specific causes of death across different countries. Compare health statistics and mortality patterns globally.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
