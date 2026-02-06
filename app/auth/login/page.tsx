'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (session) return <p>Переходим...</p>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Войти в ProPoslovichi</h1>
        <button
          onClick={() => signIn('yandex')}
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-gray-800 hover:bg-yellow-500"
        >
          🔐 Войти с Яндекс
        </button>
      </div>
    </div>
  )
}
