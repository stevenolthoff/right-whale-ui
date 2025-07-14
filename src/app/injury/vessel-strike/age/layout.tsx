import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vessel Strike by Age Class | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale vessel strike incidents by age class. Track frequency and outcomes of vessel strike cases over time.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
