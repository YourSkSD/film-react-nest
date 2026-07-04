# Film — сервис бронирования билетов в кино

Приложение для просмотра афиши фильмов, расписания сеансов и бронирования мест.

## 🌐 Задеплоенное приложение

**https://filmspoject.nomorepartiessite.ru**

- Афиша: https://filmspoject.nomorepartiessite.ru
- API (пример): https://filmspoject.nomorepartiessite.ru/api/afisha/films

## Стек

- **Backend:** NestJS (TypeScript), TypeORM, PostgreSQL
- **Frontend:** React + Vite (TypeScript)
- **Инфраструктура:** Docker, docker-compose, nginx, GitHub Actions → GitHub Container Registry (ghcr.io)

## Структура

```
backend/    — NestJS API (модули films, order, logger, repository)
frontend/   — SPA на React + Vite
nginx/      — конфиг и Dockerfile обратного прокси, раздающего статику и проксирующего API
docker-entrypoint-initdb.d/ — SQL/скрипты инициализации PostgreSQL
.github/workflows/ — CI: тесты и сборка/публикация Docker-образов
```

## Быстрый старт (Docker)

Требуется Docker и Docker Compose v2.

```bash
cp .env.example .env      # заполните переменные окружения
docker compose up -d --build
```

После запуска (nginx-сервис публикуется на порту 81):
- приложение — http://localhost:81
- API — http://localhost:81/api/afisha/films
- pgAdmin — http://localhost:8080

> На сервере порт 81 проксируется системным nginx на 80/443 — поэтому
> задеплоенное приложение доступно без порта, по HTTPS.

### Запуск из готовых образов (без сборки)

Образы публикуются в ghcr.io. Для деплоя на сервере используйте pull-only compose:

```bash
cp .env.example .env
docker compose -f docker-compose.pub.yml pull
docker compose -f docker-compose.pub.yml up -d
```

## Переменные окружения

Все параметры перечислены в [`.env.example`](.env.example): владелец образов (`OWNER`),
доступы PostgreSQL (`POSTGRES_*`, `DB_*`), порт бэкенда (`BACKEND_PORT`),
драйвер БД (`DATABASE_DRIVER`) и доступы pgAdmin (`PGADMIN_*`).
Настройки бэкенда — в [`backend/.env.example`](backend/.env.example) (включая `LOGGER_TYPE`: `dev` | `json` | `tskv`).

## Тесты (backend)

```bash
cd backend
npm ci
npm test        # unit-тесты логгеров и контроллеров
npm run lint    # проверка линтером
```

## Логирование

Реализованы три логгера — `DevLogger`, `JsonLogger`, `TskvLogger`
(`backend/src/logger/`). Выбор при старте — через переменную `LOGGER_TYPE`.
