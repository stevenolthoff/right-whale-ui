import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entanglement by Age Class | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale entanglement incidents by age class. Track frequency and outcomes of entanglement cases over time.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
