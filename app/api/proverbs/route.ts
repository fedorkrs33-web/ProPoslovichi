// app/api/proverbs/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Получить все пословицы
export async function GET() {
  try {
    const proverbs = await prisma.proverb.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(proverbs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proverbs' }, { status: 500 })
  }
}

// POST: Добавить новую пословицу
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { text, language, translation, meaning, origin } = body

    if (!text || !language) {
      return NextResponse.json(
        { error: 'Text and language are required' },
        { status: 400 }
      )
    }

    const proverb = await prisma.proverb.create({
      data: {
        text,
        language,
        translation: translation || null,
        meaning: meaning || null,
        origin: origin || null,
      },
    })

    return NextResponse.json(proverb, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create proverb' }, { status: 500 })
  }
}
