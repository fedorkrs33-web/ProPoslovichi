'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'

interface Proverb {
  id: string
  text: string
  language?: string
  translation?: string
  meaning?: string
  origin?: string
  createdAt: string
  author?: { id: string; name: string | null; email: string | null } | null
}

export default function HomePage() {
  const [proverbs, setProverbs] = useState<Proverb[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    text: '',
    language: '',
    translation: '',
    meaning: '',
    origin: '',
  })
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Record<string, any>>({})

  // Загрузка пословиц при старте
  useEffect(() => {
    const fetchProverbs = async () => {
      try {
        const res = await fetch('/api/proverbs')
        const data = await res.json()
        setProverbs(data)
      } catch (error) {
        console.error('Failed to load proverbs:', error)
      }
    }
    fetchProverbs()
  }, [])

  // Обработчик формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // ← Включаем состояние загрузки
    try {
      const res = await fetch('/api/proverbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newProverb = await res.json()
        setProverbs([newProverb, ...proverbs])
        setFormData({ text: '', language: '', translation: '', meaning: '', origin: '' })
        setIsModalOpen(false)
      } else {
        alert('Ошибка при добавлении')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Не удалось отправить данные')
    } finally {
      setLoading(false) // ← Всегда выключаем, даже если ошибка
    }
  }


  // Анализ через ИИ
  const handleAnalyze = async (proverb: Proverb) => {
    setAnalyzing(proverb.id)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: proverb.text, language: proverb.language }),
      })

      if (!response.ok) throw new Error('Failed')

      const result = await response.json()

      setAnalysis((prev) => ({
        ...prev,
        [proverb.id]: result,
      }))

      // Сохраняем анализ в базу
      await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result,
          proverbId: proverb.id,
        }),
      })
    } catch (error) {
      console.error('AI failed:', error)
      alert('Ошибка анализа')
    } finally {
      setAnalyzing(null)
    }
  }

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
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
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
              <p className="text-gray-600">Загрузка...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proverbs.map((proverb) => (
                  <div key={proverb.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{proverb.text}</h3>
                    {proverb.language && <p><strong>Язык:</strong> {proverb.language}</p>}
                    {proverb.translation && <p><strong>Перевод:</strong> {proverb.translation}</p>}
                    {proverb.meaning && <p><strong>Трактовка смысла:</strong> {proverb.meaning}</p>}
                    {proverb.origin && <p><strong>Происхождение:</strong> {proverb.origin}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Дата внесения:</strong>{' '}
                      {new Date(proverb.createdAt).toLocaleDateString('ru-RU')}
                      {proverb.author && (
                        <> · <strong>Внёс:</strong> {proverb.author.name || proverb.author.email || '—'}</>
                      )}
                    </p>

                    <button
                      onClick={() => handleAnalyze(proverb)}
                      disabled={analyzing === proverb.id}
                      className="mt-2 text-sm text-blue-600 hover:underline disabled:opacity-70"
                    >
                      {analyzing === proverb.id ? 'Анализ...' : '🔍 Анализировать с помощью ИИ'}
                    </button>

                    {analysis[proverb.id] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                        {analysis[proverb.id].summary && (
                          <p><strong>Смысл:</strong> {analysis[proverb.id].summary}</p>
                        )}
                        {analysis[proverb.id].culturalContext && (
                          <p><strong>Контекст:</strong> {analysis[proverb.id].culturalContext}</p>
                        )}
                        {analysis[proverb.id].usageExample && (
                          <p><strong>Пример:</strong> {analysis[proverb.id].usageExample}</p>
                        )}
                        {analysis[proverb.id].relatedProverbs && (
                          <p><strong>Похожие:</strong> {analysis[proverb.id].relatedProverbs}</p>
                        )}
                        {analysis[proverb.id].modelUsed && (
                          <p className="text-xs text-gray-500">
                            Модель: {analysis[proverb.id].modelUsed}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2026 ProPoslovichi. Все права защищены.</p>
      </footer>

      {/* === Модальное окно для добавления пословицы === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Добавить пословицу</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Текст *</label>
                  <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Без труда не выловишь и рыбку из пруда"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Язык *</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="ru"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Перевод</label>
                  <input
                    type="text"
                    name="translation"
                    value={formData.translation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Without work, you won't catch a fish from the pond"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Значение</label>
                  <textarea
                    name="meaning"
                    value={formData.meaning}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Успех требует усилий"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Происхождение</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Русские"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-70"
                  >
                    {loading ? 'Сохраняем...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

