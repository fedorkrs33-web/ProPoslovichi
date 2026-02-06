'use client'

import EditProverbModal from '@/components/EditProverbModal'
import { useProverbs } from '@/hooks/useProverbs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useSession } from 'next-auth/react'

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
  const [editingProverb, setEditingProverb] = useState<Proverb | null>(null)
  const { data: session } = useSession()
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
      {/* Кнопка авторизации под заголовком */}
      <section className="bg-blue-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {session ? (
            <p className="text-gray-700">
              Привет, <strong>{session.user.name || session.user.email}</strong>!
            </p>
          ) : (
            <Link href="/auth/login">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                title="Войдите, чтобы добавлять пословицы и использовать ИИ-анализ"
              >
                🔐 Войти
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Список пословиц в виде таблицы */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Последние пословицы</h2>

          {loading ? (
            <p className="text-gray-600">Загрузка...</p>
          ) : proverbs.length === 0 ? (
            <p className="text-gray-600">Пока нет ни одной пословицы.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Текст пословицы</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Языковая группа</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Трактовка</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {proverbs.map((proverb) => (
                    <tr key={proverb.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{proverb.text}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {proverb.language || '—'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {proverb.meaning || '—'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnalyze(proverb)}
                            disabled={analyzing === proverb.id}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-60"
                            title="Запустить ИИ-анализ смысловой нагрузки, контекста и культурных ассоциаций"
                          >
                            {analyzing === proverb.id
                              ? 'Анализ...'
                              : analysis[proverb.id]
                                ? '✅ Анализ'
                                : '🔍 Анализ ИИ'}
                          </button>
                          <button
                            onClick={() => setEditingProverb(proverb)}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                            title="Открыть редактор для изменения текста, перевода или происхождения"
                          >
                            📝 Редактор
                          </button>
                        </div>

                        {/* Блок анализа под строкой (опционально) */}
                        {analysis[proverb.id] && !analysis[proverb.id].error && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700 border">
                            <p><strong>Смысл:</strong> {analysis[proverb.id].summary}</p>
                            {analysis[proverb.id].culturalContext && (
                              <p><strong>Контекст:</strong> {analysis[proverb.id].culturalContext}</p>
                            )}
                          </div>
                        )}

                        {analysis[proverb.id]?.error && (
                          <p className="text-red-600 text-xs mt-1">{analysis[proverb.id].error}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main> 

      {/* Модальное окно редактирования */}
      {editingProverb && (
        <EditProverbModal
          proverb={editingProverb}
          isOpen={true}
          onClose={() => setEditingProverb(null)}
          onSuccess={refetch} // Обновляет список пословиц
        />
      )}

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

