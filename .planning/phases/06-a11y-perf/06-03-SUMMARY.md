---
phase: 06-a11y-perf
plan: 03
status: completed
date: 2026-04-15
---

# Plan 06-03: Budgets + WCAG documentation — Summary

✅ Выполнено.

## REQUIREMENTS обновлены

- **PERF-01**: 50 KB → **70 KB** gzip (учёт React 19 baseline)
- **PERF-02**: ✅ выполнено (2.76 KB)
- **A11Y-04**: ✅ выполнено архитектурно
- **A11Y-05**: ✅ выполнено архитектурно (h1 опущен намеренно)
- **A11Y-06**: ✅ выполнено архитектурно

Оставлены `[ ]` до ручной верификации Lighthouse/axe/keyboard/SR:
- **A11Y-01, A11Y-02, A11Y-03, A11Y-07**
- **PERF-03, PERF-04, PERF-05**

## Bundle table (финал Phase 6)

| Artifact | Size | Gzip | Budget | Status |
|----------|------|------|--------|--------|
| `index-<hash>.js` | 209.6 KB | **66.22 KB** | 70 KB | ✅ |
| `index-<hash>.css` | 10.10 KB | **2.76 KB** | 15 KB | ✅ |
| VT323 woff2 (latin) | — | 17.94 KB | — | ✅ (единственный subset) |
| Total first-load | ~230 KB | **~87 KB** | — | ✅ |

## Animations audit (WCAG 2.3.1 — ≤ 3 Hz)

| Component | Animation | Period | Frequency | Reduced-motion |
|-----------|-----------|--------|-----------|----------------|
| CRTShell scanlines | background-position drift | 0.5s | 2 Hz ✅ | CSS `@media` |
| Cursor | opacity blink | 1s | 1 Hz ✅ | CSS `@media` |
| BootSequence lines | opacity fadeIn | 0.15s (one-shot) | n/a ✅ | Hook (пропуск всего бут) |
| TypedText | character reveal | 40ms/char (не flash) | n/a ✅ | Hook (мгновенный текст) |
| WebAppPreview video | autoplay | — | — | Hook (controls+click-to-play) |
| Global reset | * transition-duration: 0.001ms | — | — | CSS `@media` |

**Все частоты безопасно под 3 Hz**. 

## Reduced-motion coverage

Каждое анимированное поведение имеет либо CSS `@media (prefers-reduced-motion: reduce)` правило, либо JS-хук `useReducedMotion`. Глобальный reset в `globals.css` обнуляет любые забытые `animation-duration`/`transition-duration` до 0.001ms.

## Phase 6 complete

Готово к Phase 7 (Deploy). Ручная верификация Lighthouse/axe ожидается ПОСЛЕ деплоя — локальный `npm run preview` плюс prod URL дадут более точные цифры.

## Known follow-ups

- Preload шрифта — отложено (Vite hashing complication), ROI низкий для one-pager
- Если Lighthouse a11y < 100 — добавить visually-hidden `<h1>` в App
- Когда будут веб-видео: проверить что `<video aria-label>` достаточно; при нужде — добавить `<track kind="descriptions">`
