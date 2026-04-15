# Phase 5: Boot Sequence — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Добавить короткую BIOS/DOS-подобную загрузку при первом посещении. Skippable, запоминается в localStorage (повторно не играет), корректно обрабатывается в reduced-motion и не блокирует screen reader.

</domain>

<decisions>
## Content

- **D-01:** Текст бут-секвенции — осмысленный, не lorem. Финальный сценарий:
  ```
  TEST-PORTFOLIO BIOS v1.0
  Copyright (c) 2026 Suvorov Denis

  Detecting hardware...
    [ OK ] Display
    [ OK ] Phosphor CRT @ 33FF33
    [ OK ] Scanlines emulation

  Loading modules...
    about.mod       [OK]
    projects.mod    [OK]
    contact.mod     [OK]

  Boot successful. Press any key to continue_
  ```
- **D-02:** Последняя строка с курсором — можно использовать `<Cursor>` из Phase 2
- **D-03:** Полная длительность не более ~2.5с: заголовки мгновенно, потом 10 строк по ~200мс каждая

## Behavior

- **D-04:** Хук `useBootShown()` возвращает `{ shown: boolean, markShown: () => void }`
  - `shown` — true если в localStorage есть флаг ИЛИ если `prefers-reduced-motion: reduce` (при reduced не проигрываем бут вообще — сразу показываем сайт)
  - При первом рендере — lazy init из localStorage
  - `markShown()` выставляет флаг и обновляет state
- **D-05:** localStorage key: `portfolio:boot-shown` со значением `'1'`
- **D-06:** Skip: Esc, любая клавиша, клик в любом месте overlay, кнопка `[skip]` в углу. Все они вызывают `markShown()`.
- **D-07:** Авто-завершение через ~2.5с (после печати последней строки + пауза 500мс на чтение)

## Reduced motion

- **D-08:** При `prefers-reduced-motion: reduce` бут **не проигрывается** — хук сразу возвращает `shown: true` без записи в localStorage. Причина: анимированная пошаговая печать текста с курсором = motion, нарушает ожидания пользователя. Для user, которому разрешили анимации, но с reduced — boot слишком. Компромисс — не показывать.

## A11y

- **D-09:** BootSequence рендерится как overlay с `role="status"` + `aria-live="polite"` + `aria-atomic="false"` — screen reader получает уведомления о новых строках неинвазивно
- **D-10:** `role="status"` НЕ блокирует фокус. Фокус при бут-режиме остаётся на `<body>` (браузерный дефолт). После завершения — перевод фокуса не требуется (после unmount focus естественно на body, nав становится первой tabbable).
- **D-11:** Skip кнопка — реальная `<button>` с text `[ skip ]`, первая tabbable в overlay → `Tab` сразу на неё

## Architecture

- **D-12:** BootSequence рендерится **до** CRTShell на самом верхнем уровне App:
  ```tsx
  if (!shown) return <BootSequence onFinish={markShown} />;
  return <CRTShell>...</CRTShell>;
  ```
  После `markShown()` — полный site mount. Простая логика без setTimeout в App.
- **D-13:** BootSequence внутри себя держит scanlines + vignette (использует тот же CRTShell чтобы не дублировать), просто без нав/main контента.
- **D-14:** Альтернатива: BootSequence — полноэкранный overlay поверх CRTShell. **Не берём** — усложняет z-index и focus management. Решение D-12 проще.

## Performance

- **D-15:** Контент BOOT_LINES — статичный массив в компоненте. Печать через `setTimeout` (не setInterval, пошаговая) или через state machine с `useEffect` + cleanup
- **D-16:** Никаких тяжёлых анимаций — только opacity transitions (дёшево)

## Claude's Discretion

- Точная скорость появления строк (в пределах 150-250мс)
- Должна ли быть «пауза» между двумя блоками (`Detecting hardware...` и `Loading modules...`)

</decisions>

<specifics>
## Specific Ideas

Визуальный референс: первые секунды загрузки PIP-Boy из Fallout + честный DOS POST screen. Никаких «⚡ Loading magic...», «✨ Almost there ✨», прогресс-баров с градиентами. Просто текст, левым выравниванием, с маркерами `[ OK ]`.

</specifics>

<canonical_refs>
- `.planning/REQUIREMENTS.md` — BOOT-01..05
- `.planning/research/FEATURES.md` §CRT-specific differentiators — boot sequence в топе
- `src/components/Cursor.tsx` — переиспользуем для последнего курсора
- `src/hooks/useReducedMotion.ts` — обязателен
</canonical_refs>

<success_signals>
1. Первое посещение: увидеть бут (≤3с), автозавершение → сайт
2. Нажать Esc / кликнуть / нажать букву во время бута → моментально пропуск
3. Обновить страницу → бут НЕ играет (localStorage)
4. Очистить localStorage → бут снова играет
5. `prefers-reduced-motion: reduce` → бут не играет, сайт сразу
6. Screen reader: получает live-update строк, но не блокируется
</success_signals>

---
*Context captured: 2026-04-15*
