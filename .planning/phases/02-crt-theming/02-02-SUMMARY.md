---
phase: 02-crt-theming
plan: 02
status: completed
date: 2026-04-15
---

# Plan 02-02: CRTShell — Summary

## Outcome

✅ 3 задачи выполнены. Scanlines + vignette overlays рендерятся, кликабельность контента сохранена.

## Key guarantees

- **WCAG 2.3.1**: scanline drift на 2 Hz (0.5s period), под порогом 3 Hz
- **A11y**: оба overlay-div'а `aria-hidden="true"`, `pointer-events: none`, не попадают в tab-order
- **Reduced motion**: CSS `@media (prefers-reduced-motion: reduce) { .scanlines { animation: none; } }` — drift останавливается, scanlines остаются видимы
- **Perf**: GPU-hint `will-change: background-position`, без SVG-фильтров, без `transform: perspective()`

## Verification

| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ |
| build | ✅ 35 modules |

## Deviations

Нет.

## Ready for

Plan 02-03 (Cursor).
