// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import YandexProvider from 'next-auth/providers/yandex'

export const handler = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    // Просто возвращаем базовую сессию
    session({ session, token }) {
      session.user.id = token.sub ?? 'test-id'
      return session
    },
  },

  debug: true,
})

export const { GET, POST } = handler