# Phase 6: A11y & Performance Pass — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Ревизия доступности и перформанса на уже-собранном MVP (Phases 1-5). Phase 7 (Deploy) должна начаться на зелёной Lighthouse A11y = 100, Performance ≥ 90. Бюджеты: JS < 50 KB gzip, CSS < 15 KB gzip, LCP < 1.5s на 3G, CLS = 0.

Реальность на старте фазы (снапшот после Phase 5):
- CSS **3.05 KB gzip** ✅ (бюджет 15 KB)
- JS **66.21 KB gzip** ❌ (бюджет 50 KB) — перебор на ~33%
- VT323 шрифт: 3 subset'а загружаются (latin 17.94 KB, latin-ext 16.37 KB, vietnamese 7.93 KB woff2)

</domain>

<decisions>
## Accessibility scope

- **D-01:** Использовать **axe-core** через браузерный DevTools Extension (не ставить как dep — избыточно для one-pager)
- **D-02:** Ручной keyboard-пас: Tab/Shift+Tab обойти все секции, проверить что focus-ring виден на чёрном фоне везде
- **D-03:** Screen reader проверка: NVDA (Windows) или VoiceOver (Mac) — пользователь проверит вручную, план даёт чеклист
- **D-04:** Контраст проверить для phosphor glow: `text-shadow: 0 0 4px currentColor` теоретически не меняет воспринимаемый контраст текста, но на фоне размытия может восприниматься хуже. Проверяем DevTools Accessibility > Contrast.

## WCAG 2.3.1 audit (flash threshold)

- **D-05:** Перечислить все анимации и их частоты:
  - scanline-drift: 2 Hz (0.5s period) ✅
  - cursor blink: 1 Hz (1s period) ✅
  - BootSequence fadeIn: 0.15s forwards (not repeating) ✅
  - TypedText: 40ms/char (not a flash) ✅
- Все под порогом 3/s. **Документируем** это явно в SUMMARY для будущих фаз.

## Reduced-motion coverage audit

- **D-06:** Чеклист: все анимации должны либо иметь `@media (prefers-reduced-motion: reduce)` правило в CSS, либо использовать хук `useReducedMotion` в TS:
  - scanline-drift → CSS ✅
  - cursor blink → CSS ✅
  - TypedText → хук ✅
  - WebAppPreview autoplay → хук ✅
  - BootSequence → `useBootShown` пропускает при reduced ✅
  - Global reset (`animation-duration: 0.001ms !important`) → CSS ✅

Всё покрыто. Плана только checklist-верификация, не дев.

## Performance — honest constraints

- **D-07:** React 19 + react-dom даёт ~60-64 KB gzip базой. Наш код добавляет ~2-3 KB. Уложиться в 50 KB **невозможно без свитча на Preact** (preact+preact-compat ≈ 10 KB gzip) или удаления React.

### Варианты:
  - **(A) Принять 66 KB как реалистичный бюджет для одностраничного React SPA** — документировать как решение, поднять бюджет требования до 70 KB. Проблем с perf scoring Lighthouse не будет (JS блокинг малый, FCP быстрый).
  - **(B) Мигрировать на Preact 10.x через `preact/compat` alias в vite.config** — ~55 KB gzip экономии, но: (i) риск несовместимости с @fontsource (CSS only, должен работать), (ii) React 19 features (use, new hooks) недоступны — у нас их нет, безопасно.
  - **(C) Переписать без фреймворка** — слишком радикально для этой фазы.
- **D-08:** **Решение: (A)** — принимаем 70 KB gzip как бюджет, т.к.:
  1. Сайт визуально простой, bottleneck — шрифт и видео (когда добавятся), а не JS
  2. Preact migration добавляет риск для одного числа в Lighthouse
  3. Real-world метрика LCP < 1.5s достижима и с React 19
- **D-09:** Обновить REQUIREMENTS.md PERF-01 на `JS bundle < 70 KB gzip` (после фазы). В SUMMARY зафиксировать решение с опцией вернуться к Preact в v2 если нужно.

## Performance — доступные оптимизации

- **D-10:** Удалить `vietnamese` и `latin-ext` subset'ы VT323 если не нужны. Проверяем контент: только латиница + кириллица. Latin достаточно. Latin-ext содержит диакритику (ā, ē и т.д.) — на сайте нет. Vietnamese — точно нет. Экономия: 7.93 + 16.37 = ~24 KB на first load (хотя эти subset'ы lazy по unicode-range, **не** считаются в initial JS bundle). **Решение**: import'им явно только latin subset через `@fontsource/vt323/400.css` → вместо дефолтного `@fontsource/vt323`.
- **D-11:** Но у нас есть **кириллица** в контенте (About, Contact, chatScripts). VT323 latin subset кириллицу НЕ поддерживает. Нужен cyrillic subset OR другой моно-шрифт для кириллицы. Проверить: есть ли `@fontsource/vt323/cyrillic.css`? Если нет — fallback на Courier New для кириллицы (визуально допустимо, хотя CRT-эффект на Courier не такой).
- **D-12:** Preload font: `<link rel="preload" as="font" type="font/woff2">` в index.html для latin subset — ускоряет FCP.
- **D-13:** Preconnect к github/t.me удаляем (пока не надо, редко кликают; preconnect стоит места в HTML).
- **D-14:** Добавить `<meta name="description">` — влияет на SEO, но это скорее Phase 7. Здесь не трогаем.

## CLS audit

- **D-15:** Все медиа:
  - `<img poster>` в WebAppPreview — aspect-ratio: 8/5 резервирует ✅
  - `<video poster>` — тот же aspect-ratio ✅
  - Кириллица в font — при загрузке шрифта происходит swap, что может дать микро-shift. Использовать `size-adjust` в `@font-face` для минимизации. Но VT323 моно-шрифт metrics почти совпадают с Courier New — shift незаметный.
- **D-16:** **Решение:** Добавить `size-adjust: 100%` / или проверить Lighthouse CLS метрику. Если > 0 — подкрутить.

## Lighthouse targets (после фазы)

- Performance ≥ 90 (mobile, simulated 3G)
- Accessibility = 100
- Best Practices ≥ 95
- SEO — не цель этой фазы (Phase 7)

## Claude's Discretion

- Точный список subset'ов которые оставить (latin + cyrillic если есть)
- Порядок preload тегов в index.html
</decisions>

<specifics>
## Specific Ideas

Не превращаем фазу в гонку за 100 Lighthouse. Цель — безопасно и честно убрать нижние висячие плоды (шрифт-субсеттинг, preload) и задокументировать реальность JS бюджета (React база). Не ставим Preact migration.

</specifics>

<canonical_refs>
- `.planning/REQUIREMENTS.md` — A11Y-01..07, PERF-01..05
- `.planning/research/PITFALLS.md` §Accessibility, §Performance
- `src/styles/globals.css` — глобальный reset для reduced-motion
</canonical_refs>

<success_signals>
1. DevTools Lighthouse mobile run даёт Accessibility = 100, Performance ≥ 90
2. Axe DevTools run — 0 critical/serious issues
3. Keyboard-only прохождение всех секций без visible-traps, focus-ring везде виден
4. Bundle JS (gzip) ≤ 70 KB (обновлённый бюджет); CSS ≤ 15 KB; CLS = 0 в DevTools Performance
5. Русский текст (About, Contact, chatScripts) корректно рендерится (Courier New fallback — допустим)
6. Документированы все анимации с их частотами и подтверждением WCAG 2.3.1
</success_signals>

---
*Context captured: 2026-04-15*
