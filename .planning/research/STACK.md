# Stack Research

**Domain:** Personal developer portfolio (single-page, CRT/terminal aesthetic, static on GitHub Pages)
**Researched:** 2026-04-15
**Confidence:** HIGH

Fixed constraints (not re-evaluated here): Vite + React + TypeScript, CRT/terminal look, GitHub Pages static hosting, no backend, single-page with `#about`/`#projects`/`#contact` anchors.

All version numbers below were verified against the npm registry on 2026-04-15 via `npm view <pkg> version`.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| vite | 6.3.0 | Build tool / dev server | Fixed choice. v6 is the current stable with Rolldown-ready config; `base` option makes GitHub Pages sub-path deploys a one-liner. |
| react | 19.2.5 | UI runtime | Fixed choice. v19 is stable, ships the new `use`/actions APIs we don't need but costs nothing to have. |
| react-dom | 19.2.5 | DOM renderer | Must match `react` major. |
| typescript | 5.8.3 | Type system | Fixed choice. 5.8 has stable `isolatedDeclarations`, better `satisfies` narrowing; enable `strict` — portfolio is small, cheap to do right from day 1. |
| @vitejs/plugin-react | 5.0.2 | JSX/Fast Refresh integration | Standard Vite+React glue. Pairs with Vite 6. |

**Styling decision (Research Q1): Vanilla CSS + CSS Custom Properties + a single global stylesheet split into logical files imported from `main.tsx`.**

| Approach | Bundle Cost | Verdict |
|----------|-------------|---------|
| **Vanilla CSS (chosen)** | 0 runtime JS, ~5–8 KB of hand-written CSS | CRT effects are global (scanline overlay, CRT vignette, glow filter on `body`/a root layer). Scoping them per-component is the wrong mental model — they are chrome, not component style. |
| CSS Modules | ~0 runtime cost | Useful when you have many components sharing class names. Portfolio has ~6 components. Overkill. |
| Tailwind | ~10–20 KB gz after purge + config overhead | Utility classes fight the aesthetic — you end up with `className="font-mono text-green-400 drop-shadow-[0_0_6px_#00ff00]"` for every element. For a site whose identity *is* a tight visual language, one semantic class (`.crt-text`) beats fifteen utilities. |
| styled-components / emotion | 12–20 KB runtime JS + CSS-in-JS cost | Adds runtime for no benefit — zero dynamic theming, one theme only. |
| vanilla-extract / panda | Build-time, 0 runtime | Technically fine but pulls in heavy tooling for a ~200-line CSS file. |

Confidence: **HIGH**. The whole CSS will fit under 10 KB minified, keeping the total CSS budget for CRT effects within the stated cap.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource/vt323 | 5.2.7 | Self-hosted VT323 webfont | **Primary display font** — authentic terminal feel, OFL-licensed. |
| @fontsource/jetbrains-mono | 5.2.8 | Self-hosted JetBrains Mono | **Body / readable mono** — used where VT323 is too coarse (long paragraphs, code blocks). OFL. |

That is the entire runtime dependency list beyond React. No router, no animation library, no icon pack, no UI kit.

**Fonts (Research Q3):**

| Font | License | Web-safe? | Role in this project |
|------|---------|-----------|----------------------|
| VT323 | OFL 1.1 (Google Fonts) | Yes | Headings, section labels, ASCII borders. Authentic CRT look. |
| JetBrains Mono | OFL 1.1 | Yes | Body text where VT323 hurts readability. |
| IBM Plex Mono | OFL 1.1 | Yes | Acceptable swap for JetBrains Mono; we don't need both. |
| Press Start 2P | OFL 1.1 | Yes | **Don't use** — this is 8-bit pixel, drifts toward the "Pixel variant" aesthetic the owner explicitly rejected. |
| Perfect DOS VGA 437 | Freeware, **not OFL** | Redistribution license is muddy | **Don't use for web self-hosting** — licensing ambiguity isn't worth it when VT323 solves the same problem. |

**Why two fonts, not one:** VT323 alone at small sizes on paragraphs creates readability issues (fails WCAG 1.4.8 for reading). JetBrains Mono as a body fallback is a quiet accessibility win with zero aesthetic compromise. Both loaded via `@fontsource/*` as self-hosted WOFF2 — no Google Fonts CDN call (faster, GDPR-clean).

**CRT libraries (Research Q2): roll our own. Do not adopt a library.**

Surveyed options:
- `react-crt`, `crt.css`, `nes.css`, `98.css` — all produce cookie-cutter looks. `nes.css` and `98.css` push into NES/Win98 territory, not CRT. Owner's anti-generic-AI constraint rules these out.
- `xterm.js` — full terminal emulator (~150 KB). We don't need a terminal, we need the *look* of one. Wrong tool.
- `asciimorph`, typewriter effects — 5–15 KB for something that is 20 lines of hand-written code.

Our CRT effect stack, hand-built:
1. **Scanlines** — single `::after` pseudo-element on `body` with a 2px `repeating-linear-gradient`. ~20 lines of CSS.
2. **Screen curvature / vignette** — radial gradient overlay. ~10 lines.
3. **Text glow** — `text-shadow: 0 0 6px currentColor`. One declaration.
4. **Flicker** — CSS `@keyframes` with `opacity: 0.97 ↔ 1` at ~15% duty. ~15 lines.
5. **Blinking cursor** — CSS `@keyframes` step(2). ~5 lines.
6. **Boot sequence** (optional) — React state machine stepping through lines with `setTimeout`. ~40 lines of TSX, no dependency.
7. **ASCII borders** — Unicode box-drawing characters (`╔═╗║╚╝`) in a `<pre>` with `aria-hidden`. Zero JS.

Total CRT budget: ~150–250 lines of CSS + ~60 lines of TSX. Well under the 10 KB cap. Confidence: **HIGH**.

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| eslint | 9.30.0 (latest 8.x: 8.58.2 — use 9.x flat config) | Linting | Use **flat config** (`eslint.config.js`) — this is the default and the 8.x config is deprecated. |
| typescript-eslint | 8.58.2 | TS rules for ESLint | Single package replaces the old `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` split. |
| eslint-plugin-react-hooks | 7.0.1 | Hooks rules | Required. |
| eslint-plugin-react-refresh | 0.5.2 | Fast Refresh safety | Warns on non-component exports in component files. |
| globals | 17.5.0 | Globals preset for flat config | Needed by flat-config boilerplate. |
| prettier | 3.8.3 | Formatter | Default config. No ESLint-Prettier integration plugin needed — just run them separately. |
| vitest | 4.1.4 | Test runner | **Install but write minimal tests**. Portfolio logic is near-zero; 2–3 smoke tests for utility helpers (e.g., `prefers-reduced-motion` hook) is enough. Do NOT set up component visual testing — unjustifiable cost for a 4-section site. |
| jsdom | 29.0.2 | DOM for vitest | Needed if any test touches `window.matchMedia`. |
| @testing-library/react | 16.3.2 | Component testing | Only add if you test a component. Optional. |
| @types/react | 19.2.14 | Types | Match react major. |
| @types/react-dom | 19.2.3 | Types | Match react-dom major. |
| gh-pages | 6.3.0 | Deploy helper | **Alternative to GitHub Actions** — see Q7. We recommend GitHub Actions; `gh-pages` stays off the deps list. |

**Research Q6 — minimum viable dev tooling verdict:** ESLint flat config + Prettier + TypeScript strict + Vitest-installed-but-barely-used. Skip Husky/lint-staged — GitHub Actions runs the checks in CI, pre-commit hooks are friction for a solo project.

### Routing (Research Q5)

**Decision: no router. Use native `<a href="#about">` anchor links and the browser's own hash handling.**

Rationale:
- `react-router` is ~10 KB gz and solves zero problems here. Three sections on one page is not a routing problem.
- Back/forward work natively with hash URLs — the browser pushes hash changes to history automatically.
- Smooth scroll: add `html { scroll-behavior: smooth; }` to CSS. Respect reduced motion via media query override.
- `scroll-margin-top` on each section header handles any fixed header offset.

Pattern:
```tsx
// Nav
<a href="#about">About</a>
<a href="#projects">Projects</a>
<a href="#contact">Contact</a>

// Sections
<section id="about">…</section>
<section id="projects">…</section>
<section id="contact">…</section>
```

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
section { scroll-margin-top: 4rem; }
```

Confidence: **HIGH**.

### Media for Previews (Research Q4)

**Web app previews:** `<video>` with `muted`, `loop`, `autoplay`, `playsinline`, `preload="metadata"` + a `poster` attribute pointing to a first-frame PNG.

| Format | Size for 6s 720p loop | Verdict |
|--------|----------------------|---------|
| **MP4 H.264** | ~400–800 KB | **Primary** — universal support. |
| **WebM VP9/AV1** | ~300–600 KB | **Secondary `<source>` for modern browsers** via `<source type="video/webm">`. |
| GIF | 3–8 MB for the same loop | **Don't use** — 10× larger, worse quality, no hardware decode. Legacy. |
| Still PNG/WebP | 80–200 KB | Fine as poster frame / fallback; not a substitute for motion. |

Recipe: encode with `ffmpeg -c:v libx264 -crf 28 -preset slow -vf "scale=1280:-2,fps=24" -an out.mp4` then a parallel WebM. `<video>` attributes above give GIF-like behavior without GIF's size.

**Telegram bot previews:** static React component that renders a chat mockup (bubbles, avatar, timestamps). Confirmed in `PROJECT.md` — no iframe. Structure:
- Plain TSX component `<TelegramMockup messages={…} />` with data from a typed array.
- Style with CSS (Telegram-dark-theme-ish palette bent to CRT green where it makes sense, or keep authentic Telegram colors inside a monitor "frame" — owner decides in design phase).
- `aria-label` per bubble; the entire mockup marked `role="img"` with a descriptive label so screen readers get the gist without hearing 20 chat bubbles.
- One component, reused per bot, fed different message arrays.

Confidence: **HIGH**.

### Build & Deploy (Research Q7)

**Decision: GitHub Actions, not the `gh-pages` npm package.**

Why Actions over `gh-pages`:
- No local `npm run deploy` step means no "I forgot to deploy" and no credentials on a dev machine.
- Build runs in a clean environment → parity with contributors / future-you on a new laptop.
- Uses the first-party `actions/deploy-pages` pipeline which is what GitHub now recommends (the `gh-pages` branch pattern is legacy).
- Zero dependencies added to `package.json`.

**vite.config.ts key bit (repo name `test-portfolio`):**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/test-portfolio/',        // MUST match repo name, trailing slash required
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
});
```

If the site is later hosted at a custom domain or at `<user>.github.io` (user site, not project site), change `base` to `'/'`.

**Workflow outline — `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

One-time manual step in repo settings: **Settings → Pages → Source: GitHub Actions**.

Confidence: **HIGH**.

### Accessibility Helpers (Research Q8)

No library needed. Hand-roll these primitives:

**`usePrefersReducedMotion` hook** (~15 lines):
```ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}
```

Use in root to gate CRT flicker/scanlines:
```tsx
const reduced = usePrefersReducedMotion();
<div className={reduced ? 'crt crt--static' : 'crt'}>…</div>
```

**CSS-only fallback** — do the same in CSS so non-React-rendered chrome (e.g., body pseudo-elements) also respects the preference:
```css
@media (prefers-reduced-motion: reduce) {
  .crt::before, .crt::after { animation: none !important; }
  .crt { animation: none !important; }
}
```

**Focus visibility:**
```css
:focus-visible {
  outline: 2px solid var(--crt-amber, #ffb000);
  outline-offset: 2px;
  /* CRT glow */
  box-shadow: 0 0 8px var(--crt-amber, #ffb000);
}
:focus:not(:focus-visible) { outline: none; }
```

**Contrast fallback** — when `prefers-reduced-motion` is set, also strip text-shadow glow (glow over green-on-black hurts contrast for some users):
```css
@media (prefers-reduced-motion: reduce) {
  .crt-text { text-shadow: none; }
}
```

**Skip link** — standard pattern, visible on focus, routes to `#main`.

Confidence: **HIGH**.

---

## Installation

```bash
# Scaffold
npm create vite@latest test-portfolio -- --template react-ts
cd test-portfolio

# Core is already installed by the template; pin to these versions if needed:
# vite@6.3.0 react@19.2.5 react-dom@19.2.5 typescript@5.8.3
# @vitejs/plugin-react@5.0.2 @types/react@19.2.14 @types/react-dom@19.2.3

# Fonts (runtime)
npm install @fontsource/vt323@5.2.7 @fontsource/jetbrains-mono@5.2.8

# Dev dependencies
npm install -D \
  eslint@9.30.0 \
  typescript-eslint@8.58.2 \
  eslint-plugin-react-hooks@7.0.1 \
  eslint-plugin-react-refresh@0.5.2 \
  globals@17.5.0 \
  prettier@3.8.3 \
  vitest@4.1.4 \
  jsdom@29.0.2
```

That's it. No router, no UI kit, no animation library, no CSS framework.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla CSS | CSS Modules | If the component count grows past ~20 and class-name collisions appear. Not today. |
| Vanilla CSS | Tailwind | If the site evolves into a multi-page product with many layouts and the CRT skin is abandoned. |
| Hand-rolled CRT effects | `nes.css` / `98.css` | Never for this project — both push toward rejected aesthetics. Use them only if the brief were explicitly "NES game UI" or "Win98 nostalgia". |
| No router | `react-router@7` | When you add `/blog/:slug` or any real URL paths. Hash anchors are sufficient for 3 sections. |
| GitHub Actions | `gh-pages` npm package | When you can't or won't configure Pages → Actions in repo settings (e.g., org policy). Adds a dep; keeps credentials local. |
| Vitest | Playwright / Cypress | If you add any interactive flow that warrants E2E (contact form with validation, multi-step sequence). Out of scope today. |
| `<video>` for previews | Animated WebP | WebP animation quality is good, but `<video>` gives play/pause control and is better for larger clips. WebP is fine for <3s loops. |
| VT323 + JetBrains Mono | Single font (VT323 only) | If willing to cap body copy at ~24px and keep paragraphs very short. Not recommended — readability suffers. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js / Astro | Owner explicitly excluded SSR/SSG frameworks. | Vite + React. |
| Tailwind CSS | Utility soup fights a tight visual identity; adds config + build cost for minimal CSS. | Vanilla CSS + custom properties. |
| styled-components / emotion | Runtime CSS-in-JS cost with zero theming benefit (one theme). | Vanilla CSS. |
| `nes.css`, `98.css`, `xp.css` | Push the site toward NES/Win98/XP cookie-cutter aesthetic the owner rejected. | Hand-built CRT CSS. |
| `react-crt`, other npm "CRT" components | Generic output, bundle cost, and they lock you into their DOM structure. | ~200 lines of hand-written CSS. |
| `xterm.js` | Full terminal emulator (~150 KB). We want the *look*, not a working shell. | CSS + a static `<pre>` block. |
| `framer-motion` / `gsap` | Heavy (30–60 KB) for animations we can do with CSS keyframes. | CSS `@keyframes`, `prefers-reduced-motion` media query. |
| `react-router` | 10 KB for hash navigation the browser does for free. | `<a href="#section">` + native hash handling. |
| GIF for video previews | 10× the size of MP4/WebM, worse quality, no hardware decode. | `<video muted loop autoplay playsinline>`. |
| Google Fonts CDN `<link>` | Extra DNS/TLS hop, privacy optics (EU GDPR concerns), flash of unstyled text. | `@fontsource/*` self-hosted WOFF2. |
| `lint-staged` + `husky` | Pre-commit hook friction for a solo project with CI. | Run ESLint/Prettier in the GitHub Actions workflow. |
| Perfect DOS VGA 437 font | Unclear redistribution license for web self-hosting. | VT323 (OFL 1.1). |
| Press Start 2P | Pushes aesthetic toward 8-bit pixel — explicitly rejected by owner. | VT323. |
| `gh-pages` npm package | Requires local deploy ritual; legacy `gh-pages` branch pattern. | GitHub Actions + `actions/deploy-pages`. |

---

## Stack Patterns by Variant

**If the portfolio later adds a blog:**
- Add `react-router@7` and switch to real routes.
- Keep content in Markdown compiled at build time with `vite-plugin-mdx` or similar — still no backend.

**If the owner decides CRT glow / scanlines are too intense on mobile:**
- Disable the overlay at `@media (max-width: 640px)` — keep the font and colors only.
- This is a design knob, not a stack change.

**If bundle size starts mattering (>50 KB gzipped JS):**
- It won't with this stack. React + this code will land around 45 KB gz. No action needed unless you add libraries.

**If owner wants a "boot sequence" on first load only:**
- `sessionStorage` flag gates it. ~10 lines. No library.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| vite@6.3.0 | @vitejs/plugin-react@5.0.2 | Plugin v5 is the Vite-6-compatible line. |
| react@19.2.5 | react-dom@19.2.5 | Must match on major+minor. |
| react@19.2.5 | @types/react@19.2.14, @types/react-dom@19.2.3 | Major must match React; minor can drift. |
| eslint@9.30.0 | typescript-eslint@8.58.2 | v8 of typescript-eslint requires ESLint 9 flat config. |
| typescript-eslint@8.58.2 | typescript@5.8.3 | TS 5.8 is within the supported range (≥4.8 <5.9). |
| vitest@4.1.4 | vite@6.3.0 | Vitest 4 aligns with Vite 6. |
| jsdom@29.0.2 | vitest@4.1.4 | Node 20+ required — GitHub Actions `setup-node@v4` with node 22 is fine. |
| @fontsource/* 5.2.x | any bundler | Import side effects only; tree-shakeable per weight. |

---

## Sources

- npm registry via `npm view <pkg> version` on 2026-04-15 — all pinned versions above. Confidence: HIGH.
- Vite docs `vitejs.dev/guide/static-deploy.html#github-pages` — `base` option and Actions deploy recipe. Confidence: HIGH.
- GitHub Docs `actions/deploy-pages` — current recommended deploy path (replaces `gh-pages` branch pattern). Confidence: HIGH.
- MDN `prefers-reduced-motion` — media query semantics and `matchMedia` pattern. Confidence: HIGH.
- SIL Open Font License 1.1 — verified for VT323, JetBrains Mono, IBM Plex Mono, Press Start 2P. Confidence: HIGH.
- Web.dev `replace-gifs-with-videos` — video-as-GIF pattern and encoding notes. Confidence: HIGH.
- Owner's `PROJECT.md` and anti-reference list in global `CLAUDE.md` §6 — aesthetic constraints. Confidence: HIGH.

---
*Stack research for: personal developer portfolio, CRT/terminal, Vite + React + TS, GitHub Pages*
*Researched: 2026-04-15*
