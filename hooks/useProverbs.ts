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
      if (res.ok) {
        const data: Proverb[] = await res.json()
        setProverbs(data)
      } else {
        console.error('Ошибка загрузки:', await res.text())
      }
    } catch (error) {
      console.error('Сеть:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProverbs()
  }, [])

  const refetch = () => fetchProverbs()

  return { proverbs, loading, refetch }
}
