// auth.ts
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import YandexProvider from 'next-auth/providers/yandex'

const prisma = new PrismaClient()

export const authConfig = {
  secret: process.env.AUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID || '',
      clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
}

