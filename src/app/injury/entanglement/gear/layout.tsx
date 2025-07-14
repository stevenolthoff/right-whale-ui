import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entanglement by Gear | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale entanglement incidents by gear presence and retrieval status.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
