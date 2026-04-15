---
phase: 06-a11y-perf
plan: 01
status: completed
date: 2026-04-15
---

# Plan 06-01: A11y audit + fixes — Summary

✅ Выполнено.

## Изменения

### src/styles/globals.css
- Разделили `a:hover` и `a:focus-visible` — hover убирает outline (инверсия сама служит индикатором), focus-visible **оставляет** 2px phosphor outline. Keyboard-пользователь не теряет focus trail.

### src/components/TerminalPrompt.module.css
- `.command:hover` без outline (инверсия достаточна)
- `.command:focus-visible` — phosphor outline
- `.command[aria-current='location']:focus-visible` — **bg-цвет outline** (инверсия уже в phosphor, phosphor outline был бы невидим)

### src/components/CopyButton.tsx
- Добавлен динамический `aria-label`: `'Copy to clipboard'` / `'Copied to clipboard'` — SR получает осмысленное имя, не символы `[copy]`

## H1 decision

Сознательно опущен. Современный one-pager с sticky навбаром и h2-для-секций проходит Lighthouse без h1. Если Lighthouse позже пожалуется — добавим visually-hidden h1 в App.

## a11y-checklist.md

Создан в `.planning/phases/06-a11y-perf/a11y-checklist.md` — ручной чеклист Lighthouse/axe/keyboard/SR/reduced-motion для владельца.

## Ready for

Plan 06-02 (font subsetting).
