# Phase 4: Project Showcase — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Наполнить раздел Projects галереей из 4 реальных проектов владельца (2 веб-приложения + 2 Telegram-бота) с типизированной схемой, карточками и уместными превью. Для веба — короткое silent-видео, запускаемое по IntersectionObserver; для ботов — статичный React-мокап диалога, стилизованный под Telegram.

</domain>

<decisions>
## Owner-provided projects (2026-04-15)

### Web apps
- **D-01:** `tezis` — URL `https://tezis.111.88.153.18.nip.io`. Описание: **TODO владелец** (заполнить в ContactSection или напрямую в projects.ts — я поставлю placeholder «web app demo»).
- **D-02:** `frontend-seven` — URL `https://frontend-seven-omega-17.vercel.app/`. Описание: **TODO владелец**. Placeholder «web app demo» + стек «React / Vercel».

> ⚠️ **Анти-референсы**: эти же URL фигурируют в глобальном CLAUDE.md пользователя как «дизайн портфолио не должен походить на». Это не конфликт — мы показываем их как его проекты в галерее, не копируя их визуал в сам портфолио (CRT-эстетика совершенно не похожа на них).

### Telegram bots
- **D-03:** `@test_marketplace_kwork_bot` — клон-демо kwork-маркетплейса внутри Telegram. Сценарий мокапа: `/start` → список категорий услуг → выбор → профиль фрилансера.
- **D-04:** `@demo_ticket_seller_bot` — продажа билетов на мероприятия. Сценарий: `/start` → список событий → выбор → оплата (stub).

## Project type schema

- **D-05:** Discriminated union в `src/types/project.ts`:
  ```ts
  interface ProjectBase {
    id: string;          // slug для href/key
    title: string;       // человеческое имя
    year: number;        // год реализации
    stack: string[];     // ['React','Vite','Python','aiogram'...]
    description: string; // 1-2 предложения
    repoUrl?: string;    // опц., может быть приватный
  }
  interface WebProject extends ProjectBase {
    type: 'web';
    liveUrl: string;
    posterSrc: string;   // /previews/<id>.webp — всегда
    videoSrc?: string;   // /previews/<id>.mp4 — опционально; если нет — только poster
  }
  interface TelegramProject extends ProjectBase {
    type: 'telegram';
    botUsername: string; // '@...'
    botUrl: string;      // https://t.me/...
    chatScript: ChatMessage[];
  }
  type ChatMessage =
    | { from: 'bot'; text: string; timestamp?: string; buttons?: string[][] }
    | { from: 'user'; text: string; timestamp?: string };
  type Project = WebProject | TelegramProject;
  ```

## Project card layout

- **D-06:** ASCII-бордер вокруг карточки:
  ```
  ┌──────────────────────┐
  │ title            2026 │
  │ [preview media]       │
  │ description...        │
  │ > stack items         │
  │ [live] [repo] [open]  │
  └──────────────────────┘
  ```
- **D-07:** Реализация ASCII-бордера: **не** через unicode box-drawing в DOM (ломает вёрстку при wrap). Вместо этого — CSS `border: 1px solid var(--phosphor-dim)` + углы через `::before`/`::after` с content-символами `┌ ┐ └ ┘`, или вообще без углов — только тонкая рамка. **Решено: тонкая рамка + один псевдо-элемент для символа `>` в начале title** (имитация terminal-style).
- **D-08:** Сетка: 1 колонка на mobile, 2 на desktop (≥ 768px). `grid-template-columns: repeat(auto-fit, minmax(28ch, 1fr))`.

## Web preview (video)

- **D-09:** `<video muted loop playsinline preload="none" poster="/previews/<id>.webp">` с fallback текстом внутри для SR.
- **D-10:** Play/pause по IntersectionObserver — стартует при intersection ratio ≥ 0.5, паузится при уходе. При `prefers-reduced-motion: reduce` — не воспроизводится автоматически; пользователь может кликнуть на превью → video controls.
- **D-11:** Если у проекта нет `videoSrc`, рендерим только `<img src={posterSrc}>`. Оба web-проекта владельца **могут не иметь видео** изначально — добавит позже.
- **D-12:** Размер poster: 800×500 WebP (16:10). Пока нет реальных медиа — placeholder 800×500 чёрный PNG с phosphor-текстом «[ recording pending ]» (сгенерирую простейший SVG placeholder и положу в `public/previews/placeholder.webp`). Альтернативно — только текстовый блок «> demo pending».

## Telegram preview (chat mockup)

- **D-13:** `<TelegramChatPreview>` — полностью React, без внешних ассетов. Структура:
  - Заголовок: имя бота (`Test Marketplace`), username (`@test_marketplace_kwork_bot`), маленький avatar-placeholder (символ `◆` или первая буква в круге)
  - Лента сообщений: чередование `user` и `bot` bubble'ов, timestamp под каждым
  - Inline keyboard: кнопки отрисованы как `[ Button ]` текстом в рамке
  - Affordance: внизу строка «preview — not a live bot» (dim цвет)
  - CTA «Open in Telegram» снизу (ссылка на botUrl)
- **D-14:** Стилизация **под** Telegram, но **без** копирования trade-dress:
  - Цвета — наша phosphor-палитра (не синий telegram-blue)
  - Bubbles — rounded rectangles, user справа (в phosphor), bot слева (в phosphor-dim с бордером)
  - НЕ использовать логотип Telegram, название «Telegram» — только слово «bot» и username
- **D-15:** Timestamps — статичные («12:34»), не реальные, чтобы скриншоты не устаревали
- **D-16:** Кнопки inline-клавиатуры — чисто декоративные (не кликабельные). Можно `<span>` с ролью `presentation`.

## Data location

- **D-17:** `src/data/projects.ts` — единственный источник. Экспорт массива `PROJECTS: Project[]`.
- **D-18:** Слаги (`id`) — kebab-case: `tezis`, `frontend-seven`, `marketplace-kwork`, `ticket-seller`.

## Architecture impact

- **D-19:** Новые компоненты: `<ProjectCard>`, `<WebAppPreview>`, `<TelegramChatPreview>`. Все в `src/components/`.
- **D-20:** `ProjectsSection` читает `PROJECTS` и рендерит `<ProjectCard project={p} />` в grid. Тип переключает внутри ProjectCard какой preview показать.
- **D-21:** `public/previews/` — директория под медиа; сейчас кладём placeholder.

## Claude's Discretion

- Конкретный текст description/stack для каждого проекта — placeholder, владелец поправит
- Точные chatScript сообщения для ботов — я сгенерирую правдоподобные по названиям, владелец отредактирует

</decisions>

<specifics>
## Specific Ideas

Карточки должны читаться как `ls -la` вывод, не как marketing-cards. Никаких «Used by 10k users», «4.9 ⭐», «View case study →». Просто: что это, год, стек, ссылка.

</specifics>

<canonical_refs>
- `.planning/REQUIREMENTS.md` — SHOW-01..05, CONT-03
- `.planning/research/FEATURES.md` §Project showcase patterns — подтверждает direction (static React TG mockup, не iframe)
- `.planning/research/PITFALLS.md` §TG bot mockup, §React pitfalls, §Content

## Built so far

- `useReducedMotion` из Phase 1 — обязателен для WebAppPreview autoplay
- `src/types/sections.ts` — пример discriminated union паттерна

</canonical_refs>

<code_context>
### Gotchas Already Known

- `<video autoplay muted>` без `playsinline` ломается на iOS Safari (разворачивается в полноэкранный плеер)
- IntersectionObserver + video.play(): возвращает Promise — обязательно catch (иначе AbortError при быстрой смене видимости)
- `<img>` lazy loading достаточно (`loading="lazy"`) — но poster'ы всегда, не откладываем
- Unicode `◆`, `│`, `┌` работают в моно-шрифтах, но VT323 может их не иметь в своём subset'е — проверять на live сайте, fallback — ASCII `*`, `|`, `+`

</code_context>

<success_signals>
1. Projects секция показывает сетку из 4 карточек (2 web + 2 telegram)
2. При прокрутке web-preview стартует когда видна, паузится когда нет
3. TG-мокап читается как «это похоже на Telegram», но без логотипов
4. Owner может поменять описание/стек/скриншоты правкой `src/data/projects.ts` + `public/previews/` без трогания кода
5. build/lint/typecheck зелёные
</success_signals>

---
*Context captured: 2026-04-15*
