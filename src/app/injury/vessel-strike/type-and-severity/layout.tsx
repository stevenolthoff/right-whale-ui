import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vessel Strike by Type and Severity | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale vessel strike incidents by type and severity. Track frequency and outcomes of vessel strike cases over time.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
