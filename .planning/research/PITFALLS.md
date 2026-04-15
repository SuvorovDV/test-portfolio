# Pitfalls Research

**Domain:** Personal portfolio SPA — Vite + React + TypeScript, CRT/Terminal aesthetic, GitHub Pages static deploy, RU-only, solo-dev scope
**Researched:** 2026-04-15
**Confidence:** HIGH for aesthetic and deploy pitfalls (domain experience, well-documented anti-patterns); MEDIUM for accessibility specifics (CRT + WCAG is under-documented); MEDIUM for performance thresholds (depend on actual content weight)

> **Owner's explicit hard rule (from PROJECT.md and global CLAUDE.md §6):** the final site MUST NOT look like a generic AI-generated landing page. The aesthetic section below is the longest on purpose — this is the #1 failure mode for this project. Everything else can be fixed in-place; a generic-looking site can only be fixed by redesign.

---

## Critical Pitfalls

### Pitfall A1: "CRT-theme-on-top-of-generic-layout" syndrome

**What goes wrong:**
Developer wires a green VT323 font and a scanline overlay on top of a stock Tailwind landing page. Underneath the paint job, the DOM is still: centered hero, headline + subhead, two CTA buttons, a 3-column feature grid with icons, a testimonials row. Result: the eye sees "AI-generated landing in a Halloween costume." Visitor's 10-second read becomes "oh, another portfolio template."

**Why it happens:**
LLM tooling defaults to Tailwind hero patterns. Devs treat the theme as a skin, not as structural choice. CRT is applied at the `className` level, not at the layout level.

**How to avoid:**
- Lay out the page as if it were a **terminal session**, not a landing page. Sections read top-to-bottom as command output: `> whoami`, `> ls ./projects`, `> cat ./contact.txt`. No centered hero with a shimmering gradient headline.
- Replace the generic "Hero + 3 features + testimonials + CTA" skeleton with: **prompt + output block + prompt + output block**. The visual unit is a terminal paragraph, not a card grid.
- No hero image, no hero gradient, no glowing orb behind the headline. If you need visual weight, use an **ASCII figlet** of the name (pre-rendered, copy-pasted as text).
- Test: disable the CRT theme (remove font, scanlines, green tint). If what remains is a generic SaaS layout, the layout is wrong — restructure before re-theming.

**Warning signs:**
- `<section className="min-h-screen flex items-center justify-center">` for the opener.
- The phrase "hero section" appears in any filename or comment.
- A `<Button variant="primary">Get Started</Button>` exists anywhere.
- Removing CSS makes the page still look like a portfolio template.

**Phase:** Theming (structural decision, must happen before Sections)
**Severity:** Blocker

---

### Pitfall A2: Degrading into "dark-mode blog"

**What goes wrong:**
Scanlines get dialed back to 3% opacity "for readability", green is softened to `#A8D5A8`, VT323 is swapped for Inter "because VT323 is hard to read", and the site ends up as a pleasant black-background dark theme with subtle scan noise. Indistinguishable from any dev blog. The aesthetic commitment that was the whole point evaporates.

**Why it happens:**
Each softening decision is individually defensible (readability, accessibility, "modern feel"). Death by a thousand compromises. No one step feels wrong, but the sum is genericization.

**How to avoid:**
- Lock the palette in `tokens.css` **once** with a named commitment: `--crt-phosphor: #33FF66;` `--crt-bg: #0A0F08;` (not pure black — pure black is the dark-mode blog tell; use a near-black with a slight green tint to simulate a CRT's "off but warm" glass).
- Keep the mono font for **both** headings and body. Do not introduce a "readability fallback" sans-serif.
- Treat the CRT effects as the **baseline**, not an enhancement to be toned down. Add `prefers-reduced-motion` opt-out, but don't pre-water-down the default.
- If a readability issue forces a compromise, fix it with **letter-spacing, line-height, or font-size** — not by removing the aesthetic.

**Warning signs:**
- Any commit message containing "tone down", "soften", "more readable", "less aggressive".
- A second font family appearing in `index.css` other than the mono.
- Pure `#000000` background appearing anywhere.
- Color picker shows green at < 60% saturation or < 50% brightness.

**Phase:** Theming → guarded at every subsequent phase
**Severity:** Blocker

---

### Pitfall A3: Effect overload (nausea cocktail)

**What goes wrong:**
Scanlines + flicker + phosphor glow + screen curvature + typing animation + keystroke sound + chromatic aberration — all on by default, all at full strength. Visitors leave in 4 seconds with a headache. WCAG 2.3.1 likely violated on the flicker. Mobile CPUs thermal-throttle.

**Why it happens:**
Each effect individually looks cool in isolation. Developer adds them incrementally, never sees the cumulative result on a fresh-eyes viewing.

**How to avoid:**
- Pick **two "loud" effects and two "quiet" effects.** Recommended combo: loud = scanlines + cursor blink; quiet = subtle phosphor bloom on headings + faint vignette. No curvature, no screen flicker, no chromatic aberration, no typewriter on every section.
- Typing animation, if used, fires **once on initial load for the name/intro only**, never on re-renders, never on scroll-into-view repeatedly.
- No audio. Ever. Autoplay audio on a portfolio is a dealbreaker.
- Fresh-eyes test: open the site after 48h away. If your first reaction is "too much", it is.

**Warning signs:**
- CSS filter stack with more than 2 composited effects on any element.
- Any `setInterval` with period < 500ms driving visual changes.
- `<audio autoplay>` or `new Audio(...).play()` appears anywhere.
- Mobile browser reports > 40% CPU at idle on the page.

**Phase:** Theming
**Severity:** Major

---

### Pitfall A4: Stock "AI hero" patterns leaking in

**What goes wrong:**
Even with a CRT skin, the layout recycles specific anti-reference tells that betray LLM-default output. Specifically, **do not use any of the following** (name-by-name ban list):

1. **Big radial-gradient blob** behind the headline (`bg-gradient-radial from-[color]/40 to-transparent`).
2. **"✨ Introducing" pill/badge** above the headline (`<Badge>Sparkle + text</Badge>`).
3. **3-column feature grid with emoji icons** (⚡️ Fast, 🎨 Beautiful, 🔒 Secure).
4. **Testimonials row** with avatar + quote + name + title — especially fake ones on a portfolio.
5. **Pricing cards on a portfolio** — there is nothing to price; this is pure template cargo-culting.
6. **Bento-grid hero** (asymmetric rounded cards, one big + several small) — 2024–2025 SaaS trope.
7. **Glowing orb / aurora / mesh-gradient** behind the name.
8. **"Get Started" / "Try for free" CTA** — you have no product, no onboarding.
9. **Marquee / infinite-scroll logo strip** of "trusted by" — you are one person.
10. **Animated numbers counting up** ("10+ years", "50+ projects") — low-signal, high-cringe on a 4-project portfolio.
11. **Full-bleed video background**.
12. **Glassmorphism card** (`backdrop-blur-md bg-white/10`) — wrong era for CRT, and also an AI default.

**Why it happens:**
These are the highest-probability completions LLMs emit for "make me a landing page". They slip in by habit even when the brief explicitly rejects them.

**How to avoid:**
- Print the ban list as a comment at the top of the main layout file. Every PR self-review: re-read the list.
- Compare the staging site side-by-side with the two anti-references (tezis, frontend-seven-omega) after every theming PR. If you see any shared visual tell, strip it.

**Warning signs:**
- Any of the words from the ban list appear in component names, class names, or comments.
- A `radial-gradient(...)` or `backdrop-filter: blur(...)` appears in the stylesheet.
- The site, viewed in grayscale, looks like a generic SaaS layout.

**Phase:** Theming → audited every Section phase
**Severity:** Blocker

---

### Pitfall A5: Typeface mixing breaks the illusion

**What goes wrong:**
Headings in VT323/IBM Plex Mono, body switched to Inter "for readability on long text". The CRT-ness is immediately killed — a real CRT has one bitmap font. The visual contract is broken on the first paragraph.

**Why it happens:**
Dev instinct from modern web typography is "pair a display font with a text font." That instinct is correct for SaaS, wrong for a terminal.

**How to avoid:**
- **One** monospace font for the entire site: headings, body, labels, buttons, links.
- Recommended choices (2026 availability confirmed): **VT323** (Google Fonts, classic PC), **IBM Plex Mono** (safer, crisper at small sizes), **JetBrains Mono** (dev-oriented, well-hinted), **Berkeley Mono** (paid, premium terminal look).
- Use weight and size for hierarchy, not family switches. E.g., name = `VT323 48px`, section headers = `VT323 24px uppercase`, body = `VT323 16px`.
- If VT323 is unreadable at body size, swap the **whole site** to IBM Plex Mono, not just the body.

**Warning signs:**
- More than one `font-family` rule in `index.css`.
- `<h1 className="font-display">` and `<p className="font-body">` with different families.
- Body text renders in a sans-serif while headings are mono.

**Phase:** Theming
**Severity:** Major

---

### Pitfall A6: Wrong-era icon set

**What goes wrong:**
Lucide or Heroicons line-icons (external-link, mail, github logo) sprinkled through a CRT site. Round, anti-aliased, 1.5px strokes — these are 2020s Figma icons, fundamentally incompatible with a 1984 phosphor look. Immediate immersion break.

**Why it happens:**
`npm i lucide-react` is the default LLM suggestion for "add icons". It comes pre-wired with every starter.

**How to avoid:**
Use one of, in order of preference:
1. **ASCII glyphs inline**: `►` play, `▸` nav, `•` bullet, `◆` accent, `⏵` go, `▲▼◄►` arrows, `→` link, `✗` close, `[ ]`/`[x]` checkbox. Unicode, free, pixel-era aesthetic.
2. **Unicode box-drawing for frames**: `┌─┐ │ │ └─┘`, `╔═╗ ║ ║ ╚═╝` for double-line. Wrap project cards in ASCII borders instead of `border: 1px solid`.
3. **Pixel icons** — 16x16 PNG from a public pixel-icon set, rendered with `image-rendering: pixelated`.
4. **No icons at all** — brackets and text (`[github]`, `[demo]`, `[email]`) are more terminal-true than any icon.

Never ship Lucide/Heroicons/Feather/Tabler — they all have the same anti-aliased modern signature.

**Warning signs:**
- `lucide-react`, `@heroicons/react`, `react-icons`, `@tabler/icons-react` in `package.json`.
- Any `<svg>` with `stroke-width="1.5"` and `stroke-linecap="round"`.

**Phase:** Theming
**Severity:** Major

---

### Pitfall A7: `bg-black` dark-mode ≠ CRT feel

**What goes wrong:**
Background is `#000`, text is `#0F0`, font is mono → developer declares "CRT done". But it still reads as a dark-mode website, not a phosphor tube. Missing: the screen is not a flat rectangle of pixels, it's a **glass envelope** — warm tint, vignette at edges, slight bloom on bright text, faint scanline shadow when glyphs sit on a line.

**Why it happens:**
The lazy mental model is "CRT = black + green + monospace". The actual visual model is "phosphor coating behind glass, lit by a scanning electron beam."

**How to avoid:**
Build the CRT feel with four composable layers:
1. **Background tint**: not `#000000`, use `#0A0F08` (near-black with a whisper of green). Simulates "off CRT with ambient light on the phosphor."
2. **Vignette**: `radial-gradient` from transparent center to `rgba(0,0,0,0.6)` at corners, `position: fixed; inset: 0; pointer-events: none; z-index: 50;`. The tube is not flat-lit.
3. **Phosphor bloom** on text: `text-shadow: 0 0 2px currentColor, 0 0 8px color-mix(in srgb, currentColor 40%, transparent);` — subtle, only on larger text, disabled in `prefers-reduced-motion` (the blur itself is motion-adjacent for sensitive users).
4. **Scanline overlay**: a CSS `repeating-linear-gradient` (not a GIF), 2px stripes, `mix-blend-mode: multiply`, `opacity: 0.15-0.25`, fixed-position full-screen, `pointer-events: none`, `aria-hidden="true"`, `z-index` above content but below focus rings.

Contrast check **after** bloom — the bloom reduces effective contrast even when the base pair is 20:1.

**Warning signs:**
- Background is exactly `#000000`.
- No vignette layer exists.
- Scanlines implemented as a `.gif` or `.png`.
- Text shadow is missing on headings.

**Phase:** Theming
**Severity:** Major

---

## Accessibility Pitfalls

### Pitfall B1: WCAG 2.3.1 — three-flashes-per-second threshold

**What goes wrong:**
A "screen flicker" effect that toggles brightness 4–6 times per second triggers photosensitive epilepsy risk. WCAG 2.3.1 (Level A) prohibits content flashing more than 3 times/sec in the general flash or red flash thresholds.

**Why it happens:**
Developer eyeballs "looks like an old CRT flicker" without measuring frequency. `setInterval(flicker, 150)` → 6.6 Hz, over the limit.

**How to avoid:**
- Limit any brightness/opacity oscillation to **< 3 Hz** (period > 333ms). For a CRT buzz, a very slow 0.5 Hz breathing on the vignette (period 2s) is safer and feels more authentic than a fast flicker anyway.
- Keep the flashing area small (single cursor blink is fine; full-screen flicker is not).
- Respect `prefers-reduced-motion`: disable flicker entirely.

**Warning signs:**
- Any `setInterval` or CSS `animation-duration` shorter than 333ms driving an opacity/filter/brightness change on a large area.
- Full-screen `@keyframes flicker` without a reduced-motion guard.

**Phase:** Theming
**Severity:** Blocker (legal/ethical)

---

### Pitfall B2: `prefers-reduced-motion` applied inconsistently

**What goes wrong:**
Reduced-motion guard is put on one or two flagship animations (typewriter intro, scroll parallax) but forgotten on the small ones. Common misses: **cursor blink**, **typewriter on subsequent sections**, **scanline drift** (if scanlines move), **boot-sequence text reveal**, **glow pulse on hover**.

**Why it happens:**
Dev adds `@media (prefers-reduced-motion: reduce)` when adding the "big" animation, then forgets on later smaller ones. No central registry of animations.

**How to avoid:**
Centralize via a **single global rule** at the top of `index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
This catches every CSS animation by default. Then JS-driven animations (typewriter, boot sequence) each read `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at mount and render the final state instantly if true.

**Warning signs:**
- Reduced-motion media query appears more than once in the codebase (implies per-component opt-in, which leaks).
- Any `requestAnimationFrame` loop without a reduced-motion check at entry.

**Phase:** Theming (baseline) → re-verified in every Section phase that adds animation
**Severity:** Major

---

### Pitfall B3: Phosphor glow destroys effective contrast

**What goes wrong:**
Base text pair `#33FF66` on `#0A0F08` tests 18:1 in a contrast checker — great. After adding `text-shadow: 0 0 8px #33FF66` bloom, the glyph edges smear into the background, effective contrast at the edge drops to ~4:1, and low-vision users can't read body copy. The checker gives you a false pass because it measures solid fill, not blurred edges.

**Why it happens:**
WCAG contrast tools don't account for filter/shadow smearing.

**How to avoid:**
- Apply bloom **only to large text** (headings ≥ 24px, hero ≥ 48px) — WCAG AA allows 3:1 for large text.
- Body text: no bloom, crisp edges only.
- Provide an accessibility toggle "Effects: On / Minimal" that zeroes bloom and scanlines — persisted in `localStorage`.
- Manual low-vision test: zoom to 200%, check body copy is still sharp.

**Warning signs:**
- `text-shadow` applied globally to `body` or `p`.
- Body text appears "fuzzy" at 100% zoom on a non-Retina display.

**Phase:** Theming
**Severity:** Major

---

### Pitfall B4: Invisible focus ring on CRT theme

**What goes wrong:**
Default browser focus ring (blue, 2px) is invisible on near-black + green theme, or gets overridden by a `outline: none` reset. Keyboard users tab through links and see nothing. Fails WCAG 2.4.7.

**Why it happens:**
Tailwind/reset CSS strips default outlines. Dev forgets to redefine, or redefines in a color that doesn't contrast.

**How to avoid:**
```css
:focus-visible {
  outline: 2px solid var(--crt-phosphor);
  outline-offset: 2px;
  /* Add a contrasting backdrop so the ring is visible even over green text */
  box-shadow: 0 0 0 4px var(--crt-bg);
}
```
Use `:focus-visible` (keyboard-only) not `:focus` (also fires on mouse), so mouse users don't see rings on click. Test by tabbing the entire page at least once per phase.

**Warning signs:**
- `outline: none` or `outline: 0` appears anywhere without a replacement.
- Tab-through shows no visible indicator on any interactive element.

**Phase:** Theming → verified every Section phase
**Severity:** Major

---

### Pitfall B5: Scanlines / decorative overlays read by screen readers

**What goes wrong:**
The scanline `<div>` and vignette `<div>` don't have `aria-hidden="true"`, so VoiceOver/NVDA announce them as empty landmarks, or worse, a literal "group" traversal confuses SR users.

**Why it happens:**
Decorative divs feel too obvious to annotate. They're not.

**How to avoid:**
Every purely-decorative overlay gets `aria-hidden="true"` and `role="presentation"`. ASCII box-drawing borders around content are decorative **containers** — the inner content should be semantic (`<article>`, `<h2>`, etc.), and the ASCII frame should be a wrapping span with `aria-hidden`. Test with VoiceOver (Cmd+F5 on macOS) or NVDA — should not announce "scanlines" or the box-drawing characters.

**Warning signs:**
- Any `position: fixed; pointer-events: none` overlay without `aria-hidden`.
- Screen reader reads `┌─` and similar box-drawing characters as literal symbols.

**Phase:** Theming
**Severity:** Major

---

### Pitfall B6: Boot sequence traps focus / blocks content

**What goes wrong:**
A 3-second boot animation plays on page load. During those 3 seconds, content is `display: none` or `visibility: hidden`. A keyboard user or screen reader is locked out of the page until it finishes. Worse, users on reduced-motion still wait.

**Why it happens:**
Dev treats boot as a mandatory intro, not an optional flourish.

**How to avoid:**
- Content exists in the DOM from first paint. Boot sequence is a **visual overlay** that fades away; content is fully reachable by Tab/screen reader underneath or immediately after.
- Boot runs **once per session** (store flag in `sessionStorage`), skipped on subsequent navigations.
- Skipped entirely under `prefers-reduced-motion`.
- `<main>` receives focus after boot completes (or immediately if skipped).
- Skip link: `<button>[skip intro]</button>` visible on keyboard focus at top of page.

**Warning signs:**
- `<main>` has `aria-hidden` or `display: none` during load.
- Tab at page load does not reach any content until boot finishes.

**Phase:** Sections (intro)
**Severity:** Major

---

## Performance Pitfalls

### Pitfall C1: Webfont blocking render (FOIT)

**What goes wrong:**
VT323 is loaded with default CSS `@import` or bare `<link>` — browser blocks first paint until the font arrives. On slow 3G, 2-second blank screen. On a portfolio, users bounce.

**Why it happens:**
Google Fonts `<link>` snippet does not include `display=swap`.

**How to avoid:**
- **Self-host** the font: download `VT323.woff2`, put in `public/fonts/`, `@font-face` it with `font-display: swap`. Self-hosting also removes the Google Fonts privacy disclaimer obligation.
- Pick a **close-metrics fallback** so the swap is not jarring:
  ```css
  @font-face {
    font-family: 'VT323';
    src: url('/fonts/vt323.woff2') format('woff2');
    font-display: swap;
    size-adjust: 100%;
    ascent-override: 90%;
    descent-override: 20%;
  }
  body { font-family: 'VT323', 'Courier New', ui-monospace, monospace; }
  ```
- Preload the font in `index.html`: `<link rel="preload" href="/fonts/vt323.woff2" as="font" type="font/woff2" crossorigin>`.
- Subset to Latin + Cyrillic only (project is RU + EN). Full VT323 is small, but subsetting saves bytes anyway.

**Warning signs:**
- `https://fonts.googleapis.com/...` in `index.html` without `&display=swap`.
- Lighthouse "Eliminate render-blocking resources" flags the font.
- First Contentful Paint delayed > 1s on simulated 3G.

**Phase:** Foundation
**Severity:** Major

---

### Pitfall C2: Scanlines as animated GIF

**What goes wrong:**
Someone ships a 500 KB animated GIF as the scanline overlay. It pegs the GPU, can't be toggled via `prefers-reduced-motion`, scales poorly, and looks terrible on HiDPI.

**Why it happens:**
"CRT overlay PNG" is a common Google image search result; devs drop it in.

**How to avoid:**
Pure CSS:
```css
.scanlines {
  position: fixed; inset: 0; pointer-events: none; z-index: 40;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    rgba(0, 0, 0, 0.25) 2px 3px
  );
  mix-blend-mode: multiply;
}
```
Costs 0 bytes, scales infinitely, honors `prefers-reduced-motion` via the global rule. If drift is desired (slow vertical scroll), use `transform: translateY(...)` with a slow `@keyframes` — GPU-composited and cheap.

**Warning signs:**
- Any `.gif` in `public/` related to the theme.
- Network tab shows a > 50 KB image loaded for the overlay.

**Phase:** Theming
**Severity:** Minor (works, just wasteful) — Major if the GIF exceeds 1 MB

---

### Pitfall C3: Autoplay `<video>` on every project card

**What goes wrong:**
4 project cards, each with `<video autoplay loop muted src="demo.mp4">`. Mobile browser loads 4 videos simultaneously, decoder memory explodes, scroll jank, data waste, battery drain.

**Why it happens:**
"GIF-like preview" was in the requirements; dev reaches for `<video autoplay loop>` as the nearest primitive.

**How to avoid:**
- `preload="none"` on every video tag — no bytes downloaded until triggered.
- Use `IntersectionObserver`: when a card is ≥ 50% in viewport, `video.play()`; when it leaves, `video.pause()`.
- Pause all videos if `document.visibilityState !== 'visible'` (user tabbed away).
- Poster image always set: `poster="/previews/project-a.webp"` — user sees something immediately without triggering a download.
- Max 1–2 videos decoding at once on mobile (iOS Safari enforces this anyway; be explicit).
- Optimize: H.264 baseline, max 1280x720, ~2–4s loop, target < 500 KB per video. Consider WebP/AVIF animation as an alternative — smaller, no decoder pressure.

**Warning signs:**
- `<video autoplay>` without `preload="none"`.
- Lighthouse reports > 2 MB of media on initial load.
- Mobile Safari memory warning / page reload on scroll.

**Phase:** Projects section
**Severity:** Major

---

### Pitfall C4: Heavy CRT curvature effect

**What goes wrong:**
Developer implements tube curvature via a per-frame `<canvas>` repaint (reading pixels, applying barrel distortion) or a monstrous SVG `<filter>` with `feDisplacementMap`. CPU pegs at 30–60% continuously. Mobile dies.

**Why it happens:**
Real CRT curvature is hard; naive approaches are expensive.

**How to avoid:**
- **Skip curvature.** It's the least important CRT signifier and the most expensive. Scanlines + phosphor bloom + vignette carry the aesthetic without it.
- If desired, fake it statically: a large `border-radius` on the content wrapper + inner `box-shadow: inset` vignette. Zero runtime cost. Looks 80% as good.
- Never: per-frame canvas, WebGL barrel-distortion shaders, or SVG `feDisplacementMap` on the entire viewport.

**Warning signs:**
- `<canvas>` element used for a visual effect (not a game/data viz).
- `<filter>` element with `feDisplacementMap` or `feTurbulence` applied at viewport scale.
- DevTools Performance shows sustained > 30% main-thread time at idle.

**Phase:** Theming
**Severity:** Major

---

### Pitfall C5: Forgotten `base` in `vite.config.ts`

**What goes wrong:**
Site deploys to `https://user.github.io/test-portfolio/` but `vite.config.ts` is default (`base: '/'`). All asset paths resolve to `/assets/index-xxx.js` → 404. Blank page.

**Why it happens:**
Vite default assumes root deploy. GitHub Pages project sites live at a subpath.

**How to avoid:**
```ts
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/test-portfolio/' : '/',
  // ...
});
```
Or simpler — always set to `/test-portfolio/`, since dev server respects it too.

All internal links must use the router/base-aware helper, not hardcoded `/`. For anchors within a SPA this is fine (`#about`), but any `<img src="/foo.png">` must use `import.meta.env.BASE_URL + 'foo.png'` or, better, be imported: `import foo from './foo.png'`.

**Warning signs:**
- GH Pages shows a blank page, DevTools console shows 404s for `/assets/*`.
- `<img src="/hero.png">` with a hardcoded leading slash.

**Phase:** Deploy
**Severity:** Blocker

---

## GitHub Pages Deploy Pitfalls

### Pitfall D1: `base` mismatch — assets 404

See C5 above. Primary failure mode for GH Pages.

**Phase:** Deploy
**Severity:** Blocker

---

### Pitfall D2: SPA deep-link refresh → 404

**What goes wrong:**
User bookmarks `https://user.github.io/test-portfolio/projects` (if any path-based routes are added later), refreshes, GH Pages looks for `/projects/index.html` on disk, finds nothing, serves 404.

**Why it happens:**
GH Pages is static file hosting with no SPA fallback.

**How to avoid:**
- **Easiest for this project: stick to anchor-based navigation only** (`#about`, `#projects`, `#contact`). Everything lives on `index.html`. No path routes, no fallback needed. This is already the chosen architecture in PROJECT.md — don't regress.
- If path routes are ever added: copy `dist/index.html` to `dist/404.html` in the build step. GH Pages serves `404.html` on miss, which loads the SPA which reads the URL. (The Rafgraph `spa-github-pages` pattern.)

**Warning signs:**
- `react-router-dom` added to `package.json` (overkill for 3 sections; also introduces this problem).
- Any navigation using `history.pushState` with a path instead of a hash.

**Phase:** Deploy
**Severity:** Major

---

### Pitfall D3: Missing `.nojekyll` — files starting with `_` 404

**What goes wrong:**
GH Pages defaults to running Jekyll, which strips files/folders starting with `_`. Vite emits `_app` or similar in some configs; more commonly, any `_redirects` or underscore-prefixed asset just vanishes.

**Why it happens:**
Jekyll default on GH Pages. Silent.

**How to avoid:**
Create an empty `public/.nojekyll` file. Vite copies `public/` to `dist/` verbatim. Presence of `.nojekyll` at the root tells GH Pages: "skip Jekyll."

**Warning signs:**
- Any 404 on an asset whose path contains `_`.

**Phase:** Deploy
**Severity:** Major

---

### Pitfall D4: Case sensitivity: Windows dev, Linux runner

**What goes wrong:**
Dev on Windows imports `./components/projects` (file is `Projects.tsx`). Works locally (Windows NTFS is case-insensitive). GitHub Actions runs on Ubuntu (ext4, case-sensitive). Build fails or component fails to resolve in production only.

**Why it happens:**
Platform difference. Invisible on the dev machine.

**How to avoid:**
- Enforce exact-case imports in `tsconfig.json`: `"forceConsistentCasingInFileNames": true`. (Default in Vite's TS template — verify.)
- Lint step in CI that builds the project; catches it before deploy.
- Code-review discipline: filename `PascalCase.tsx` for components, imports match exactly.

**Warning signs:**
- Build passes locally, fails in CI with "Cannot find module './Projects'".
- Any import where filename casing differs from the import string.

**Phase:** Foundation + Deploy
**Severity:** Major

---

### Pitfall D5: `gh-pages` branch polluted with source

**What goes wrong:**
The `gh-pages` deploy branch contains `src/`, `node_modules/`, `.git/`, and `dist/` all mixed. Repo size balloons. GH Pages serves the wrong `index.html`.

**Why it happens:**
Someone runs `git push origin main:gh-pages` instead of publishing only `dist/`.

**How to avoid:**
- Use the official action: `peaceiris/actions-gh-pages@v4` or `actions/deploy-pages@v4` — publishes `dist/` only.
- Or use the `gh-pages` npm package: `"deploy": "gh-pages -d dist"`.
- Never commit `dist/` to `main`.

Recommended workflow (`.github/workflows/deploy.yml`): build on push to `main`, deploy `dist/` via `actions/deploy-pages`. Keeps `main` clean, `gh-pages` branch is managed by the action.

**Warning signs:**
- `gh-pages` branch contains `src/` or `package.json`.
- `git log gh-pages` shows hundreds of commits instead of one per deploy.

**Phase:** Deploy
**Severity:** Minor (works but messy) — Major if wrong content is served

---

## Telegram Bot Mockup Pitfalls

### Pitfall E1: Verbatim Telegram logo / trade dress

**What goes wrong:**
Mockup lifts Telegram's official paper-plane logo, exact header color (`#517DA2`), exact chat bubble colors, "Telegram" wordmark in its Roboto-like type. Invites a trademark complaint; also looks tacky.

**Why it happens:**
Easiest way to make it "look like Telegram" is to copy Telegram.

**How to avoke:**
Evoke, don't copy:
- Don't use the actual paper-plane logo. Don't use the word "Telegram" as a title; use `@yourbot_bot` as the header identifier.
- Chat bubble shape (rounded rectangle with a tail) is generic enough to use.
- Pick your own header color that harmonizes with the CRT palette (e.g., dark-green header instead of Telegram blue).
- Use generic labels ("chat preview", "bot demo"), not "Telegram Bot Demo".
- Provide an **"Open in Telegram"** link (`tg://resolve?domain=yourbot`) that goes to the real thing.

**Warning signs:**
- The file `telegram-logo.svg` or `paper-plane.svg` exists in `assets/`.
- Hex color `#0088CC` or `#517DA2` in the stylesheet.
- The word "Telegram" rendered in any imagery.

**Phase:** Projects
**Severity:** Major

---

### Pitfall E2: Mockup rots as Telegram UI evolves

**What goes wrong:**
Mockup is pixel-perfect Telegram-2026. In 2027, Telegram ships a redesign. Mockup now looks aged and stale, undermining the "current and active developer" message.

**Why it happens:**
Fidelity to a specific version of a third-party UI is a slow liability.

**How to avoid:**
- Mockup stays **stylized / illustrative**, not photorealistic. Rendered in the site's own CRT type and color scheme (phosphor green chat bubbles on dark), wrapped in ASCII borders — signals "this is a representation, not a screenshot."
- Because the mockup matches the site's aesthetic rather than Telegram's, it ages with the site, not with Telegram.
- Bonus: ASCII-bubble chat fits the CRT theme and dodges pitfall E1 simultaneously.

**Warning signs:**
- Mockup uses Telegram's exact typography and colors.
- Mockup looks like a screenshot, not an illustration.

**Phase:** Projects
**Severity:** Minor (cosmetic, slow-burn)

---

### Pitfall E3: Pretending the bot is live

**What goes wrong:**
Visitor clicks the mockup "Send" button. Nothing happens, or a fake reply appears. Feels broken / fake.

**Why it happens:**
Ambiguity about whether the preview is interactive.

**How to avoid:**
- Label the mockup explicitly: `[ preview — static mockup ]` underneath, or watermark it `PREVIEW` in the corner.
- The only interactive element is a prominent **"Open in Telegram →"** CTA (`tg://resolve?domain=yourbot` or `https://t.me/yourbot`) that opens the real bot.
- Input field is visually present but non-interactive: `readonly`, `tabindex="-1"`, or just a styled `<div>`, not an `<input>`.

**Warning signs:**
- A functional `<input>` in the mockup that goes nowhere on submit.
- No "Open in Telegram" link near the mockup.

**Phase:** Projects
**Severity:** Major

---

## React Pitfalls

### Pitfall F1: Scroll state lifted to `App`, re-rendering the world

**What goes wrong:**
An `IntersectionObserver` watching section visibility writes to `useState` at the `App` root. Every scroll tick re-renders the entire tree. On a static page this is invisible at first, but once animations are added, jank appears.

**Why it happens:**
Easiest to lift state to the top.

**How to avoid:**
- Keep the observer state **inside the component that uses it**. A `<SectionReveal>` wrapper that owns its own `ref` and `isVisible` state, re-renders only itself.
- If shared scroll state is needed (e.g., active-section indicator in a nav), use a small zustand store or a dedicated context **with a selector** — not `useState` in `App`.
- Prefer CSS `@keyframes` + `animation-play-state` triggered by an `intersectionobserver`-toggled class name. No React render on scroll at all.

**Warning signs:**
- `useState` for scroll/visibility at `App` level.
- React DevTools Profiler shows `App` rendering on every scroll.

**Phase:** Sections
**Severity:** Minor (for this scale) — Major if animations get added later

---

### Pitfall F2: `window` event listeners without cleanup

**What goes wrong:**
`window.addEventListener('scroll', handler)` inside `useEffect` without a cleanup return. On StrictMode double-invoke in dev, or on remount, listeners pile up. In a 4-section static page this never breaks in production, but it's a bad habit that bites on bigger work.

**How to avoid:**
Always:
```ts
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}, []);
```
Pair every `addEventListener` with a `removeEventListener` in the cleanup. Always pass `{ passive: true }` on scroll/wheel/touch to avoid blocking main thread.

**Warning signs:**
- `useEffect` returning `undefined` while having subscribed to something.
- React StrictMode warning in dev about duplicate subscriptions.

**Phase:** Sections
**Severity:** Minor

---

### Pitfall F3: `localStorage` / `window` access during SSR

**What goes wrong:**
Code reads `window.matchMedia(...)` at module load time. Crashes during server-side render.

**Why it happens:**
Default assumption on Next.js / Astro.

**How to avoid (document for this project):**
Not an issue for this project — Vite + React is fully client-side, SPA only, there is no SSR step. **But**: if anyone ever migrates to Next.js / Astro later, every `window.*` and `localStorage.*` access at module level or component body needs a `typeof window !== 'undefined'` guard or to move inside `useEffect`.

Acceptable pattern even now (for forward safety):
```ts
const [reducedMotion, setReducedMotion] = useState(false);
useEffect(() => {
  setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}, []);
```

**Warning signs:**
- Direct `window.*` or `localStorage.*` read in a component body (outside `useEffect`).

**Phase:** N/A for current stack — document only
**Severity:** Minor (currently) — Major on any future SSR migration

---

## Content Pitfalls

### Pitfall G1: Lorem ipsum on deploy

**What goes wrong:**
Placeholder Latin text ("Lorem ipsum dolor sit amet...") survives into the production deploy. Visible to visitors, Googlebot, recruiters. Project credibility destroyed.

**Why it happens:**
Content is added late; `git grep` is forgotten.

**How to avoid:**
- Pre-deploy grep in CI: `rg -i "lorem|ipsum|placeholder|todo|fixme|your name here|example\.com"` on `src/` — fail build on hit.
- Keep all copy in a single `content.ts` config file. Easy to audit at a glance.
- Owner writes at least the About blurb and one real project description before the first deploy. Placeholder projects are acceptable as long as they clearly say "coming soon" (in theme-appropriate wording — `> loading...` or `[wip]`).

**Warning signs:**
- `Lorem` or `ipsum` anywhere under `src/`.
- Project titles like "Project 1", "My App", "Cool Bot".
- `you@example.com` in a contact link.

**Phase:** Sections / Projects / pre-Deploy gate
**Severity:** Blocker (for deploy)

---

### Pitfall G2: Placeholder project art outshines real projects

**What goes wrong:**
You make beautiful placeholder screenshots of fake projects. Later, the real projects' screenshots look crude by comparison. Temptation: keep the placeholders. Ethical problem: they're fake.

**Why it happens:**
Design is fun, real projects are messy.

**How to avoid:**
- Placeholder art is **explicitly** labeled as placeholder: `[mockup]` watermark, or render as pure ASCII-art (clearly illustrative, not pretending to be real).
- Never use AI-generated pretty fake screenshots and present them as real product art.
- Keep real screenshots honest — compress them, but don't retouch.

**Warning signs:**
- Placeholder images look more polished than any real screenshot in the project folder.

**Phase:** Projects
**Severity:** Major (integrity)

---

### Pitfall G3: "Available for hire" with no details

**What goes wrong:**
Site says "Available for work" but no stack, no timezone, no capacity ("full-time / part-time / contract"), no region, no rate ballpark. Result: unqualified inbound noise — recruiters pitching unrelated stacks, spam.

**Why it happens:**
Impulse to keep things vague "to stay open".

**How to avoid:**
If "available" is declared, include at minimum:
- Stack/focus (e.g., "React + TypeScript, Node, Telegram bots").
- Timezone (e.g., "UTC+3").
- Capacity and type ("open to contract, ~20 hrs/week" or "full-time").
- What you're NOT looking for, if it filters volume ("not interested in Web3 / NFT").

Or: don't claim availability. Say "contact" and let the conversation filter.

**Warning signs:**
- "Available for hire" / "Open to opportunities" on the page with no qualifiers.

**Phase:** Sections (Contact)
**Severity:** Minor (quality-of-life)

---

### Pitfall G4: Plain-text email harvested by scrapers

**What goes wrong:**
`<a href="mailto:me@example.com">me@example.com</a>` in the HTML. Scrapers grep it within hours. Inbox floods.

**Why it happens:**
Obvious, easiest markup.

**How to avoid:**
Options, ordered by effectiveness:
1. **JS-reveal**: email assembled at runtime from parts (`const u='me', d='example.com'; href = \`mailto:\${u}@\${d}\``). Defeats simple scrapers; trivial JS to write.
2. **`[at]` obfuscation** shown as text (`me [at] example [dot] com`) with a JS-upgraded real `mailto` link on click. Accessible fallback.
3. **Cloudflare email obfuscation** — requires CF proxy, not straightforward on raw GH Pages.
4. **Use a dedicated forwarding address** (e.g., `hello@yourdomain.com`) distinct from your main inbox — so if it leaks, you can rotate.

Also: provide Telegram (`t.me/username`) as the preferred channel — harder to spam-automate than email.

**Warning signs:**
- A literal email address string in any rendered HTML source.

**Phase:** Sections (Contact)
**Severity:** Major

---

## Solo-Dev Scope Pitfalls

### Pitfall H1: Building a CMS for 4 items

**What goes wrong:**
Dev decides content deserves a "proper" CMS — Contentful/Sanity/markdown+gray-matter+MDX pipeline. Weeks spent on infrastructure, zero on actual portfolio content.

**Why it happens:**
Building tooling is more fun than writing content.

**How to avoid:**
PROJECT.md already decided: "весь контент в конфиг-файле / TypeScript-константах." Honor it. One `content.ts` exporting a typed object. Adding a 5th project = add a 5th array item.

**Warning signs:**
- Any library containing "cms", "contentful", "sanity", "strapi", "headless" in `package.json`.
- An `/api/` or `/content/` folder with > 10 files.

**Phase:** Foundation / Sections
**Severity:** Major (time sink)

---

### Pitfall H2: i18n before any English content exists

**What goes wrong:**
`react-i18next` added pre-emptively "because we'll translate later." Every string becomes `t('home.about.title')`. Never translated. Extra abstraction forever.

**Why it happens:**
Speculative flexibility.

**How to avoid:**
PROJECT.md: "Мультиязычность — только RU на старте." If English is ever needed, it's one config file swap — YAGNI until then. The CRT aesthetic also works well bilingually (mono + Latin or Cyrillic both fit); no structural change required.

**Warning signs:**
- `i18next`, `react-intl`, `next-intl` in `package.json`.
- String literals wrapped in `t(...)` calls.

**Phase:** Foundation
**Severity:** Major

---

### Pitfall H3: Full test suite for a static one-pager before shipping

**What goes wrong:**
Vitest + React Testing Library + Playwright + Storybook all set up before a single real visitor sees the site. Weeks on test infra, site is still blank.

**Why it happens:**
Testing discipline is a virtue in general. Misapplied here.

**How to avoid:**
- Zero unit tests at MVP. Site is static content; the "test" is opening it in a browser.
- **One** smoke test before deploy: Playwright script opens the built site, checks title renders, checks all section anchors scroll, checks no console errors. Runs in CI on every push.
- Add more tests only when regressions actually occur.

**Warning signs:**
- `__tests__/` directory with > 5 files before shipping.
- Storybook / Chromatic setup on a 3-section site.

**Phase:** Foundation / Deploy
**Severity:** Major (time sink)

---

### Pitfall H4: Premature Lighthouse 100 optimization

**What goes wrong:**
Dev chases Lighthouse 100/100/100/100. Removes animations, inlines critical CSS, strips features that make the site distinctive. Score is perfect. Site is boring.

**Why it happens:**
Scoreboard dopamine.

**How to avoid:**
- Target: **90+ on Performance, 95+ on Accessibility, 100 on SEO, 95+ on Best Practices** on mobile. Ship.
- The distance from 90 to 100 on Performance costs far more than it's worth for a personal portfolio with zero commercial SLA.
- Accessibility and SEO are cheap to max out; spend effort there. Performance is good-enough at 90.
- Run Lighthouse **once** before launch, fix any Blocker/Major issue it raises, ship. Don't re-run weekly obsessively.

**Warning signs:**
- PR titled "Lighthouse: 97 → 99" with 400 lines of delta.
- Removing the scanlines or phosphor bloom "for a better CLS score".

**Phase:** Deploy (one-time check)
**Severity:** Minor (but meaningful time/aesthetic tradeoff)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode content in `.tsx` instead of `content.ts` config | Save 10 minutes | Every content edit becomes a code edit; risk of typos breaking JSX | Never — the project explicitly chose config-file content |
| Skip `prefers-reduced-motion` on "small" animations | Faster implementation | Excludes motion-sensitive users; accessibility regression | Never |
| Ship with any Lucide/Heroicons icon | Familiar, one import | Anti-aesthetic, breaks the CRT commitment | Never on this project |
| Use `<video autoplay loop>` without `preload="none"` + IO | Works on desktop | Mobile performance/memory disaster | Never for > 1 video on a page |
| Deploy `gh-pages` branch with full repo instead of `dist/` | One less config line | Bloats repo, confuses reviewers | Never — the official action handles it |
| Skip a `.nojekyll` file | One less file | Silent 404s on underscore-prefixed assets | Never — cost is one empty file |
| Use `fetch('https://api.github.com/users/...')` at runtime for live stats | "Live" stats without backend | Rate-limit risk, CORS risk, unreliable | MVP only, max 1 unauth call; cache in localStorage with a long TTL |
| Pure `#000` background | 5-second decision | Becomes the dark-mode-blog tell | Never |
| Single mono font for entire site (vs. pair with sans) | Commitment to aesthetic | Readability tuning harder at small sizes | Always — this IS the commitment |
| Hash-only routing (no react-router) | No deploy path issues, tiny bundle | Can't deep-link to sub-pages | Always for this project's 3-section scope |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages | `base: '/'` in vite.config for a project site | Set `base: '/<repo-name>/'` |
| GitHub Pages | Commit `dist/` to `main` | Let `actions/deploy-pages` push a separate artifact; `main` stays source-only |
| GitHub Pages | Missing `.nojekyll` | Empty `public/.nojekyll` file |
| Telegram bot preview | Live iframe embed | Telegram doesn't support iframe embed — use a static stylized mockup + "Open in Telegram" link |
| Telegram bot preview | Using Telegram's actual logo/colors | Evoke with the site's own palette; use `@botname` as identifier, not Telegram branding |
| Google Fonts | `<link>` without `&display=swap` | Self-host `.woff2` with `font-display: swap` + preload |
| Google Fonts | Full font served for Latin-only content | Subset to `latin,cyrillic` |
| GitHub `mailto:` | Plain email in HTML | JS-reveal assembly or `[at]` obfuscation with JS upgrade |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Webfont FOIT | Blank page 1–2s on slow 3G | Self-host + `font-display: swap` + preload + close-metrics fallback | Any 3G user; corporate proxies |
| Multiple autoplay `<video>` on mobile | Scroll jank, iOS Safari reload, battery drain | `preload="none"` + IO-triggered play/pause, max 1–2 concurrent | 3+ cards visible at once on mid-range mobile |
| Scanline GIF | 500 KB+ asset, GPU pressure | CSS `repeating-linear-gradient` | Always — GIF is always worse here |
| Canvas/SVG-filter CRT curvature | Sustained 30–60% CPU at idle | Drop curvature, or use `border-radius` + inset shadow | Mobile devices, anyone on battery |
| `useState` in `App` driven by scroll | Whole-tree re-renders, laggy animations | Localize observer state; use CSS-class toggles | When other animations are added; not visible initially |
| Unbounded `window` listeners | Memory grows on StrictMode/HMR | Always return cleanup from `useEffect` | Dev HMR sessions; rarely prod |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Plain-text email in HTML | Spam flood | JS-reveal or `[at]` obfuscation; or use a forwarding alias |
| Including a GitHub token in frontend code for "live" repo data | Token leaked publicly; account compromise | Never put tokens in a static SPA; use unauth GitHub REST (rate-limited) or a pre-built JSON at deploy time |
| `target="_blank"` without `rel="noopener noreferrer"` | Reverse tab-nabbing (dated but still flagged by linters) | Always pair `target="_blank"` with `rel="noopener noreferrer"` |
| Using Telegram's actual logo/trade dress on mockup | Trademark complaint; takedown risk | Stylized evocation only, no verbatim logo/wordmark |
| Exposing real physical address / phone on the contact section | Doxxing, harassment | Use only email + Telegram handle + GitHub; no address, no phone |
| Copy-pasting code snippets from sites with tracking scripts (for a "styled code block") | Third-party beacons | Render code with a local syntax highlighter (shiki, highlight.js) at build time, not via an embedded widget |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Unskippable boot-sequence intro | Returning visitors annoyed; SR users locked out | Run once per session; skip link visible on keyboard focus; honor `prefers-reduced-motion` |
| Typewriter animation on every heading every time it scrolls into view | Reading interrupted; feels gimmicky | Typewriter only on first paint of the name/intro block |
| Non-interactive mockup that looks interactive | User clicks, nothing happens → "broken" | Label as `[preview]`, provide a real "Open in Telegram" CTA |
| CRT theme with mouse-only hover interactions | Keyboard users can't trigger the reveals | Every hover reveal also triggers on `:focus-visible` |
| Email as the only contact option | High-friction for Telegram-native audience | Offer Telegram handle alongside email; often more responsive |
| Project card showing only "Demo" with no repo link | Visitors can't verify authorship | Always show both `[demo]` and `[repo]` links when both exist; if no repo, explain ("closed-source client work") |
| Owner's name nowhere visible in the first viewport | Visitor doesn't know whose portfolio this is | Name in the first 200px of the page, always |
| Site with no `<title>` or generic `<title>Vite + React</title>` | Terrible bookmark/tab display, bad SEO | `<title>Name — Developer Portfolio</title>`, and meta description |

---

## "Looks Done But Isn't" Checklist

- [ ] **CRT theme**: disable all CSS — layout underneath is a **terminal**, not a SaaS landing.
- [ ] **CRT theme**: anti-reference ban list (Pitfall A4) has zero matches.
- [ ] **Typography**: exactly one font family in `index.css` (excluding fallbacks).
- [ ] **Icons**: zero packages from `lucide-react`/`@heroicons/react`/`react-icons`/`@tabler/icons-react` in `package.json`.
- [ ] **Reduced motion**: global `@media (prefers-reduced-motion: reduce)` rule zeroes all animations; JS animations check `matchMedia` at mount.
- [ ] **Focus rings**: tab-through entire page — every interactive element shows a visible ring with `:focus-visible`.
- [ ] **Screen reader**: decorative overlays (scanlines, vignette, ASCII frames) have `aria-hidden="true"`.
- [ ] **Flash safety**: no animation shorter than 333ms period on a large area.
- [ ] **Font loading**: self-hosted, `font-display: swap`, preloaded, subsetted.
- [ ] **Vite base**: `base: '/<repo-name>/'` set; dev site works at that subpath.
- [ ] **Deploy**: `.nojekyll` present in `public/`.
- [ ] **Deploy**: `gh-pages` branch contains only built assets, not source.
- [ ] **Deploy**: CI build runs on Linux and passes (case-sensitivity caught).
- [ ] **Deploy**: Lighthouse mobile ≥ 90 Perf, ≥ 95 A11y, = 100 SEO.
- [ ] **Project videos**: `preload="none"` + IntersectionObserver play/pause + poster image set.
- [ ] **Telegram mockup**: no Telegram logo, no `#0088CC`/`#517DA2`, labeled as preview, "Open in Telegram" CTA present.
- [ ] **Content**: no `lorem`/`ipsum`/`placeholder`/`you@example.com`/`Project 1` anywhere in `src/`.
- [ ] **Content**: owner's name and one-line identity in first viewport.
- [ ] **Contact**: email obfuscated (JS-reveal or `[at]`), not a plain string.
- [ ] **Meta**: `<title>` set, `<meta name="description">` set, `<meta property="og:*">` set for share previews.
- [ ] **Smoke test**: one Playwright test verifies built site loads and section anchors work.
- [ ] **Fresh-eyes test**: leave the site for 24–48h, return — first reaction is "distinctive", not "too much" or "generic".

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Site looks generic despite CRT paint (A1) | HIGH | Redesign layout from "terminal session" first principles; don't re-skin. Delete hero/feature-grid/testimonial structure. Restart from prompt-output units. |
| Drift into dark-mode blog (A2) | MEDIUM | Revert all "softening" commits; re-lock palette in `tokens.css`; add a lint comment at the top of it. |
| Shipped with Lucide icons (A6) | LOW | `npm uninstall lucide-react`; replace with ASCII/Unicode glyphs via grep-and-replace (usually 5–15 call sites). |
| Deployed with `base: '/'` → blank page (C5/D1) | LOW | Fix `vite.config.ts` `base`, rebuild, redeploy. Minutes. |
| GH Pages serves no assets — missing `.nojekyll` (D3) | LOW | Add `public/.nojekyll`, rebuild, redeploy. |
| Lorem ipsum shipped (G1) | LOW | Grep, replace, redeploy. Embarrassment scales with hours exposed; check Search Console if indexed. |
| Email address scraped and flooded (G4) | MEDIUM | Rotate email (forwarding alias helps); implement JS-reveal; set up spam filters; wait it out. |
| WCAG 2.3.1 flicker violation reported (B1) | MEDIUM | Cap all flicker animations at 3 Hz or disable; add reduced-motion guard; re-audit. |
| Mobile browser crashes on Projects page (C3) | MEDIUM | Add `preload="none"` and IO-driven play/pause; reduce to max 2 concurrent videos; add poster images; re-deploy. |
| Telegram trademark complaint (E1) | HIGH | Remove Telegram logo/wordmark within 24h of notice; rewrite mockup in site's own aesthetic; document change. |
| Lighthouse chase broke the aesthetic (H4) | LOW | `git revert` the optimization commits; accept 90, ship. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| A1 — CRT on generic layout | Theming (structural) | Disable CSS → layout reads as terminal session, not landing |
| A2 — Dark-mode blog drift | Theming → guarded every later phase | Palette tokens unchanged since initial commit; single mono font |
| A3 — Effect overload | Theming | Max 2 loud + 2 quiet effects; mobile CPU < 20% at idle |
| A4 — Stock AI hero patterns | Theming → audited in every Section phase | Ban list grep returns zero; side-by-side with anti-refs shows no overlap |
| A5 — Typeface mixing | Theming | One `font-family` in stylesheet |
| A6 — Wrong-era icons | Theming | No icon packages in `package.json` |
| A7 — `bg-black` ≠ CRT feel | Theming | Background tinted (not `#000`); vignette, bloom, scanlines all present |
| B1 — WCAG flash threshold | Theming | No animation < 333ms period on large area |
| B2 — Reduced-motion inconsistency | Theming baseline + every animation phase | Global `*` rule in place; JS animations check `matchMedia` |
| B3 — Glow destroys contrast | Theming | Bloom on large text only; body text crisp |
| B4 — Invisible focus ring | Theming → verified every Section | Tab-through shows visible ring on every interactive |
| B5 — SR reads decorative overlays | Theming | VoiceOver/NVDA test; all overlays `aria-hidden` |
| B6 — Boot sequence traps focus | Sections (intro) | Tab works during boot; runs once per session |
| C1 — Webfont FOIT | Foundation | Self-hosted + swap + preload; Lighthouse no FOIT warning |
| C2 — Scanline GIF | Theming | No GIF in `public/`; scanlines are CSS |
| C3 — Video autoplay overload | Projects | `preload="none"` + IO confirmed; mobile memory stable |
| C4 — Expensive curvature | Theming | No canvas/filter used for curvature |
| C5/D1 — Vite `base` mismatch | Deploy | Staging site loads assets from `/<repo>/assets/*` |
| D2 — SPA refresh 404 | Deploy (decision) | Hash-only routing, no `404.html` fallback needed |
| D3 — Missing `.nojekyll` | Deploy | `public/.nojekyll` committed |
| D4 — Case sensitivity | Foundation + Deploy | CI Linux build passes; `forceConsistentCasingInFileNames: true` |
| D5 — Polluted `gh-pages` branch | Deploy | Official action used; branch contains only `dist/` |
| E1 — Telegram trade dress | Projects | No Telegram logo/wordmark/exact color in assets |
| E2 — Mockup rots | Projects | Mockup styled in site aesthetic, not Telegram's |
| E3 — Mockup pretends to be live | Projects | Labeled `[preview]`; "Open in Telegram" CTA present |
| F1 — App-level scroll state | Sections | React Profiler: scroll doesn't re-render `App` |
| F2 — Listener cleanup missing | Sections | Every `addEventListener` paired with cleanup |
| F3 — SSR window access | N/A (SPA) | Documented for future migration |
| G1 — Lorem ipsum in prod | Sections / Projects / pre-Deploy gate | CI grep for placeholder strings fails build |
| G2 — Placeholder art > real art | Projects | Placeholders clearly labeled; no fake polished art |
| G3 — "Available for hire" vague | Contact | Stack + timezone + capacity present, or claim removed |
| G4 — Plain-text email | Contact | No literal email in rendered HTML source |
| H1 — CMS for 4 items | Foundation | No CMS-related packages in `package.json` |
| H2 — Premature i18n | Foundation | No i18n packages |
| H3 — Full test suite | Foundation / Deploy | At most one smoke test pre-launch |
| H4 — Lighthouse 100 chase | Deploy (one-time) | Lighthouse run once; 90+/95+/100/95+; shipped |

---

## Sources

- **Owner's anti-references** (from global CLAUDE.md §6): https://tezis.111.88.153.18.nip.io, https://frontend-seven-omega-17.vercel.app — concrete examples of "generic AI look" to diverge from.
- **PROJECT.md** constraints and decisions (Vite + React, CRT aesthetic, hash routing, GH Pages, RU-only, prefers-reduced-motion required).
- **WCAG 2.1 §2.3.1** (Three Flashes or Below Threshold, Level A) and §2.4.7 (Focus Visible, Level AA).
- **GitHub Pages documentation**: Jekyll bypass via `.nojekyll`; SPA fallback via `404.html` (Rafgraph pattern).
- **Vite docs**: `base` config for subpath deployment; `public/` directory static copy behavior.
- **Well-known CRT-web references**: classic CSS CRT demos and commentary on scanlines-as-gradient vs. overlay images; `font-display: swap` guidance from `web.dev`.
- **Known LLM landing-page failure modes**: 2024–2025 "AI-slop landing page" criticism across design Twitter/HN — bento grids, glowing orbs, "✨ Introducing" badges, testimonial rows.
- **Telegram brand guidelines** (general principle): avoid verbatim use of logo/wordmark in third-party promotional contexts; safer to evoke.
- **Personal experience**: Vite + GH Pages deploy gotchas (`base`, `.nojekyll`, case sensitivity); mobile video decoder limits on iOS Safari.

---
*Pitfalls research for: test-portfolio personal portfolio SPA (Vite + React + TypeScript, CRT aesthetic, GH Pages)*
*Researched: 2026-04-15*
