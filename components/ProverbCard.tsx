// components/ProverbCard.tsx

export default function ProverbCard({ proverb }) {
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        text: proverb.text,
        language: proverb.language,
        model: 'gigachat'
      })
    })
    const data = await res.json()
    setAnalysis(data)
  }

  return (
    <div className="border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold">{proverb.text}</h2>
      <p><strong>Язык:</strong> {proverb.language}</p>
      <p><strong>Перевод:</strong> {proverb.translation}</p>
      <p><strong>Происхождение:</strong> {proverb.origin}</p>

      <button
        onClick={handleAnalyze}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        💡 Анализировать ИИ
      </button>

      {analysis && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Анализ:</h3>
          <p>{analysis.summary}</p>
          <p><strong>Контекст:</strong> {analysis.culturalContext}</p>
        </div>
      )}
    </div>
  )
}
