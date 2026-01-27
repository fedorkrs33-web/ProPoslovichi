# ProPoslovichi

Универсальная заготовка для Next.js-приложений: быстро масштабируется, легко интегрируется, готова к деплою на Vercel.

## 💡 Зачем это?

Этот шаблон создан как **ядро для ваших будущих проектов**.  
Используйте его, чтобы:
- Быстро стартовать новые идеи
- Объединять существующие приложения
- Добавлять базу данных, API, аутентификацию за минуты

## Технологии

- **Next.js 14** с App Router и TypeScript
- **Prisma** как ORM
- **NeonDB** (PostgreSQL) как база данных
- **Tailwind CSS** для стилей
- Готов к интеграции: Auth, API Routes, Webhooks, CI/CD

## Быстрый старт

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных

1. Создайте бесплатный проект на Neon.tech
2. Скопируйте Direct Connection URL (не pooler) в файл .env:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```


💡 Для production можно переключиться на Pooling URL после миграций.

### 3. Инициализация базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Создание первой миграции
npm run db:migrate
# → Имя миграции: init


# Заполнение базы данных тестовыми данными
npm run db:seed
```

⚠️ Всегда используйте прямое соединение (Direct) при запуске миграций.

### 4. Запуск разработки

```bash
npm run dev
```

Откройте [http://localhost:3000]

## Структура проекта

```
ProPoslovichi/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Корневой layout
│   ├── page.tsx      # Главная страница
│   └── globals.css   # Глобальные стили
├── lib/
│   └── prisma.ts     # Singleton Prisma Client
├── prisma/
│   ├── schema.prisma   # Схема БД — расширяйте под свои нужды
│   ├── migrations/     # Автосгенерированные миграции
│   └── seed.ts         # Скрипт для начальных данных
├── components/         # 👉 Новый: папка для переиспользуемых компонентов
├── types/              # 👉 Новый: общие TypeScript типы
├── utils/              # 👉 Новый: вспомогательные функции
└── .env                # Переменные окружения
```

## Модель данных
```prisma
model Note {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
}
```
🔁 Как адаптировать под свой проект:
Откройте prisma/schema.prisma и добавьте свои модели:

 - Пользователи (User);
 - Продукты (Product)
 - Заказы (Order)
 - Контент (Post, Comment и т.д.)

#### На более полезный пример:

## 🛠 Расширяемая схема данных

Начните с этой базовой модели — или замените на свою.

### Пример: Блог / CMS

```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String?
  createdAt    DateTime  @default(now())
  posts        Post[]
}

model Post {
  id          String   @id @default(uuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
После изменений выполните:

```bash
npm run db:migrate
```

# → Имя миграции: add-user-and-post-models

---

### 4. **Добавьте раздел: "Как объединить с другим проектом"**

Это **ключевая цель**, напомним о ней явно.

## 🔗 Интеграция с другим проектом

Этот шаблон создан для **лёгкого слияния** с вашим существующим кодом.

### Как перенести ваш проект сюда:

1. **Скопируйте компоненты**
   ```bash
   cp -r /ваш-проект/src/components/* ./components/
Перенесите страницы

Замените /app/page.tsx на вашу главную страницу
Добавьте новые роуты: /app/about, /app/dashboard
Обновите стили

Если использовали CSS/SCSS — адаптируйте под Tailwind
Или подключите PostCSS, если нужно
Добавьте аутентификацию (если нужно)

Рекомендуем: Clerk или Auth.js
Пример: app/api/auth/route.ts
Запустите и проверьте

bash
npm run dev

---

### 5. **Добавьте "Следующие шаги"**

Помогите себе (и другим) понять, что делать дальше.


## 🚀 Следующие шаги

[ ] Заменить модель `Note` на свою основную сущность  
[ ] Перенести ключевые компоненты из старого проекта  
[ ] Подключить аутентификацию  
[ ] Настроить деплой на Vercel  
[ ] Написать первое API-роут  
[ ] Добавить форму создания объекта  

## Деплой на Vercel

1. Подключите репозиторий к Vercel
2. В настройках проекта добавьте переменную окружения:
   - `DATABASE_URL` - ваш connection string от Neon
3. **ВАЖНО**: После деплоя необходимо создать таблицу в базе данных:
   
   **Вариант 1: Через Neon Dashboard (рекомендуется)**
   1. Откройте Neon Dashboard → ваш проект → SQL Editor
   2. Выполните SQL из файла `prisma/migrations/init.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS "notes" (
       "id" TEXT NOT NULL,
       "title" TEXT NOT NULL,
       "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
   );
   ```
   
   **Вариант 2: Через Prisma Migrate (локально)**
   1. Используйте прямой connection string (не pooler) в `.env`
   2. Выполните: `npm run db:migrate`
   3. При запросе имени миграции введите: `init`
4. Vercel автоматически выполнит `npm run build`, который включает `prisma generate`

## Полезные команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка для production
npm run start        # Запуск production сервера
npm run db:migrate   # Создание и применение миграций
npm run db:generate  # Генерация Prisma Client
npm run db:seed      # Заполнение базы данных
npm run db:studio    # Открыть Prisma Studio
```

## Решение проблем

### Ошибка подключения к базе данных

Если видите ошибку `Can't reach database server`:
1. Убедитесь, что база данных активна в Neon Dashboard (Neon приостанавливает неактивные базы)
2. Для миграций используйте прямой connection string вместо pooler
3. Проверьте правильность DATABASE_URL в `.env`
