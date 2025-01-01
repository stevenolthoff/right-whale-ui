import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entanglement Statistics | Health Monitoring Dashboard',
  description: 'Detailed analysis of Right Whale entanglement incidents. Track frequency, severity, and outcomes of entanglement cases over time.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
