# Requirements: test-portfolio

**Defined:** 2026-04-15
**Core Value:** Посетитель за 10 секунд понимает «кто это» и видит живые превью проектов, при этом сайт выглядит как намеренный художественный выбор, а не шаблон.

## v1 Requirements

Требования MVP. Каждое мапится на фазу в ROADMAP.md.

### Foundation

- [ ] **FOUND-01**: Vite + React 19 + TypeScript strict проект собирается и запускается (`npm run dev` / `npm run build`)
- [ ] **FOUND-02**: ESLint flat config + Prettier настроены, `npm run lint` зелёный
- [ ] **FOUND-03**: TypeScript strict — `strict: true`, `noUncheckedIndexedAccess: true`
- [ ] **FOUND-04**: Директорная структура `src/{components, sections, data, hooks, styles}` создана
- [ ] **FOUND-05**: Одностраничная навигация через hash-якоря `#about`/`#projects`/`#contact` работает (back/forward браузера корректно отрабатывает)

### CRT Theming

- [ ] **THEME-01**: Глобальный CRT-shell с чёрным фоном и фосфорно-зелёным моно-шрифтом (VT323, self-hosted, `font-display: swap`)
- [ ] **THEME-02**: Scanlines overlay реализован CSS-градиентом (не GIF), `pointer-events: none`, `aria-hidden`
- [ ] **THEME-03**: Фосфорное свечение на заголовках через `text-shadow`, с более слабой версией для body
- [ ] **THEME-04**: Блочный мигающий курсор как повторно используемый компонент `<Cursor>`
- [ ] **THEME-05**: CSS custom properties (`--phosphor`, `--bg`, `--scanline-opacity`) — палитра легко сменяема на амбер
- [ ] **THEME-06**: CRT-curvature через `box-shadow` + `border-radius` на shell (не SVG-фильтр)
- [ ] **THEME-07**: Вся анимация (мерцание, scanline-drift, курсор, typewriter) отключается при `prefers-reduced-motion: reduce`

### Content Sections

- [ ] **CONT-01**: Секция **About** — имя владельца, роль, стек, 2-4 предложения в стиле `cat about.txt`
- [ ] **CONT-02**: Секция **About** содержит typewriter-эффект на заголовке (opt-in через prefers-reduced-motion)
- [ ] **CONT-03**: Секция **Projects** рендерит список из `src/data/projects.ts` (минимум 4 записи-заглушки: 2 web + 2 telegram)
- [ ] **CONT-04**: Секция **Contact** — email (с простой обфускацией от скраперов), Telegram (`tg://`), GitHub (ссылка)
- [ ] **CONT-05**: Фиксированный «TerminalPrompt»-навбар с пунктами `cd about | cd projects | cd contact`, подсвечивает активную секцию (IntersectionObserver)

### Project Showcase

- [ ] **SHOW-01**: TypeScript-тип `Project` — discriminated union `{ type: 'web', screenshot|videoSrc, liveUrl, repoUrl } | { type: 'telegram', chatScript, botUsername, botUrl, repoUrl }`
- [ ] **SHOW-02**: `<ProjectCard>` — общий контейнер с ASCII-бордером, слотом для медиа, title, stack-chips, year, ссылками
- [ ] **SHOW-03**: `<WebAppPreview>` — показывает `<video muted loop playsinline>` с `preload="none"`, запускает воспроизведение при попадании в viewport (IntersectionObserver); fallback — статичный скриншот
- [ ] **SHOW-04**: `<TelegramChatPreview>` — статичный React-компонент, стилизованный под Telegram-диалог: аватар бота, username в формате `@name_bot`, сообщения пользователя/бота с timestamp, reply keyboard mock; содержит affordance «preview — не живой бот»
- [ ] **SHOW-05**: Каждая карточка имеет CTA «Open in Telegram» / «Live demo» / «Repo» в зависимости от типа

### Boot Sequence (Differentiator)

- [ ] **BOOT-01**: При первом визите проигрывается boot-sequence (имитация загрузки BIOS/DOS), не дольше 3s
- [ ] **BOOT-02**: Boot skippable — Esc, любая клавиша, клик; автоматически финализируется через 3s
- [ ] **BOOT-03**: Пропуск/завершение запоминается в localStorage (`portfolio:boot-shown=1`), повторно не проигрывается
- [ ] **BOOT-04**: При `prefers-reduced-motion: reduce` boot сокращается до одного кадра/текста-плейсхолдера
- [ ] **BOOT-05**: По завершении boot-а focus переходит на `<main>`; boot не перехватывает фокус от скринридеров (`role="status"`, aria-live polite)

### Accessibility & Performance

- [ ] **A11Y-01**: Контраст базового текста на фоне ≥ 7:1 (AAA) даже с phosphor glow (проверить DevTools/axe)
- [ ] **A11Y-02**: Все интерактивные элементы имеют видимый кастомный focus-ring (не стандартный, но заметный на чёрном)
- [ ] **A11Y-03**: Keyboard-only навигация — Tab/Shift+Tab по всему интерфейсу, якорные ссылки работают, порядок логичный
- [ ] **A11Y-04**: Фликкер не превышает WCAG 2.3.1 (не более 3 вспышек в секунду)
- [ ] **A11Y-05**: Семантическая разметка — `<main>`, `<section aria-labelledby>`, заголовки по порядку (`<h1>` один, `<h2>` для секций)
- [ ] **A11Y-06**: Telegram-mockup содержит полный текст диалога в DOM (не только картинка), screen reader читает
- [ ] **A11Y-07**: `<video>` на карточках имеет `<track kind="descriptions">` или рядом — текстовое описание того, что в видео
- [ ] **PERF-01**: JS bundle < 50 KB gzipped (production)
- [ ] **PERF-02**: CSS < 15 KB gzipped
- [ ] **PERF-03**: Lighthouse Performance ≥ 90 на mobile, Accessibility = 100
- [ ] **PERF-04**: LCP < 1.5s на имитированном 3G
- [ ] **PERF-05**: CLS = 0 (все размеры медиа зарезервированы)

### Deploy & SEO

- [ ] **DEPLOY-01**: `vite.config.ts` имеет корректный `base: '/<repo-name>/'` для GH Pages
- [ ] **DEPLOY-02**: GitHub Actions workflow (`peaceiris/actions-gh-pages` или аналог) деплоит `dist/` в ветку `gh-pages` при push в `main`
- [ ] **DEPLOY-03**: `.nojekyll` присутствует в output (иначе `_`-префиксные файлы 404)
- [ ] **DEPLOY-04**: `index.html` содержит `<title>`, `<meta name="description">`, OpenGraph (`og:title`, `og:description`, `og:image`), Twitter Card
- [ ] **DEPLOY-05**: Кастомная OG-картинка сгенерирована в CRT-эстетике (1200×630, PNG)
- [ ] **DEPLOY-06**: Favicon — ASCII/пиксельный (не шаблонный Vite логотип)
- [ ] **DEPLOY-07**: После деплоя сайт открывается на `https://<user>.github.io/<repo>/` без 404 на ассеты, работают все три секции

## v2 Requirements

Отложено в беклог. Не в первом релизе.

### Interactive Terminal (Differentiator Upgrade)

- **TERM-01**: Живая CLI — `help`, `ls`, `cat about.txt`, `cd projects`, `open <project>` с реальным роутингом
- **TERM-02**: Автокомплит по Tab и история по стрелкам вверх/вниз
- **TERM-03**: Easter egg команды (`whoami`, `uname -a`, `fortune`)

### Content Expansion

- **EXT-01**: Страница/секция Case Study для отдельного проекта (разворачиваемая из карточки)
- **EXT-02**: Поддержка CV/Resume PDF — кнопка-ссылка
- **EXT-03**: Тема-переключатель между phosphor green и amber (архитектура уже готова через CSS vars)

### SEO Automation

- **SEO-01**: Автогенерация OG-картинки в CI из шаблона при каждом проекте
- **SEO-02**: sitemap.xml + robots.txt

## Out of Scope

| Feature | Reason |
|---------|--------|
| Бэкенд / форма обратной связи | Статический сайт; email/tg-ссылки достаточно |
| CMS / headless content | 4 проекта — TS-конфиг достаточен |
| i18n / мультиязычность | Только RU на старте; добавить при реальной нужде |
| Авторизация / админка | Статический сайт |
| Живые iframe TG-ботов | Telegram не поддерживает embedding |
| Next.js / Astro / SSR | Пользователь явно выбрал Vite+React |
| Light-тема | CRT-эстетика несовместима |
| Блог / markdown-посты | Scope creep |
| Testimonials row | На персональном портфолио выглядит наигранно |
| "✨ Introducing" badges, feature-grid с эмодзи, pricing cards, gradient-blob hero, bento grid, glowing orb | Generic AI-паттерны (анти-референсы в CLAUDE.md §6) |
| Lucide / Heroicons line-иконки | Не соответствуют эпохе CRT; используем ASCII/Unicode box-drawing |
| Sans-serif body шрифт | Ломает иллюзию терминала; моно везде |
| Parallax, mouse-chaser, анимированные градиенты | Generic AI-паттерн |
| Newsletter / email signup | Нет аудитории на старте |
| Hero stats (X проектов / Y лет) с 4 проектами | Фальшивая масштабность |
| Автоплей `<video>` со звуком | UX-проблема на mobile |
| Тесты для статического one-pager | Премейч-оптимизация; визуальная проверка достаточна до деплоя |
| Live Telegram bot iframe | Платформа не поддерживает |

## Traceability

Маппинг требований на фазы (заполняется при создании ROADMAP.md).

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01..05 | Phase 1 | Pending |
| THEME-01..07 | Phase 2 | Pending |
| CONT-01..05 | Phase 3 | Pending |
| SHOW-01..05 | Phase 4 | Pending |
| BOOT-01..05 | Phase 5 | Pending |
| A11Y-01..07, PERF-01..05 | Phase 6 | Pending |
| DEPLOY-01..07 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initialization*
