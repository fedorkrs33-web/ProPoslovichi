// app/api/proverbs/[id]/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { text, language, translation, meaning, origin } = body

    if (!text) {
      return Response.json({ error: 'Текст обязателен' }, { status: 400 })
    }

    // Проверяем, что пользователь — автор
    const existing = await prisma.proverb.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.authorId !== session.user.id) {
      return Response.json({ error: 'Доступ запрещён' }, { status: 403 })
    }

    const updated = await prisma.proverb.update({
      where: { id: params.id },
      data: {
        text,
        language,
        translation,
        meaning,
        origin,
      },
    })

    return Response.json(updated)
  } catch (error) {
    console.error('Ошибка при обновлении:', error)
    return Response.json({ error: 'Не удалось обновить' }, { status: 500 })
  }
}
