// app/api/analyze/route.ts

import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { text, language, model } = await request.json()

  const aiResponse = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, model }),
  })

  const analysis = await aiResponse.json()

  return Response.json(analysis)
}
