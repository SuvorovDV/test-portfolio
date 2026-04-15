# Phase 7: Deploy — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Финальная фаза — собрать и выкатить сайт на GitHub Pages с публичным URL. Настроить vite base path, сгенерировать кастомный favicon и OG-картинку в CRT-стиле, написать meta-теги, создать GitHub Actions workflow для автоматического деплоя при push в main.

</domain>

<decisions>
## Deploy target

- **D-01:** Репозиторий: **SuvorovDV/test-portfolio** (создаётся публичным на github.com)
- **D-02:** URL: **https://suvorovdv.github.io/test-portfolio/**
- **D-03:** Base path в vite.config: **`/test-portfolio/`**
- **D-04:** Custom domain: нет

## GitHub Actions strategy

- **D-05:** Использовать **официальные GitHub Pages actions** (actions/configure-pages, actions/upload-pages-artifact, actions/deploy-pages) — не `peaceiris/actions-gh-pages`. Официальный путь — модерн с 2022, использует Pages Environment.
- **D-06:** Workflow triggers: `push` в `main` + `workflow_dispatch` (ручной запуск)
- **D-07:** Permissions: минимум — `contents: read`, `pages: write`, `id-token: write`
- **D-08:** Concurrency: group `pages`, cancel-in-progress `false` (не отменяем идущий деплой)

## GH Pages configuration

- **D-09:** В репо Settings → Pages источник = **GitHub Actions** (не ветка gh-pages). Это требует переключения вручную после первого push — указываем в SUMMARY.
- **D-10:** `.nojekyll` — Pages Actions deploy-pages автоматически создаёт, НО для надёжности добавим файл в `public/.nojekyll` (попадёт в dist)

## Meta / SEO

- **D-11:** `<title>`: **«Suvorov Denis — full-stack developer»**
- **D-12:** `<meta name="description">`: **«Personal portfolio of Suvorov Denis — full-stack developer working with Python, TypeScript, and aiogram. Web apps and Telegram bots.»**
- **D-13:** OpenGraph: og:title, og:description, og:image, og:url, og:type=website
- **D-14:** Twitter Card: summary_large_image, twitter:title, twitter:description, twitter:image
- **D-15:** Canonical URL: `https://suvorovdv.github.io/test-portfolio/`

## OG image

- **D-16:** SVG 1200×630 в CRT-стиле — чёрный фон, phosphor-зелёный моно-текст, ASCII-подобная композиция:
  ```
  > Suvorov Denis
  > full-stack developer

   python · javascript/typescript · aiogram

  █
  ```
- **D-17:** Формат: SVG. PNG-версия — TODO владельцу (конвертер: `sharp`-cli, `resvg-js`, rsvg-convert, или онлайн). SVG работает в og:image для современных соцсетей (LinkedIn, Twitter, Discord), но Telegram и старые клиенты могут требовать PNG. Отмечено как follow-up.
- **D-18:** Путь: `public/og.svg` → в dist копируется как `/test-portfolio/og.svg`

## Favicon

- **D-19:** SVG favicon — простой CRT-like glyph, например ASCII-курсор (`▮`) или инициалы `SD` на чёрном в phosphor-green. Путь: `public/favicon.svg`.
- **D-20:** Также добавим `public/favicon.ico` как fallback для старых браузеров? **Нет** — evergreen-only, SVG favicon поддерживается везде (Safari 9+, Chrome 80+, Firefox). Не тратим на ICO.
- **D-21:** apple-touch-icon — 180×180 PNG. TODO владельцу или пропустить (большинство браузеров fallback'ят на favicon.svg). **Пропускаем** для MVP.

## Architecture

- **D-22:** Все статичные ассеты — в `public/`: favicon.svg, og.svg, .nojekyll, previews/*. Vite копирует их как-есть в dist.
- **D-23:** Meta-теги прописываются в `index.html` (единственный HTML), Vite не модифицирует их для production.

## Claude's Discretion

- Точный дизайн OG-картинки (в пределах D-16 текста)
- Favicon: инициалы или курсор-символ — выбор визуала

</decisions>

<specifics>
## Specific Ideas

Финальный URL должен открываться без 404 на ассеты. Все три якорные секции (about/projects/contact) должны работать при refresh на подпути (например `/test-portfolio/#projects` — hash не требует fallback, но проверяем).

</specifics>

<canonical_refs>
- `.planning/REQUIREMENTS.md` — DEPLOY-01..07
- `.planning/research/STACK.md` §Build/Deploy — GH Actions шаблон
- `.planning/research/PITFALLS.md` §GitHub Pages deploy — base path, .nojekyll, case sensitivity

## Follow-ups after deploy

- Ручная верификация Lighthouse/axe по a11y-checklist.md на PROD URL (это точнее чем localhost)
- Конвертировать og.svg → og.png (1200×630) если соцсети не едят SVG
- Добавить реальные screencasts в public/previews/ (web-превью)
- Уточнить описания tezis и frontend-seven в src/data/projects.ts
</canonical_refs>

<success_signals>
1. `git push origin main` → GitHub Actions прогоняет workflow → деплой успешен
2. `https://suvorovdv.github.io/test-portfolio/` открывается, все 4 проекта видны, клики работают
3. Refresh на любой точке сайта — не даёт 404
4. Share URL в Telegram/Twitter показывает OG-карточку с CRT-дизайном
5. Вкладка браузера показывает кастомный favicon (не дефолтный Vite)
6. View Source: заголовок, description, OG мета — все на месте
</success_signals>

---
*Context captured: 2026-04-15*
