// app/api/proverbs/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const proverbs = await prisma.proverb.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return Response.json(proverbs)
}
