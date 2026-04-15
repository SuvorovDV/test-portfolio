---
phase: 06-a11y-perf
plan: 02
status: completed
date: 2026-04-15
---

# Plan 06-02: Font subsetting — Summary

✅ Выполнено.

## Обнаружение

`@fontsource/vt323` предоставляет субсеты: **latin, latin-ext, vietnamese**. Cyrillic subset **отсутствует** — русский текст (About, Contact, TG chat scripts) падает на Courier New fallback. Это **ОК визуально** — Courier New монопропорционален и читается в CRT-стиле (без glow VT323 и pixel-feel, но приемлемо).

## Изменение

`src/main.tsx`:
```diff
- import '@fontsource/vt323';
+ import '@fontsource/vt323/latin.css';
```

Убраны из сборки:
- `vt323-latin-ext-400-normal.woff2` (16.37 KB)
- `vt323-latin-ext-400-normal.woff` (9.63 KB)
- `vt323-vietnamese-400-normal.woff2` (7.93 KB)

Эти файлы раньше всегда попадали в `dist/` (хотя браузер мог их не запрашивать из-за unicode-range). Теперь их нет в output вообще.

## После

Bundle output содержит только:
- `vt323-latin-400-normal.woff2` (17.94 KB)
- `vt323-latin-400-normal.woff` (9.75 KB)

## Preload — отложено

Vite asset-hashing ломает статичный `<link rel="preload" href="/assets/vt323-latin-400-normal-<hash>.woff2">`. Варианты решения требуют плагина или дублирования шрифта в `public/`. В ROI-ориентированной оптимизации это не стоит усилий для one-pager — `font-display: swap` уже обеспечивает корректную стратегию.

## Verification

| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ |
| build | ✅ |
| CSS gzip | 2.76 KB (was 3.05) |
| JS gzip | 66.22 KB (без изменений — шрифт не в JS bundle) |

## Ready for

Plan 06-03 (финализация бюджетов и документации).
