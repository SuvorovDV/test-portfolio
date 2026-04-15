# Phase 3: Content Sections — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Наполнить About и Contact реальным контентом; заменить базовый навбар на `<TerminalPrompt>` с терминальной эстетикой (`user@portfolio:~$ cd <section>`); добавить typewriter-эффект на заголовок About; обеспечить работающий copy-to-clipboard для email и обфускацию от базовых скраперов. ProjectsSection пока остаётся плейсхолдером — это Phase 4.

</domain>

<decisions>
## Owner content (locked)

- **D-01:** Имя владельца: **Suvorov Denis**
- **D-02:** Роль: **Full-stack developer**
- **D-03:** Стек (основной): **Python, JavaScript/TypeScript, aiogram** (для TG-ботов)
- **D-04:** Email: **erkodoto@gmail.com** (из git config)
- **D-05:** Telegram: **@Suvorovdv** (tg://resolve?domain=Suvorovdv)
- **D-06:** GitHub: **github.com/erkob** (handle `erkob` по git username — **ВАЖНО**: владелец подтвердил в предыдущем вопросе; если handle отличается, поправим в SUMMARY)

## About content

- **D-07:** Формат заголовка: `$ cat about.txt` (prompt-style) — или `about` как раньше? Решено: **оставить `about`** как раньше для h2 (консистентность с навбаром `cd about`), но внутри body — небольшой prompt-like блок.
- **D-08:** Контент (русский, 3-4 строки):
  ```
  > Suvorov Denis
  > full-stack developer
  > python · javascript/typescript · aiogram
  > building web apps and telegram bots
  ```
- **D-09:** TypedText — typewriter-анимация на ПЕРВОЙ строке контента (имя), не на h2. `h2` статичный чтобы не блокировать чтение скринридерами. Скорость ~40мс/символ, курсор в конце анимации.
- **D-10:** При `prefers-reduced-motion: reduce` TypedText показывает полный текст сразу (без анимации).

## Contact content

- **D-11:** Формат списка — как команды в man-странице:
  ```
  email    erkodoto@gmail.com   [copy]
  telegram @Suvorovdv           [open]
  github   github.com/erkob     [open]
  ```
  Три ряда с табличным выравниванием через `display: grid; grid-template-columns: 10ch 1fr auto`.
- **D-12:** Email обфускация: **не** показывать plain-text в HTML, а собирать строку из data-attributes JS-ом при рендере (простой split `erkodoto` + `@` + `gmail.com`). Достаточно от базовых regex-скраперов, не от целевых.
- **D-13:** Copy-to-clipboard: `navigator.clipboard.writeText(email)`, после копирования на 2с сменить label с `[copy]` на `[copied]`.
- **D-14:** Telegram link: `tg://resolve?domain=Suvorovdv` — открывает приложение Telegram напрямую; в `href` также дубль `https://t.me/Suvorovdv` для клиентов без tg://. Решено: **использовать `https://t.me/Suvorovdv`** (работает везде и редиректит в tg:// если установлен).
- **D-15:** GitHub link: `https://github.com/erkob` (внешняя).

## TerminalPrompt (navbar)

- **D-16:** Вместо `cd about | cd projects | cd contact` (текущий навбар из Phase 1) — полноценный `<TerminalPrompt>` в формате `guest@portfolio:~$ cd about` / `cd projects` / `cd contact`
- **D-17:** Три ссылки остаются `<a href="#...">`, но visual — prompt-like. Активная подсвечивается инверсией цвета (работа из Phase 2 `aria-current` стиля остаётся).
- **D-18:** Разделитель между ссылками — пробел + `|` (visual), не `,`.
- **D-19:** При очень узких экранах (< 480px) prompt сокращается до `~$ cd <section>` (без user@host). Реализация через @media query.
- **D-20:** Курсор `<Cursor />` рядом с активной командой — визуальный hint «здесь мы сейчас».

## Architecture

- **D-21:** `<TerminalPrompt>` — новый компонент в `src/components/TerminalPrompt.tsx`
- **D-22:** `<TypedText>` — новый компонент в `src/components/TypedText.tsx`, принимает `text`, `speed`, опционально `onComplete`
- **D-23:** `<CopyButton>` — маленький inline компонент с `navigator.clipboard` логикой
- **D-24:** Обфускация email — в `src/hooks/useDeobfuscatedEmail.ts` или inline в ContactSection (одноразовое использование, инлайн проще)

## Claude's Discretion

- Точный текст About body (в пределах D-08)
- Цвета для `[copy]` / `[copied]` hover
- Анимация подсветки активной команды в prompt

</decisions>

<specifics>
## Specific Ideas

Хотим чтобы страница выглядела «по-человечески честно» — не маркетинговый лендинг, а как файл в терминале. Никаких «Hi, I'm Denis 👋» или «Crafting beautiful experiences ✨».

</specifics>

<canonical_refs>
- `.planning/PROJECT.md` — анти-генерик
- `.planning/REQUIREMENTS.md` — CONT-01, CONT-02, CONT-04, CONT-05
- `.planning/research/FEATURES.md` §Contact patterns, §Differentiators (терминальная нав)
- `.planning/research/PITFALLS.md` §Content (обфускация email), §Aesthetic (иконки — не Lucide, а ASCII/Unicode)

## Built so far

- `<Cursor>` из Phase 2 — можно встраивать в TerminalPrompt и TypedText
- `useReducedMotion` из Phase 1 — обязателен в TypedText
- `useActiveSection` — уже используется навбаром (переедет в TerminalPrompt)

</canonical_refs>

<code_context>
### Gotchas Already Known

- `navigator.clipboard` требует secure context (https / localhost) — в dev (localhost) работает, в build на http:// НЕ работает; GH Pages всегда https, ок
- `tg://` protocol handler: если Telegram не установлен, браузер падает в `about:blank` на мобилках → использовать `https://t.me/<name>` (работает везде)
- TypedText с `setInterval` в StrictMode: эффект запускается дважды в dev — нужен cleanup с флагом mount-state; или использовать `useLayoutEffect`+`cancel` паттерн
- Копирование через `document.execCommand('copy')` устарело; `navigator.clipboard` — единственный актуальный путь (fallback не требуется для evergreen-only аудитории)

</code_context>

<success_signals>
1. About показывает имя/роль/стек в terminal-стиле, первая строка печатается typewriter-ом
2. Contact содержит три ряда с выровненными «командами», email копируется по клику
3. Навбар стал `guest@portfolio:~$ cd about | cd projects | cd contact`, активная команда подсвечивается + курсор рядом
4. `prefers-reduced-motion: reduce` → typewriter показывает текст мгновенно
5. Screen reader правильно читает всё содержимое (TypedText не ломает SR-чтение)
</success_signals>

---
*Context captured: 2026-04-15*
