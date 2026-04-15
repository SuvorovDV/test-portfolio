# Phase 1: Foundation — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Поднять скелет Vite + React 19 + TypeScript strict проекта с ESLint flat config + Prettier, создать директорную структуру, настроить hash-навигацию между тремя якорными секциями (About/Projects/Contact). Никакой CRT-стилизации, никакого контента — только каркас, на который ляжет Phase 2 (theming) и далее.

</domain>

<decisions>
## Implementation Decisions

### Stack (locked by project-level STACK.md research)
- **D-01:** Vite 6.x (последняя стабильная на апрель 2026), React 19.x, TypeScript 5.7+
- **D-02:** `tsconfig.json` — `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `exactOptionalPropertyTypes: true`
- **D-03:** ESLint flat config (`eslint.config.js`), без `.eslintrc`. Плагины: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **D-04:** Prettier с дефолтами + `singleQuote: true`, `semi: true`, `printWidth: 100`

### Directory Structure
- **D-05:** Flat `src/{components, sections, hooks, data, styles, types}` — подтверждено в ARCHITECTURE.md
- **D-06:** `index.html` в корне, `src/main.tsx` → `src/App.tsx` → секции

### Navigation
- **D-07:** Hash-based (`#about`, `#projects`, `#contact`) — без react-router (это было бы overkill для одностраничника)
- **D-08:** `useActiveSection()` хук на `IntersectionObserver` (rootMargin `-40% 0%`), одна подписка, живёт в App-root
- **D-09:** `scrollIntoView({ behavior: 'smooth' })` при клике по якорю; `prefers-reduced-motion: reduce` → `behavior: 'auto'`
- **D-10:** `popstate` handler синхронизирует URL hash → scroll (работа back/forward)

### Tooling
- **D-11:** npm (не pnpm/yarn) — минимум когнитивной нагрузки для персонального проекта
- **D-12:** Скрипты package.json: `dev`, `build`, `preview`, `lint`, `typecheck`, `format`

### Claude's Discretion
- Точные версии dev-зависимостей (в пределах major, указанных в STACK.md)
- Формат ESLint `ignores` (можно через `eslint.config.js` или `.eslintignore`)
- Имена переменных в коде шаблонных компонентов

</decisions>

<specifics>
## Specific Ideas

Ни CRT-стилей, ни шрифтов, ни контента — строго каркас. App.tsx может рендерить placeholder'ы вроде `<h1>About</h1>` / `<h1>Projects</h1>` / `<h1>Contact</h1>` на дефолтных браузерных стилях. Phase 2 перепишет стили полностью.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — constraints, анти-референсы, key decisions
- `.planning/REQUIREMENTS.md` §Foundation — FOUND-01..05
- `.planning/ROADMAP.md` §Phase 1 — success criteria и план-разбивка

### Research
- `.planning/research/STACK.md` — версии пакетов, vite.config pattern, ESLint flat config пример, GitHub Pages base path
- `.planning/research/ARCHITECTURE.md` — директорная структура, useActiveSection паттерн, browser support
- `.planning/research/PITFALLS.md` §GH Pages deploy — base path pitfalls (важно уже сейчас для vite.config)

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield — кода нет. Только `.claude/`, `.planning/`, `.git/`.

### Reusable Assets
Нет.

### Gotchas Already Known
- Case-sensitivity на Linux в CI — следим за именованием файлов (`ProjectCard.tsx`, не смешиваем с `projectCard.tsx`)
- CRLF на Windows — `.gitattributes` с `* text=auto eol=lf` желательно добавить в этой же фазе

</code_context>

<success_signals>
## Phase Success Signals

1. `npm run dev` открывает страницу, три секции видны (пусть уродливыми)
2. `npm run build` создаёт `dist/` без ошибок
3. `npm run lint` и `npm run typecheck` зелёные
4. Клик по ссылке на #about скроллит; back/forward работает; URL hash обновляется
5. Структура `src/{components, sections, hooks, data, styles, types}` существует (может быть с `.gitkeep` в пустых папках)

</success_signals>

---
*Context captured: 2026-04-15*
