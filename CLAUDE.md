# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Vite dev server
npm run build       # tsc --noEmit && vite build — production bundle to dist/
npm run preview     # serve dist/ locally (simulates production base path)
npm run lint        # ESLint flat config (typescript-eslint + react-hooks + react-refresh)
npm run typecheck   # tsc --noEmit
npm run format      # prettier --write src/**/*.{ts,tsx,css}
```

No test suite — this is a static one-pager. Visual verification is done in `npm run dev`; CI runs typecheck + lint + build on push to `main`.

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml` which uses the official GitHub Pages actions (`configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`). Production URL: https://suvorovdv.github.io/test-portfolio/.

Pages source must be **GitHub Actions** in repo Settings → Pages (already configured). To redeploy without a code change: `gh workflow run deploy.yml`.

## Architecture

### Stack

Vite 6 + React 19 + TypeScript with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. No router (hash-based nav), no state library, no test runner. CSS Modules + global tokens for styling.

**TypeScript quirk:** `exactOptionalPropertyTypes: true` means `foo?: string` rejects `string | undefined`. Use `foo?: string | undefined` explicitly in prop types that accept optional values from a source that can be `undefined` (see `WebAppPreview.tsx`).

### Directory layout (flat feature-slicing)

```
src/
  components/   reusable (Nav, ProjectCard, WebAppPreview, TelegramChatPreview, CopyButton)
  sections/     AboutSection, ProjectsSection, ContactSection (one per site section)
  hooks/        useActiveSection, useHashNavigation, useReducedMotion
  data/         projects.ts — single source of truth for Projects grid
  types/        sections.ts, project.ts — typed constants + discriminated unions
  styles/       tokens.css (CSS custom properties), globals.css (reset + base)
```

Each component has a `.tsx` and a `.module.css` next to it. Global styles live only in `src/styles/`.

### Design system (punk-zine brutalism)

Palette locked in `src/styles/tokens.css`:
- `--paper` (cream `#F4F1EA`) — background
- `--ink` (`#0A0A0A`) — text/borders
- `--accent` (fire red `#FF2E1F`) — single accent; use sparingly

Conventions encoded in CSS:
- `--border: 3px solid var(--ink)` — default border on cards
- `--shadow: 6px 6px 0 var(--ink)` — hard offset shadow, **no blur**
- Hover interaction: translate + shrink shadow (classic brutalism "press")
- Body background has a subtle halftone via `radial-gradient`
- `@media (prefers-reduced-motion: reduce)` in `globals.css` kills all animations globally via `*` reset — new animations don't need individual handling, but prefer inline `useReducedMotion()` for JS-driven motion (video autoplay)

Typography: `@fontsource-variable/space-grotesk` (300-700 variable) is the only font. No monospace. Do not reintroduce CRT/terminal aesthetics — those were Phase 1-7 and were fully removed in Phase 8 (see `.planning/phases/08-redesign-punkzine/CONTEXT.md`).

### Data / navigation patterns

**Projects**: `src/data/projects.ts` exports `PROJECTS: Project[]`. `Project` is a discriminated union (`type: 'web' | 'telegram'`) from `src/types/project.ts`. `ProjectCard.tsx` switches the preview component on `project.type`. To add a project, edit `projects.ts` — no other files needed. Telegram projects render a static React chat mockup (`TelegramChatPreview`); web projects render `<video>` + `<img>` fallback (`WebAppPreview`).

**Navigation**: three anchor sections (`#about`, `#projects`, `#contact`) defined once in `src/types/sections.ts` (`SECTION_IDS` tuple). `useActiveSection` uses `IntersectionObserver` with `rootMargin: -40% 0px -40% 0px` (active = middle of viewport). `useHashNavigation` delegates click + popstate globally on `document`/`window` — a single listener handles all anchor links.

**GitHub Pages base path**: `vite.config.ts` has `base: '/test-portfolio/'`. `index.html` references static assets (favicon, og) with this prefix hardcoded because Vite doesn't rewrite them. The runtime JS/CSS get correct paths automatically.

### Contact email obfuscation

`src/sections/ContactSection.tsx` splits the email into `EMAIL_USER` + `@` + `EMAIL_DOMAIN` constants and composes at runtime — the full string never appears in HTML source. If you add more emails, follow this pattern.

## Project planning artifacts

`.planning/` contains the GSD framework output (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, research/, phases/). **Do not regenerate** — these are historical records of decisions. Consult when reasoning about why something is the way it is (especially `.planning/phases/08-redesign-punkzine/CONTEXT.md` for the current design rationale).

`.claude/` contains GSD framework itself (commands, agents, hooks) — treat as vendored third-party; do not modify directly.

## Commit conventions

Observed in git log: `feat(phase-N)`, `docs(phase-N)`, `chore`, `refactor(phase-N)`. Extended body with bullet list. Avoid amending — always a new commit. GSD tool `node .claude/get-shit-done/bin/gsd-tools.cjs commit "msg" --files <paths>` handles atomic commits for planning artifacts.

## When extending

- **New section**: add id to `SECTION_IDS` in `src/types/sections.ts`, create `src/sections/XSection.tsx` + `.module.css`, include in `App.tsx` `<main>`.
- **New project**: append to `PROJECTS` array in `src/data/projects.ts`. Ensure `id` is unique and kebab-case.
- **New component**: keep CSS Modules co-located; use tokens (`var(--accent)`, not literal colors).
- **New animation**: respect `prefers-reduced-motion` — the global reset catches most cases, but for JS-driven effects call `useReducedMotion()` and gate early.

## Anti-references (from user's global CLAUDE.md §6)

Design must not visually resemble:
- https://tezis.111.88.153.18.nip.io
- https://frontend-seven-omega-17.vercel.app

These are listed *despite* being the owner's own projects — the rule is about the **portfolio's** design not copying those sites. Current punk-zine look is far from both, but worth remembering if iterating on visuals.
