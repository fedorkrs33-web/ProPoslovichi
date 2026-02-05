## База данных ProPoslovichi

Среда разработки: SQLite (`file:./dev.db`). В проде планируется Postgres/Neon.

### Сущности

- **User** — пользователь, автор пословиц (используется NextAuth).
- **Account** — OAuth‑аккаунт пользователя (Яндекс/Google и т.д.).
- **Session** — сессия авторизации (NextAuth).
- **VerificationToken** — токены верификации (если понадобятся).
- **Proverb** — пословица с метаданными.
- **AiAnalysis** — сохранённый ответ ИИ по пословице (один к одному).

### Схема (Prisma)

- **User**  
  `id (cuid)`, `name?`, `email? @unique`, `emailVerified?`, `image?`  
  Связи: `accounts[]`, `sessions[]`, `proverbs[]`.

- **Account**  
  `id (cuid)`, `userId -> User`, `type`, `provider`, `providerAccountId`, токены/сроки действия.  
  `@@unique([provider, providerAccountId])`.

- **Session**  
  `id (cuid)`, `sessionToken @unique`, `userId -> User`, `expires`.

- **VerificationToken**  
  `identifier`, `token`, `expires`, `@@unique([identifier, token])`.

- **Proverb**  
  `id (uuid)`, `text`, `language?`, `translation?`,  
  `meaning?` (трактовка смысла), `origin?` (происхождение),  
  `createdAt @default(now())`,  
  `authorId? -> User (onDelete SetNull)`,  
  `aiAnalysis? -> AiAnalysis` (один к одному).

- **AiAnalysis**  
  `id (uuid)`, `summary`, `culturalContext?`, `usageExample?`, `relatedProverbs?`,  
  `modelUsed`, `processedAt @default(now())`,  
  `proverbId @unique -> Proverb`.

### Правила доступа

- Пословицы могут добавлять только авторизованные пользователи (User).  
- Автор пословицы хранится в `Proverb.authorId`; при удалении пользователя ссылка обнуляется.  
- Анализ ИИ хранится в `AiAnalysis` и ссылается на одну пословицу (1:1).
