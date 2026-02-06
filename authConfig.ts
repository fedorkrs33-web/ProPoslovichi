// authConfig.ts
import YandexProvider from 'next-auth/providers/yandex'

export const authConfig = {
  // Указываем секрет из переменной окружения
  secret: process.env.AUTH_SECRET,

  // Провайдеры
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
    }),
  ],

  // Стратегия сессий — лучше "database", но можно начать с "jwt"
  session: {
    strategy: 'jwt' as const,
  },

  // Не требуем проверки email
  pages: {
    signIn: '/auth/login',
  },
}
