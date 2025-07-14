import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entanglement by Type and Severity | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale entanglement incidents by type and severity. Track frequency, and outcomes of entanglement cases over time.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
