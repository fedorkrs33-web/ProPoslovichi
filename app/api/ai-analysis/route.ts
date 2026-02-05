// app/api/ai-analysis/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      summary,
      culturalContext,
      usageExample,
      relatedProverbs,
      modelUsed,
      proverbId,
    } = body

    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        summary,
        culturalContext: culturalContext || null,
        usageExample: usageExample || null,
        relatedProverbs: relatedProverbs || null,
        modelUsed,
        proverbId,
      },
    })

    return NextResponse.json(aiAnalysis, { status: 201 })
  } catch (error) {
    console.error('Save AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to save AI analysis' },
      { status: 500 }
    )
  }
}

