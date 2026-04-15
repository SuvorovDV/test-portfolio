---
phase: 03-content-sections
plan: 01
status: completed
date: 2026-04-15
---

# Plan 03-01: TerminalPrompt — Summary

## Outcome

✅ 3 задачи выполнены. Навбар из Phase 1 заменён на `<TerminalPrompt>` с форматом `guest@portfolio:~$ cd about | cd projects | cd contact`.

## Key details

- useActiveSection перенесён из App в TerminalPrompt (уменьшает re-render App при скролле)
- Separators `|` и `user@host` имеют `aria-hidden="true"` — screen reader читает только команды
- Активная команда инвертирована + `<Cursor />` рядом
- На < 480px `user@portfolio` прячется, остаётся `~$` через `::before`
- globals.css очищен от устаревших `nav[aria-label='Primary']` правил

## Verification

| Check | Result |
|-------|--------|
| typecheck | ✅ |
| lint | ✅ |
| build | ✅ |

## Ready for

Plan 03-02 (контент + TypedText + CopyButton).
