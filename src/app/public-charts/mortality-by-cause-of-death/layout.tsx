import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortality by Cause of Death | Health Monitoring Dashboard',
  description: 'Explore detailed statistics on mortality rates categorized by different causes of death. Understand leading causes of mortality and their trends.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
