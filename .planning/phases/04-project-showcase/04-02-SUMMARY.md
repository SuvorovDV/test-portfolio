---
phase: 04-project-showcase
plan: 02
status: completed
date: 2026-04-15
---

# Plan 04-02 Summary

✅ `<WebAppPreview>` реализован.

## Implementation notes

- TypeScript `exactOptionalPropertyTypes: true` потребовал явного `videoSrc?: string | undefined` в пропсах (обычного `videoSrc?: string` недостаточно). Зафиксировано.
- `<video>` атрибуты: `muted loop playsInline preload="none"` + `aria-label`.
- IntersectionObserver threshold `[0, 0.5, 1]`, play/pause по 50% видимости.
- `video.play()` обёрнут в `.catch(() => {})` — AbortError при быстром скролле игнорируется.
- При `prefers-reduced-motion` — autoplay выключен, рендерится `controls` + click-to-play overlay.
- Fallback на `<img loading="lazy">` если `videoSrc` не задан (сейчас у обоих web-проектов placeholder.svg).

## Follow-up (user setup)

Добавить реальные скринкасты:
- `public/previews/tezis.mp4` + раскомментировать `videoSrc` в `src/data/projects.ts`
- `public/previews/frontend-seven.mp4` + аналогично

Формат: H.264, muted, ≤ 6 MB, ≤ 15s, aspect 8:10 (800×500).
