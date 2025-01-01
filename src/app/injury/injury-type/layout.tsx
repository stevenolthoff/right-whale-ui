import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Injury Statistics by Type | Health Monitoring Dashboard',
  description: 'Detailed analysis of injury statistics categorized by type. Explore injury patterns, trends, and distribution across different categories.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
