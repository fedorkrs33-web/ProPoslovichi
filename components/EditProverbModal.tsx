// components/EditProverbModal.tsx
'use client'

import { useState } from 'react'

interface Proverb {
  id: string
  text: string
  language?: string
  translation?: string
  meaning?: string
  origin?: string
}

interface EditProverbModalProps {
  proverb: Proverb
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditProverbModal({
  proverb,
  isOpen,
  onClose,
  onSuccess,
}: EditProverbModalProps) {
  const [formData, setFormData] = useState({
    text: proverb.text,
    language: proverb.language || '',
    translation: proverb.translation || '',
    meaning: proverb.meaning || '',
    origin: proverb.origin || '',
  })

  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`/api/proverbs/${proverb.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        alert('Не удалось обновить пословицу')
      }
    } catch (error) {
      console.error('Ошибка при редактировании:', error)
      alert('Ошибка сети')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Редактировать пословицу</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст *</label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Языковая группа</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Перевод</label>
            <input
              type="text"
              name="translation"
              value={formData.translation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Трактовка</label>
            <textarea
              name="meaning"
              value={formData.meaning}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Происхождение</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
