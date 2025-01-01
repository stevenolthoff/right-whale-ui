import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources | Right Whale Health Monitoring',
  description: 'Access educational resources, research materials, and documentation about North Atlantic Right Whale health monitoring and conservation efforts.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
