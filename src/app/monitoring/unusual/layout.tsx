import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unusual Mortality Events | Health Monitoring Dashboard',
  description: 'Monitor and analyze unusual mortality events affecting North Atlantic Right Whales. Track patterns and investigate potential causes.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
