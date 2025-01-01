import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Right Whale Calving Statistics | Health Monitoring Dashboard',
  description: 'Track and analyze North Atlantic Right Whale calving patterns and reproductive success rates over time. View historical calving data and trends.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
