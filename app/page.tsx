'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Proverb {
  id: string
  text: string
  language: string
  translation?: string
  meaning?: string
  origin?: string
  createdAt: string
}

export default function HomePage() {
  const [proverbs, setProverbs] = useState<Proverb[]>([])

  useEffect(() => {
    fetch('/api/proverbs')
      .then((res) => res.json())
      .then((data) => setProverbs(data))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">🌍 ProPoslovichi</h1>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ProPoslovichi</h1>
            <p className="text-xl mb-8">Энциклопедия пословиц народов мира</p>
            <button
              onClick={() => alert('Добавление в разработке')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              <Plus className="w-5 h-5" />
              Добавить пословицу
            </button>
          </div>
        </section>

        {/* Список пословиц */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Последние</h2>
            {proverbs.length === 0 ? (
              <p>Загрузка...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proverbs.map((proverb) => (
                  <div key={proverb.id} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold">{proverb.text}</h3>
                    <p><strong>Язык:</strong> {proverb.language}</p>
                    {proverb.translation && <p><strong>Перевод:</strong> {proverb.translation}</p>}
                    {proverb.meaning && <p><strong>Значение:</strong> {proverb.meaning}</p>}
                    {proverb.origin && <p><strong>Происхождение:</strong> {proverb.origin}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 ProPoslovichi. Все права защищены.</p>
      </footer>
    </div>
  )
}


