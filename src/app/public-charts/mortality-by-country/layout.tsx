import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortality by Country | Health Monitoring Dashboard',
  description: 'Compare mortality statistics across different countries and regions. Visualize and analyze country-specific mortality data and trends.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
