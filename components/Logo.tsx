// components/Logo.tsx
import React from 'react'

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-2xl" role="img" aria-label="Globe">
        🌍 
      </span>
      <span className="font-bold">ProPoslovichi</span>
    </span>
  )
}