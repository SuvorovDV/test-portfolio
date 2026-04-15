# test-portfolio

## What This Is

Персональный портфолио-сайт для разработчика, показывающий его проекты — веб-приложения и Telegram-ботов — через интерактивную галерею с превью. Цель: одностраничный сайт, который выделяется за счёт выраженной ретро-эстетики (CRT/терминал) и не похож на типовые AI-сгенерированные лендинги.

## Core Value

Посетитель за 10 секунд понимает «кто это» и видит живые превью проектов, при этом сайт выглядит как намеренный художественный выбор, а не шаблон.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Раздел **About** — кто владелец, чем занимается, стек
- [ ] Раздел **Projects** — галерея 3-4 проектов (2 веб-приложения + 2 TG-бота) с превью, кратким описанием, стеком и ссылками (demo / repo / bot)
- [ ] Раздел **Contact** — способы связи (email/telegram/github)
- [ ] CRT/Terminal эстетика: моношрифт, зелёный/янтарный текст на чёрном, сканлайны, ASCII-бордеры, мерцание курсора, boot-sequence на старте (опц.)
- [ ] Превью TG-ботов: статичный мокап диалога (не живой iframe) — т.к. встроить живого бота нельзя
- [ ] Превью веб-приложений: скриншот или короткий `<video muted loop>` (GIF-лайк)
- [ ] Сайт-роутинг: одностраничный scroll с якорями `#about`, `#projects`, `#contact` + работающий back/forward
- [ ] Адаптив: десктоп + мобильный (терминал-эстетика должна читаться на узких экранах)
- [ ] Доступность: keyboard nav, контраст WCAG AA (у CRT с этим сложно — важно проверить), prefers-reduced-motion отключает сканлайны/мерцание
- [ ] Деплой на GitHub Pages через `vite build` + `gh-pages` workflow

### Out of Scope

- Бэкенд / форма отправки сообщений — контакты только ссылками (mailto/tg://), чтобы не тащить сервер
- CMS / markdown-блог — весь контент в конфиг-файле / TypeScript-константах
- Мультиязычность — только RU на старте (владелец — русскоязычный)
- Авторизация / админка — статический сайт
- Живые iframe TG-ботов — Telegram не поддерживает встраивание через iframe
- SSR/SSG-фреймворки (Next.js, Astro) — пользователь явно выбрал Vite+React
- Темы / переключатель светлой темы — CRT-эстетика несовместима с «light mode»

## Context

- **Владелец** — разработчик (стек: ещё предстоит конкретизировать на фазе контента), на 2026-04-15 начинает с нуля в пустой директории.
- **Проекты для showcase** — пока плейсхолдеры (2 веб-приложения + 2 TG-бота), заменяются реальными позже.
- **Дата-референсы стека** — нужна валидация актуальных версий Vite/React на 2026 (см. research-фазу).
- **Критично** — дизайн не должен походить на generic AI-эстетику. Явные анти-референсы из глобального CLAUDE.md пользователя:
  - https://tezis.111.88.153.18.nip.io
  - https://frontend-seven-omega-17.vercel.app
- Пользователь работает в YOLO-режиме GSD — автоодобрения, быстрое движение.

## Constraints

- **Tech stack**: Vite + React + TypeScript — жёсткое требование пользователя. Без Next.js/Astro.
- **Дизайн**: CRT / Terminal эстетика (зелёный/янтарный моно на чёрном, scanlines, ASCII, pixel cursor). Финальное направление утверждено.
- **Хостинг**: GitHub Pages — статика, значит корневой `base` путь в vite.config должен совпадать с именем репо.
- **Doзvailability**: prefers-reduced-motion должен отключать анимации — иначе фильтр на мерцающий CRT повредит пользователям с вестибулярной чувствительностью.
- **Контраст**: чистый #00FF00 на #000 даёт >20:1, но глифы с glow/blur могут ломать читаемость — нужен fallback без эффектов.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite + React + TypeScript | Выбор пользователя — не обсуждается | — Pending |
| CRT / Terminal эстетика (а не Y2K/Geocities/Pixel) | Пользователь выбрал явно; чище концептуально, лучше сочетается с темой «разработчик» | — Pending |
| Превью TG-ботов как статичный мокап диалога, а не iframe | Telegram не поддерживает iframe embedding, а Web App у бота может не быть | — Pending |
| Одностраничник со scroll + якоря, без react-router | Три секции — избыточно тащить роутер | — Pending |
| Деплой через GitHub Pages | Бесплатно, статика, ОК для vite build | — Pending |
| Анти-референсы (tezis.111.88.153.18.nip.io, frontend-seven-omega-17.vercel.app) — запрет | Глобальное правило пользователя в CLAUDE.md §6 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after initialization*
