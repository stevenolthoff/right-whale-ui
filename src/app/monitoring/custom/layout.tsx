import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Monitoring Dashboard | Health Statistics',
  description: 'Create and customize your own health monitoring dashboard with interactive charts and data visualization tools.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
