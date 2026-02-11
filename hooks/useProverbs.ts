// hooks/useProverbs.ts
import { useState, useEffect } from 'react'

export interface Proverb {
  id: string
  text: string
  language?: string
  translation?: string
  meaning?: string
  origin?: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export function useProverbs() {
  const [proverbs, setProverbs] = useState<Proverb[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProverbs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proverbs')
      const data = await res.json()
      setProverbs(data)
    } catch (error) {
      console.error('Failed to load proverbs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProverbs()
  }, [])

  return {
    proverbs,
    loading,
    refetch: fetchProverbs,
  }
}

