import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProPoslovichi - Энциклопедия пословиц и поговорок',
  description: 'Интерактивная энциклопедия пословиц и поговорок народов мира',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  )
}

