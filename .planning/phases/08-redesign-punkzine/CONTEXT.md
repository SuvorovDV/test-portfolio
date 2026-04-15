# Phase 8: Redesign — Punk-zine Brutalism

**Gathered:** 2026-04-15 (после live-деплоя Phase 7)
**Status:** In execution

## Phase Boundary

Полный визуальный rebuild. Код-логика (хуки, structure, data) остаётся. Меняется: палитра, типографика, компоненты-декорации, метафоры копирайта, favicon, og.

## Locked decisions

### Aesthetic
- **D-01:** Punk-zine neobrutalism — не classic gumroad-yellow (generic), а: cream фон + чёрные толстые бордеры + ОДИН агрессивный акцент **fire red #FF2E1F** + hard-offset shadows + лёгкий rotate карточек + halftone-тесктура
- **D-02:** Все CRT-атрибуты (scanlines, phosphor glow, курсор, boot, typewriter, моно-шрифт VT323) — **удалить**

### Palette
- `--paper`: #F4F1EA (cream / off-white, чуть тёплый)
- `--ink`: #0A0A0A (почти чёрный для border/text)
- `--ink-muted`: #4A4A4A (secondary text)
- `--accent`: #FF2E1F (fire red, 1 цвет-акцент)
- `--accent-dark`: #C41C10 (для hover/active state)

### Typography
- **D-03:** `@fontsource-variable/space-grotesk` (300-700 variable) — единственный шрифт. Space Grotesk — современный гротеск с характером, хорошо смотрится в brutalism, не Helvetica (избитая) и не Inter (generic).
- **D-04:** Display weights: 700 для h1/h2, 500 для h3, 400 для body
- **D-05:** Убираем VT323. Моно-акцент не нужен — гротеск сам несёт punk-character

### Structural
- **D-06:** Удалить компоненты: `<BootSequence>`, `<Cursor>`, `<CRTShell>`, `<TypedText>` + хук `useBootShown`
- **D-07:** Переименовать `<TerminalPrompt>` → `<Nav>`. Содержимое: ABOUT / PROJECTS / CONTACT (uppercase, bold), без `cd`, без `user@host`
- **D-08:** `App.tsx`: без CRTShell-обёртки, без boot-гейта, прямой рендер Nav + main

### Card / interaction style
- **D-09:** Карточки: border 3px solid ink, box-shadow `6px 6px 0 var(--ink)` (hard offset, без blur). Rotate `-0.5deg` или `1deg` (рандомизируем через CSS var на карточку).
- **D-10:** Hover на кликабельных карточках/кнопках: shadow исчезает (`0 0`) + translate(6px, 6px) — классическая brutalism-интеракция «вдавить»
- **D-11:** Accent-buttons (основные CTA): фон accent, текст ink, бордер ink, shadow. Secondary: paper фон + ink текст + ink border.

### Background texture
- **D-12:** Halftone dots через `radial-gradient` на body (низкая плотность, тонко). Создаёт zine-feel, но не перегружает.

### Content copy
- **D-13:** Убираем из About префиксы `>` и typewriter. Просто жирный заголовок имени + описание.
- **D-14:** Contact: `<dl>` остаётся, но grid без `·`-разделителей, с крупными жирными ссылками.
- **D-15:** Navigation: `ABOUT` / `PROJECTS` / `CONTACT` — CAPS, жирные, без декораций кроме underline на hover.

### Project cards
- **D-16:** ProjectCard: заголовок проекта крупный accent, stack как массив `<span>`-pills с ink-бордером; year справа; `[live]` / `[open in telegram]` — как CTA-кнопки accent
- **D-17:** TelegramChatPreview: убираем попытку выглядеть как Telegram, делаем mockup в ZINE-стиле (как бы «скрин со сломанным копи-паста»): зигзаг-borders? Нет — слишком. Оставим bubble'ы, но цвета ink/paper/accent. Без аватара-буквы — заменим на rectangle с `@username`.
- **D-18:** WebAppPreview: рамка 3px ink, shadow. Placeholder SVG и видео-контейнер остаются функционально.

### Favicon / OG
- **D-19:** Favicon: чёрный квадрат с крупной белой «S» (или красной) — brutalism-style инициал
- **D-20:** OG.svg 1200×630: cream фон, огромное SUVOROV DENIS чёрным (700 weight), подзаголовок accent-красным, halftone texture

### theme-color
- **D-21:** `<meta name="theme-color" content="#F4F1EA">` (cream, в тон фона)

## Files impact

### Delete
- `src/components/BootSequence.tsx`, `BootSequence.module.css`
- `src/components/Cursor.tsx`, `Cursor.module.css`
- `src/components/CRTShell.tsx`, `CRTShell.module.css`
- `src/components/TypedText.tsx`, `TypedText.module.css`
- `src/hooks/useBootShown.ts`

### Rename/rewrite
- `TerminalPrompt.tsx`/.module.css → `Nav.tsx`/`Nav.module.css`
- All section component CSS modules — rewritten
- All remaining component CSS modules — rewritten
- `tokens.css`, `globals.css` — rewritten
- `main.tsx` — replace font import
- `App.tsx` — simplified (no CRTShell, no boot gate)
- `index.html` — theme-color
- `public/favicon.svg`, `public/og.svg` — new design
- `package.json` — remove @fontsource/vt323, add @fontsource-variable/space-grotesk

### Keep as-is
- All hooks except useBootShown
- `src/types/*`
- `src/data/projects.ts`
- `vite.config.ts` (base уже корректный)
- `.github/workflows/deploy.yml`
- Section component TSX structure (меняется только visual — классы и убираются импорты deleted components)

## Success signals
1. Сайт открывается в punk-zine стиле: cream фон, огромные чёрные заголовки, fire-red accent
2. Все секции работают (Nav scroll, About-content, ProjectCards, TG-mockup, Contact copy)
3. Hover на интерактивных — shadow-shift интеракция
4. prefers-reduced-motion отключает все анимации (shadow-shift через `@media` → без анимации; инверсия цветов OK)
5. Keyboard a11y не регрессировал
6. Deploy через push в main

---
*Executed inline 2026-04-15*
