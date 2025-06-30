import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whale Case History | Right Whale Health Monitoring',
  description:
    'Access whale case history and documentation about North Atlantic Right Whale health monitoring and conservation efforts.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
