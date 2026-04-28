# Google Forms Lite

Монорепозиторій: **pnpm** + Turborepo — **client/** (React, Redux Toolkit, RTK Query + GraphQL) і **server/** (NestJS, Apollo GraphQL). Файл `packages/shared/graphql/schema.graphql` оновлюється при старті сервера Nest (`autoSchemaFile`); клієнтський GraphQL codegen у зборці читає цей файл.

## Вимоги

- **Node.js** **≥ 20.19.0** (див. `package.json` → `engines`)
- **pnpm** 9 або 10 (у корені вказано `packageManager`)

## Встановлення та запуск

У **корені** репозиторію:

```bash
pnpm install
pnpm dev
```

Команда `pnpm dev` (через `turbo.json`) паралельно піднімає клієнт і сервер.

| Що | Адреса |
|----|--------|
| UI (Vite) | http://localhost:5173 |
| GraphQL API | http://localhost:3000/graphql |

Скопіюйте `client/.env.example` у `client/.env.development` (або задайте змінну в середовищі):

```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

Якщо **Corepack**/`pnpm` дає помилку підписів, встановіть pnpm окремо (наприклад `npm install -g pnpm@10`) і знову виконайте `pnpm install` у корені.

## Збірка

```bash
pnpm build
```

Для клієнта перед типами та Vite виконується `graphql-codegen` і скрипт `client/scripts/strip-graphql-documents.mjs` (див. `client/package.json` → `build`).

## Тести (сервер)

```bash
pnpm --filter server test
```

## Структура

| Каталог | Зміст |
|---------|--------|
| `client/` | Маршрути `/`, `/forms/new`, `/forms/:id/fill`, `/forms/:id/responses` |
| `server/` | Форми та відповіді в пам’яті, GraphQL API |
| `packages/shared/graphql/` | Схема `schema.graphql` для клієнтського codegen |

## Git (GitHub або GitLab)

Після локального коміту створіть **пустий** репозиторій на хостингу (без автогенерованого README, якщо в репо вже є `README.md`), далі:

```bash
git remote add origin <URL вашого репозиторія>
git push -u origin main
```

Для **HTTPS** на GitHub потрібен **Personal Access Token** замість пароля; для **SSH** зареєструйте ключ у акаунті й використовуйте URL виду `git@github.com:USER/repo.git`.
