---
phase: 07-deploy
plan: 02
status: completed
date: 2026-04-15
---

# Plan 07-02: GitHub Actions + publish — Summary

✅ Полностью автоматизировано (вместо ручного setup — gh CLI).

## Что сделано

1. **`.github/workflows/deploy.yml`** — официальные GH Pages actions (configure-pages@v5, upload-pages-artifact@v3, deploy-pages@v4) с build+deploy jobs, concurrency group `pages`, минимальные permissions.
2. **Repo created**: `https://github.com/SuvorovDV/test-portfolio` через `gh repo create --public`
3. **Push**: branch master → main, `git push -u origin main`
4. **Pages enabled**: `gh api POST /repos/SuvorovDV/test-portfolio/pages -f build_type=workflow`
5. **Workflow passed**: build (typecheck → lint → build → upload) + deploy (deploy-pages)

## Production URL

🟢 **https://suvorovdv.github.io/test-portfolio/**

Ответы HEAD:
- `/` → 200 OK
- `/favicon.svg` → 200 OK
- `/og.svg` → 200 OK

## Non-blocking warning

GitHub Actions runner annotation: Node.js 20 deprecated (будет удалён в сентябре 2026). Обновить actions на версии с Node 24 когда они выйдут — задача для v2. Workflow сейчас работает.

## Follow-ups (оставлены владельцу)

- Конвертировать `public/og.svg` → `public/og.png` если Telegram не рендерит SVG preview
- Добавить реальные screencasts в `public/previews/tezis.mp4` и `frontend-seven.mp4`, раскомментировать `videoSrc` в `src/data/projects.ts`
- Уточнить описания `tezis` и `frontend-seven` (сейчас "TODO: уточнить")
- Прогнать `a11y-checklist.md` на prod URL (Lighthouse/axe/keyboard/SR)

## Phase 7 complete — MVP shipped
