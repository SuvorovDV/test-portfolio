# Phase 2: CRT Theming — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Визуальный слой: превратить уродливый дефолтный скелет Phase 1 в читаемый CRT-терминал. Scanlines, phosphor-зелёный моно-текст на чёрном, мигающий блочный курсор, CRT-vignette. Вся анимация (мерцание/drift/blink) корректно отключается при `prefers-reduced-motion: reduce` — при этом внешний вид остаётся CRT (никакого «light mode»).

Вне скоупа этой фазы: контент секций (Phase 3), boot sequence (Phase 5), project previews (Phase 4), финальная a11y/perf-оптимизация (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Typography
- **D-01:** Шрифт VT323 как основной моно (Google Fonts). Самохостим через npm-пакет `@fontsource/vt323` — не подключаем по CDN (приватность, кэш, офлайн dev)
- **D-02:** Только один шрифт на всём сайте — никаких sans-serif fallback'ов на body. Fallback цепочка: `'VT323', 'Courier New', monospace`
- **D-03:** `font-display: swap` обязательно (предотвращает FOIT на медленной сети)
- **D-04:** Базовый размер 18px на mobile, 20px на desktop (VT323 читается крупнее обычного моно)

### Palette
- **D-05:** Phosphor green как дефолт: `--phosphor: #33FF33` (чуть светлее чем #00FF00, меньше утомляет глаза)
- **D-06:** Фон: `--bg: #0A0F0A` (не чистый `#000` — даёт ощущение CRT-люминофора, чуть тёплый)
- **D-07:** Переменные палитры: `--phosphor`, `--phosphor-dim` (70% luminance для body текста), `--bg`, `--scanline-color`, `--scanline-opacity`, `--glow-blur`
- **D-08:** Архитектура позволяет сменить палитру на amber (`#FFB000`) через одну переменную — переключатель в v2, но CSS уже готов

### Scanlines
- **D-09:** Реализация через `repeating-linear-gradient` на `<CRTShell>` overlay div (position: fixed, inset: 0, pointer-events: none, aria-hidden)
- **D-10:** Размер полоски: 3px (2px transparent + 1px line), opacity подбирается (~0.08-0.12) чтобы не убить читаемость
- **D-11:** Лёгкий вертикальный drift анимацией 0.15s linear infinite на overlay — отключается при reduced-motion. Амплитуда: 3px (один период)

### CRT Vignette / Curvature
- **D-12:** БЕЗ SVG-фильтров и без `transform: perspective()` (перф-цена + ломает layout). Вместо этого — `box-shadow: inset 0 0 150px 30px rgba(0,0,0,0.8)` на фиксированном overlay
- **D-13:** Очень лёгкий `border-radius: 8px` на corners overlay — эффект «утолщённых углов трубки»
- **D-14:** Опционально — небольшая «vignette» (0% в центре, затемнение к краям) через радиальный градиент на overlay

### Flicker / Glow
- **D-15:** Phosphor glow через `text-shadow: 0 0 var(--glow-blur) currentColor` — у заголовков `--glow-blur: 4px`, у body `2px`
- **D-16:** Лёгкое мерцание фона через `@keyframes flicker` на scanlines overlay (opacity 0.92 ↔ 0.96 за 150ms, steps(2)) — отключается при reduced-motion
- **D-17:** WCAG 2.3.1 проверка: не более 3 вспышек в секунду. Наш flicker — 6.6 Hz. **Проблема.** Решение: сделать частоту ≤2Hz или убрать opacity-flicker полностью, оставить только drift (менее заметный, но безопасный). **Решено: убираем opacity-flicker, оставляем только scanline drift.**

### Cursor
- **D-18:** `<Cursor>` — inline-block, размеры `1ch × 1.2em`, background currentColor, анимация `blink 1s steps(2) infinite` (0% opaque → 50% transparent). Отключается при reduced-motion (статичный блок).
- **D-19:** Variants: `<Cursor inline />` для внутри текста, `<Cursor trailing />` для конца строки. По умолчанию inline.

### Architecture
- **D-20:** Глобальная CSS в `src/styles/globals.css` (импорт в `main.tsx`)
- **D-21:** CSS Modules для компонент-specific стилей (CRTShell.module.css, Cursor.module.css)
- **D-22:** `<CRTShell>` оборачивает App — рендерит scanlines + vignette overlays + children
- **D-23:** Overlay divs: два фиксированных (scanlines, vignette), z-index поверх контента но с `pointer-events: none` и `aria-hidden="true"`

### Reduced Motion
- **D-24:** Всё анимированное слушает `useReducedMotion()` и либо останавливает анимацию (conditional class), либо media query в CSS: `@media (prefers-reduced-motion: reduce) { .drift { animation: none; } }`
- **D-25:** Документируем правило: **любая новая анимация требует reduced-motion gate**. Phase 6 проверит.

### Claude's Discretion
- Точные значения opacity/blur — подбираются визуально, не лочатся
- Дополнительные украшения (glitch-transition, random char scramble) — в Phase 5 (boot) или v2

</decisions>

<specifics>
## Specific Ideas

Визуальный референс: DOS prompt + Fallout PIP-boy + Unix tty. НЕ похоже на:
- `bg-black` + Inter + flex hero (generic AI)
- Vercel-style terminal демо (слишком чисто)
- Y2K/Vaporwave (слишком много цветов)

Эстетика «честная»: ничего не скрывает техническую природу — моно везде, курсор виден, `<a>` подчёркнут как в `man`-странице.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — анти-референсы в `## Context`
- `.planning/REQUIREMENTS.md` §CRT Theming — THEME-01..07

### Research
- `.planning/research/STACK.md` §Typography и §Styling — пакет `@fontsource/vt323`, CSS Modules vs vanilla
- `.planning/research/ARCHITECTURE.md` §Styling architecture — layering scanlines/vignette/curvature
- `.planning/research/PITFALLS.md` §Aesthetic pitfalls — **обязательно** перед каждым CSS-решением; §Performance (font loading, GIF vs CSS gradient)

### Built in Phase 1
- `src/hooks/useReducedMotion.ts` — используем в `<Cursor>` и для gate на flicker/drift

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useReducedMotion()` — готов в Phase 1
- `<main>`, `<nav>`, `<section>` семантика — уже на месте, стилизуем

### Gotchas Already Known
- WCAG 2.3.1 flicker threshold — решение принято выше (D-17)
- Phosphor glow может ломать читаемость — тестируем контраст в Phase 6, а не здесь
- CSS Modules имена классов попадают в bundle hashed — нормально

</code_context>

<success_signals>
## Phase Success Signals

1. Открытая страница выглядит как CRT-терминал — чёрный фон, зелёный моно, scanlines, vignette на краях
2. Мигающий блочный курсор виден в одном месте (например, рядом с заголовком секции)
3. DevTools `prefers-reduced-motion: reduce` → scanline drift и blink курсора останавливаются, но визуал остаётся CRT
4. Размер CSS < 15 KB gzip, размер VT323 woff2 < 60 KB (одна подветка шрифта)
5. `npm run build/lint/typecheck` — всё зелёное

</success_signals>

---
*Context captured: 2026-04-15*
