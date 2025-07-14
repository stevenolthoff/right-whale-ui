import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unknown/Other Injuries | Injury Monitoring',
  description:
    'Analysis of Right Whale injuries from unknown or other causes, excluding entanglement and vessel strikes.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
} 
