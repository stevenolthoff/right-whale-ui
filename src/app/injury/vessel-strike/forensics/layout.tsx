import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vessel Strike Forensics | Health Monitoring Dashboard',
  description:
    'Analysis of Right Whale vessel strike forensics, including completion status and vessel size.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
