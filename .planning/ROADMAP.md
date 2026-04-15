# Roadmap: test-portfolio

## Overview

От пустой директории до задеплоенного на GitHub Pages CRT-портфолио с тремя секциями и 4 карточками проектов. Сначала поднимаем скелет Vite+React+TS, затем накрываем CRT-слой (scanlines/phosphor/cursor), наполняем секции About/Contact, делаем галерею проектов с превью (веб-видео + TG-чат-мокап), добавляем boot-sequence как киллер-фичу, прогоняем A11y/perf аудит, деплоим. 7 фаз, standard granularity, параллельное выполнение планов внутри фаз там, где возможно.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** — Vite+React+TS скелет, линтер, структура папок, hash-навигация
- [x] **Phase 2: CRT Theming** — глобальный shell, scanlines, phosphor, typography, курсор, reduced-motion
- [x] **Phase 3: Content Sections** — About и Contact с финальным текстом; TerminalPrompt-навбар
- [x] **Phase 4: Project Showcase** — типы Project, ProjectCard, WebAppPreview, TelegramChatPreview, 4 заглушки
- [x] **Phase 5: Boot Sequence** — первое-посещение анимация, localStorage, skippable
- [x] **Phase 6: A11y & Performance Pass** — WCAG AAA-контраст, focus-ring, Lighthouse ≥90, perf-бюджет
- [x] **Phase 7: Deploy** — vite base, GH Actions workflow, OG/favicon/SEO, первый публичный урл

## Phase Details

### Phase 1: Foundation
**Goal**: Проект запускается локально и проходит линтер; навигация между тремя якорями работает; есть заготовка главного компонента.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. `npm run dev` открывает пустую страницу с тремя якорными секциями, `npm run build` создаёт `dist/`
  2. `npm run lint` зелёный; TypeScript strict включён и компилируется
  3. Клик по `#about`/`#projects`/`#contact` скроллит и меняет URL; кнопки back/forward браузера работают
**Plans**: 2 plans

Plans:
- [ ] 01-01: Bootstrap Vite+React+TS, директорная структура, `tsconfig.json` strict, ESLint+Prettier flat config
- [ ] 01-02: Базовый App-shell с тремя `<section id>`, хук `useActiveSection` на IntersectionObserver, hash-навигация

### Phase 2: CRT Theming
**Goal**: Сайт визуально читается как CRT-терминал: фосфорно-зелёный моно на чёрном, scanlines, курсор мигает, эффекты корректно отключаются при reduced-motion.
**Depends on**: Phase 1
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, THEME-06, THEME-07
**Success Criteria** (what must be TRUE):
  1. Любая страница выглядит как CRT-терминал — без белого фона и санс-серифа даже на 1 кадр
  2. При `prefers-reduced-motion: reduce` отсутствуют flicker, scanline-drift, мерцание курсора — но внешний вид остаётся CRT
  3. Смена CSS-переменной `--phosphor` в DevTools переключает палитру на амбер без регрессий
**Plans**: 3 plans

Plans:
- [ ] 02-01: Self-hosted VT323 (woff2), `@font-face` с `font-display: swap`, CSS custom properties для палитры
- [ ] 02-02: `<CRTShell>` компонент — scanlines overlay (CSS-градиент), curvature через `box-shadow` + `border-radius`, vignette
- [ ] 02-03: `<Cursor>`, phosphor `text-shadow` на заголовках, `useReducedMotion()` хук и подключение ко всем анимациям

### Phase 3: Content Sections
**Goal**: Посетитель видит осмысленный контент в About и Contact; навбар с командами `cd about / cd projects / cd contact` подсвечивает активную секцию.
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. About-секция содержит финальный текст (имя, роль, стек, 2-4 предложения), заголовок с typewriter-эффектом (статичный при reduced-motion)
  2. Contact-секция даёт три способа связи: email с обфускацией, `tg://` ссылку, GitHub; клик по email копирует в буфер
  3. При скролле TerminalPrompt-навбар подсвечивает текущую секцию (`cd about` → [active])
**Plans**: 2 plans

Plans:
- [ ] 03-01: `<TerminalPrompt>` навбар (sticky top), активная секция из `useActiveSection`, keyboard-доступ
- [ ] 03-02: `<AboutSection>` с `<TypedText>` заголовком; `<ContactSection>` с обфусцированным email и copy-to-clipboard

### Phase 4: Project Showcase
**Goal**: Секция Projects показывает 4 заглушки (2 веб + 2 TG), у каждой работает превью (видео автоплей при попадании в viewport / статичный TG-чат-мокап), есть ссылки.
**Depends on**: Phase 3
**Requirements**: CONT-03, SHOW-01, SHOW-02, SHOW-03, SHOW-04, SHOW-05
**Success Criteria** (what must be TRUE):
  1. `src/data/projects.ts` содержит минимум 4 записи-заглушки, TS-тип `Project` — discriminated union `web|telegram`
  2. Web-карточка: видео стартует беззвучно при появлении в viewport, стопается при уходе; есть placeholder-скриншот для fallback
  3. Telegram-карточка: читаемый React-мокап диалога (аватар, `@username_bot`, чередование сообщений, reply keyboard, timestamp), явный лейбл "preview"; "Open in Telegram" ведёт на `tg://`
**Plans**: 3 plans

Plans:
- [ ] 04-01: `Project` тип (discriminated union), `src/data/projects.ts` с 4 заглушками, `<ProjectCard>` с ASCII-бордером и слотами
- [ ] 04-02: `<WebAppPreview>` — `<video preload="none">` + IntersectionObserver play/pause, fallback-скриншот
- [ ] 04-03: `<TelegramChatPreview>` — стилизованный React-компонент диалога с timestamps, keyboards, preview-affordance

### Phase 5: Boot Sequence
**Goal**: Первый визит проигрывает короткую BIOS/DOS-подобную загрузку; повторные — нет.
**Depends on**: Phase 4
**Requirements**: BOOT-01, BOOT-02, BOOT-03, BOOT-04, BOOT-05
**Success Criteria** (what must be TRUE):
  1. При первом открытии (пустой localStorage) проигрывается boot ≤3s, затем фокус на `<main>`
  2. Esc / клик / любая клавиша пропускают boot мгновенно
  3. После первого визита localStorage-флаг стоит, повторные загрузки бут не показывают; при `prefers-reduced-motion` boot сжимается до одного кадра
**Plans**: 2 plans

Plans:
- [ ] 05-01: `<BootSequence>` компонент со стадиями текста (POST/loading), `useBootShown()` хук, localStorage, skip-хендлеры
- [ ] 05-02: Интеграция в App-root — условный рендер, `role="status"` + `aria-live="polite"`, перевод фокуса по завершении

### Phase 6: A11y & Performance Pass
**Goal**: Сайт проходит Lighthouse ≥90 Perf / 100 A11y, WCAG AAA-контраст, keyboard-only навигацию; perf-бюджеты в норме.
**Depends on**: Phase 5
**Requirements**: A11Y-01..07, PERF-01..05
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile: Performance ≥90, Accessibility = 100 (без ручных warning)
  2. Bundle-отчёт `vite build`: JS <50KB gzip, CSS <15KB gzip; CLS=0 в DevTools
  3. axe-devtools / Tab-обход: нет критикал, фокус-ring виден везде, TG-мокап читается screen reader-ом
**Plans**: 3 plans

Plans:
- [ ] 06-01: Axe-аудит, исправление контраста (phosphor glow vs читаемость), focus-ring кастомный, семантическая разметка
- [ ] 06-02: Проверка WCAG 2.3.1 (flash ≤ 3/s), `prefers-reduced-motion` покрытие всех анимаций, скринридер-проход boot/chat
- [ ] 06-03: Perf-бюджет: `vite build --analyze`, оптимизация шрифта (subsetting VT323), preload critical CSS, размеры медиа зарезервированы

### Phase 7: Deploy
**Goal**: Сайт публично доступен на GitHub Pages, все секции работают, SEO-мета и OG-картинка на месте.
**Depends on**: Phase 6
**Requirements**: DEPLOY-01..07
**Success Criteria** (what must be TRUE):
  1. `https://<user>.github.io/<repo>/` открывается, все ассеты 200, три секции работают; refresh на `#projects` не ломается
  2. Share в Telegram/Twitter показывает кастомную CRT OG-картинку и корректный заголовок/описание
  3. GitHub Actions workflow зелёный: push в `main` → автоматический деплой `dist/` в `gh-pages`
**Plans**: 2 plans

Plans:
- [ ] 07-01: `vite.config.ts` `base`, `.nojekyll`, favicon (ASCII/пиксель), OG-картинка 1200×630 в CRT-стиле, meta-теги в `index.html`
- [ ] 07-02: GitHub Actions workflow (peaceiris/actions-gh-pages), тестовый деплой, проверка публичного URL

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | ✅ Completed | 2026-04-15 |
| 2. CRT Theming | 3/3 | ✅ Completed | 2026-04-15 |
| 3. Content Sections | 2/2 | ✅ Completed | 2026-04-15 |
| 4. Project Showcase | 3/3 | ✅ Completed | 2026-04-15 |
| 5. Boot Sequence | 2/2 | ✅ Completed | 2026-04-15 |
| 6. A11y & Performance | 3/3 | ✅ Completed | 2026-04-15 |
| 7. Deploy | 2/2 | ✅ Completed | 2026-04-15 |

**Total**: 7 phases, 17 plans

---
*Roadmap created: 2026-04-15*
