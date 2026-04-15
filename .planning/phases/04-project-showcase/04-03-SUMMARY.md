---
phase: 04-project-showcase
plan: 03
status: completed
date: 2026-04-15
---

# Plan 04-03 Summary

✅ `<TelegramChatPreview>` готов и интегрирован в ProjectCard.

## Implementation notes

- Статичный React-мокап, phosphor-палитра (не Telegram-blue)
- Avatar = первая буква title (M для marketplace, T для ticket-seller)
- Inline keyboard кнопки — `<span>` с `aria-hidden`, декоративные
- `role="img"` на весь wrapper → SR читает «Dialog preview for <bot> bot»
- Footer «preview — not a live bot» — явный affordance
- **Ни одного упоминания Telegram trademark / логотипа** — только слово "bot" и username

## Phase 4 overall

Секция Projects:
- 4 карточки в grid (auto-fit, minmax(28ch, 1fr))
- 2 web с SVG placeholder (ожидают screencasts)
- 2 telegram с живыми React-мокапами диалогов

## Bundle deltas

| | Before Phase 4 | After Phase 4 |
|--|----|----|
| CSS gzip | 2.15 KB | **2.90 KB** (+0.75) |
| JS gzip | 62.93 KB | **65.50 KB** (+2.57) |

JS бюджет 50 KB по-прежнему превышен. Оптимизация — Phase 6.

## Ready for

Phase 5 — Boot Sequence.
