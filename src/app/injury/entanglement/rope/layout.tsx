import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entanglement by Rope Diameter & Age | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale entanglement incidents by rope diameter and age group.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
