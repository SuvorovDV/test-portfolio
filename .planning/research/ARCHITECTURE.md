# Architecture Research

**Domain:** Static single-page portfolio SPA (Vite + React + TypeScript, GitHub Pages)
**Researched:** 2026-04-15
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Evergreen)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    <CRTShell/>                        │   │
│  │  (scanlines overlay + CRT curvature + palette vars)  │   │
│  │                                                       │   │
│  │  ┌────────────────┐  runs once, then  ┌───────────┐  │   │
│  │  │ <BootSequence> │ ────────────────→ │  <main>   │  │   │
│  │  └────────────────┘                   └─────┬─────┘  │   │
│  │         (localStorage gated)                │        │   │
│  │                                             ▼        │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐│   │
│  │  │<AboutSection>│ │<ProjectsSect>│ │<ContactSection>││   │
│  │  │  #about      │ │  #projects   │ │  #contact      ││   │
│  │  └─────────────┘ └──────┬───────┘ └──────────────┘ │   │
│  │                         │                           │   │
│  │                         ▼                           │   │
│  │                 <ProjectCard/>  ─ (type switch) ─┐  │   │
│  │                                                  │  │   │
│  │                   ┌──────────────────────────────┘  │   │
│  │                   ▼                                 │   │
│  │       ┌──────────────────────┐  ┌───────────────┐  │   │
│  │       │  <WebAppPreview>     │  │<TelegramChat  │  │   │
│  │       │  (video muted loop)  │  │  Preview>     │  │   │
│  │       └──────────────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│      Static assets (Vite build) served by GitHub Pages       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ index.js │  │index.css │  │ fonts/   │  │ media/   │     │
│  │ (<50KB)  │  │ (<15KB)  │  │ woff2    │  │ mp4/webp │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `<CRTShell>` | Fixed viewport frame: background, scanlines overlay, curvature, palette CSS vars | Functional component wrapping `children`; injects two `aria-hidden` overlay `<div>`s |
| `<BootSequence>` | Play terminal boot once per visitor, skippable, hand focus to `<main>` on exit | Stateful component gated by `useBootShown()` localStorage hook |
| `<AboutSection>` | Render `#about` — bio, stack list, ASCII heading | Dumb semantic `<section aria-labelledby>` |
| `<ProjectsSection>` | Read `projects` data, map into `<ProjectCard>`s | Iterates `Project[]` from `src/data/projects.ts` |
| `<ContactSection>` | Links: mailto / t.me / github | Static `<ul>` of `<a>` |
| `<ProjectCard>` | Generic card frame (ASCII border, title, description, stack chips, link row, media slot) | Accepts `children` as media slot |
| `<WebAppPreview>` | Render screenshot `<img>` or `<video muted loop playsinline autoplay>` | Type-narrowed by `project.type === 'web'` |
| `<TelegramChatPreview>` | Styled mock of Telegram chat (bot avatar, messages, timestamps, reply keyboard) from `chatScript: Message[]` | Pure render of message array as styled bubbles |
| `<TypedText>` | Type characters one-by-one with caret; respects `prefers-reduced-motion` (renders full text instantly) | Effect-driven state; `reduce` → no animation |
| `<TerminalPrompt>` | Composes `user@host:~$` prompt + `<TypedText>` + `<Cursor>` | Layout primitive |
| `<Cursor>` | Blinking block (`▋`); respects reduced motion (static) | CSS `@keyframes blink` toggled by class |
| `useReducedMotion()` | Single source of truth for motion gating across ALL animated components | `matchMedia('(prefers-reduced-motion: reduce)')` + `change` listener |
| `useBootShown()` | Read/write `localStorage['portfolio:boot-shown']` | Returns `[shown, markShown]` tuple |
| `useActiveSection()` | Track which anchor is in view for nav highlighting | `IntersectionObserver` on 3 section refs |

## Recommended Project Structure

**Decision: flat layout (option a).** For ~10 components and 3 sections, feature-slicing adds ceremony without separation benefits — the boundary cost exceeds the cognitive savings. Sections share primitives (`<TypedText>`, `<Cursor>`, `<CRTShell>`), so a feature-sliced layout would immediately need a `shared/` escape hatch, which is the flat layout wearing a costume. Revisit only if the tree grows past ~25 components.

```
test-portfolio/
├── index.html                    # Vite entry; <title>, <meta>, <div id="root">
├── vite.config.ts                # base: '/test-portfolio/' for GH Pages
├── tsconfig.json
├── package.json
├── .github/workflows/deploy.yml  # gh-pages deploy
├── public/
│   ├── favicon.svg
│   └── media/                    # project screenshots, loops — referenced by absolute path
│       ├── projects/
│       │   ├── webapp-1.mp4
│       │   ├── webapp-2.webp
│       │   └── ...
│       └── og.png
└── src/
    ├── main.tsx                  # ReactDOM.createRoot; imports globals.css
    ├── App.tsx                   # <CRTShell><BootSequence/><main>...</main></CRTShell>
    ├── components/
    │   ├── CRTShell.tsx
    │   ├── CRTShell.module.css
    │   ├── BootSequence.tsx
    │   ├── BootSequence.module.css
    │   ├── AboutSection.tsx
    │   ├── AboutSection.module.css
    │   ├── ProjectsSection.tsx
    │   ├── ProjectsSection.module.css
    │   ├── ContactSection.tsx
    │   ├── ContactSection.module.css
    │   ├── ProjectCard.tsx
    │   ├── ProjectCard.module.css
    │   ├── WebAppPreview.tsx
    │   ├── TelegramChatPreview.tsx
    │   ├── TelegramChatPreview.module.css
    │   ├── TypedText.tsx
    │   ├── TerminalPrompt.tsx
    │   └── Cursor.tsx
    ├── hooks/
    │   ├── useReducedMotion.ts
    │   ├── useBootShown.ts
    │   └── useActiveSection.ts
    ├── data/
    │   └── projects.ts           # Project[] typed config
    ├── types/
    │   └── project.ts            # discriminated union types
    └── styles/
        ├── globals.css           # @font-face, CSS vars, reset, scanlines, a11y focus
        └── tokens.css            # :root { --phosphor-green, --phosphor-amber, ... }
```

### Structure Rationale

- **`components/` flat, no nesting:** 11 components total. Colocation of `Foo.tsx` + `Foo.module.css` keeps per-component assets together without folder-per-component overhead.
- **`hooks/` separate from `components/`:** Hooks are orthogonal concerns (motion, storage, observation). Keeping them isolated makes a11y/motion auditing a one-directory task.
- **`data/` + `types/` split:** `projects.ts` is content; `project.ts` type is reused by any future import (e.g., a generator script). Type-in-same-file is fine but separating makes the "replace content later" step obvious.
- **`styles/` for globals only:** Component styles live next to components (CSS Modules). `globals.css` + `tokens.css` are the *only* files that touch `:root` / `body` / `*`.
- **No `pages/`, no `features/`, no `lib/`:** Three sections do not need a router or a feature-slice. A `lib/` would be empty.
- **`public/media/`:** Vite copies as-is, path-stable across builds. Large binaries don't hit the JS bundle hash.

## Architectural Patterns

### Pattern 1: Discriminated Union for Project Data

**What:** Model `Project` as a TypeScript discriminated union on `type` so `<ProjectCard>` can safely narrow to the correct media preview.
**When to use:** Always, for this project — `web` and `telegram` projects share frame but diverge in media payload.
**Trade-offs:** +Compile-time exhaustiveness (missing `type` branch → error). -Slightly more type noise than a base interface with optional fields.

**Example:**
```typescript
// src/types/project.ts
export type Message = {
  from: 'user' | 'bot';
  text: string;
  ts: string;               // '14:32'
  replyKeyboard?: string[]; // button labels
};

export type WebProject = {
  type: 'web';
  id: string;
  title: string;
  description: string;
  stack: string[];
  media: { kind: 'video'; src: string } | { kind: 'image'; src: string; alt: string };
  liveUrl?: string;
  repoUrl: string;
};

export type TelegramProject = {
  type: 'telegram';
  id: string;
  title: string;
  description: string;
  stack: string[];
  chatScript: Message[];
  botUsername: string;      // '@foo_bot'
  botUrl: string;           // 'https://t.me/foo_bot'
  repoUrl: string;
};

export type Project = WebProject | TelegramProject;
```

```typescript
// src/components/ProjectCard.tsx
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      {project.type === 'web'
        ? <WebAppPreview media={project.media} />
        : <TelegramChatPreview script={project.chatScript} />}
      {/* link row */}
    </article>
  );
}
```

### Pattern 2: Motion Gate via Central Hook

**What:** Every animated component reads `useReducedMotion()` and short-circuits when `true`. No component owns its own `matchMedia` check.
**When to use:** Any project with more than one animation — prevents drift where component A respects `reduce` but component B forgot.
**Trade-offs:** +Single audit point. +Consistent behavior. -One indirection for tiny animations.

**Example:**
```typescript
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

// src/components/TypedText.tsx
export function TypedText({ text, speed = 40 }: { text: string; speed?: number }) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : '');
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, reduce]);
  return <span>{out}</span>;
}
```

### Pattern 3: CSS Custom Properties for Palette + Theme Swap

**What:** All phosphor colors live as CSS custom properties on `:root`. Future theme toggle = flip a class on `<html>`.
**When to use:** Any project where color tokens repeat across components.
**Trade-offs:** +Zero JS cost to theme. +Architecture supports toggle even if unimplemented. -IE11-incompatible (not a target).

**Example:**
```css
/* src/styles/tokens.css */
:root {
  --bg: #000;
  --phosphor: #00ff41;         /* green default */
  --phosphor-dim: #00b82e;
  --phosphor-glow: rgba(0, 255, 65, 0.45);
  --scanline-opacity: 0.18;
  --focus-ring: #fff200;       /* high-contrast against green+black */
  --focus-ring-width: 2px;
}
:root.theme-amber {
  --phosphor: #ffb000;
  --phosphor-dim: #c88400;
  --phosphor-glow: rgba(255, 176, 0, 0.45);
}
```

### Pattern 4: CSS Modules over Tailwind/vanilla global

**What:** Per-component styles in `Foo.module.css`, imported as `import styles from './Foo.module.css'`.
**When to use:** Small component counts where Tailwind's utility churn isn't justified and global CSS collisions are a risk.
**Trade-offs vs. Tailwind:** +Readable class names in devtools. +No build-chain plugin. +Plays well with ASCII-border pseudo-elements. -No utility composition; verbose for one-off tweaks.
**Trade-offs vs. vanilla global CSS:** +Automatic scoping — no BEM ceremony. +Dead-code elimination per component. -Slight bundler magic.
**Decision for this project:** CSS Modules. Tailwind's aesthetic nudges toward generic AI look (the exact anti-reference we're avoiding), and most styles here are bespoke (scanlines, ASCII borders, phosphor glow) — utility classes would be mostly `[box-shadow:...]` arbitrary values, defeating the point.

### Pattern 5: CRT Curvature via `border-radius` + `inset box-shadow`

**What:** Instead of SVG filter (`feDisplacementMap`), which is expensive and buggy in Safari, use a fixed-position overlay `<div>` with rounded corners and a massive inset shadow to fake curvature vignette.
**When to use:** When performance matters and pixel-perfect barrel distortion is not required.
**Trade-offs:** +Cheap (composited layer). +Works everywhere. -Not a true geometric distortion — edges stay straight. The vignette sells the illusion.

**Example:**
```css
/* src/components/CRTShell.module.css */
.shell {
  position: relative;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--phosphor);
  overflow: hidden;
}

/* Scanlines overlay */
.scanlines {
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 2px,
    rgba(0, 0, 0, var(--scanline-opacity)) 2px,
    rgba(0, 0, 0, var(--scanline-opacity)) 3px
  );
  mix-blend-mode: multiply;
}

/* Curvature + vignette */
.curvature {
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 9999;
  border-radius: 24px;
  box-shadow:
    inset 0 0 120px 40px rgba(0, 0, 0, 0.75),   /* vignette */
    inset 0 0 8px rgba(0, 255, 65, 0.15);       /* phosphor bloom */
}

/* Reduced-motion: drop scanlines entirely */
@media (prefers-reduced-motion: reduce) {
  .scanlines { display: none; }
}
```

## Data Flow

### Application Boot Flow

```
index.html
    ↓
main.tsx  (imports globals.css, tokens.css)
    ↓
<App/>
    ↓
useBootShown()  ──→ localStorage['portfolio:boot-shown']
    ↓
    ├── shown=false → <BootSequence/> (plays, marks shown, focuses <main>)
    └── shown=true  → <main/> directly
    ↓
<CRTShell>
   └── <main>
         ├── <AboutSection id="about"/>
         ├── <ProjectsSection id="projects"/>
         │     ↑
         │     └─ reads: import { projects } from 'src/data/projects.ts'
         │         ↓
         │         projects.map(p => <ProjectCard project={p}/>)
         │                             ↓
         │                     p.type === 'web'
         │                        ? <WebAppPreview media={p.media}/>
         │                        : <TelegramChatPreview script={p.chatScript}/>
         └── <ContactSection id="contact"/>
```

### State Management

```
No global store. State is local-only:

  <BootSequence>            ── useState + useBootShown + useReducedMotion
  <TypedText>               ── useState + useReducedMotion
  <Cursor>                  ── CSS animation + useReducedMotion class toggle
  <ProjectsSection>         ── useActiveSection (nav highlight, optional)

Browser persistence:
  localStorage['portfolio:boot-shown'] = '1'   (written once, read on mount)

Browser-native navigation:
  URL hash ←→ scroll position (browser handles #about, #projects, #contact)
```

### Key Data Flows

1. **Project rendering:** `src/data/projects.ts` (typed `Project[]`) → imported once by `<ProjectsSection>` → `.map()` → `<ProjectCard>` → type-switch → media component. Pure compile-time data; zero runtime fetch.
2. **Boot gate:** On mount, `useBootShown()` reads localStorage. If unset, `<BootSequence>` mounts, runs animation (or 1 frame under `reduce`), calls `markShown()`, and unmounts. Esc / any key / Skip-button dispatches the same exit path.
3. **Motion gate:** `useReducedMotion()` subscribes to `matchMedia` once; every animated leaf reads the boolean. Changing OS setting mid-session updates all animations live.
4. **Active-section highlight:** `useActiveSection()` attaches an `IntersectionObserver` to the three section refs; returns current `id`. Consumed by an (optional) sticky nav to underline the live anchor.

## Build-Order / Dependency Graph

```
                       ┌──────────────┐
                       │ tokens.css   │
                       │ globals.css  │
                       └──────┬───────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ┌───────────┐      ┌───────────┐      ┌──────────────────┐
    │ <Cursor>  │      │useReduced │      │ useBootShown     │
    └─────┬─────┘      │ Motion()  │      │ useActiveSection │
          │            └─────┬─────┘      └────────┬─────────┘
          └──────┬───────────┘                     │
                 ▼                                 │
          ┌────────────┐                           │
          │<TypedText> │                           │
          └─────┬──────┘                           │
                ▼                                  │
          ┌──────────────────┐                     │
          │ <TerminalPrompt> │                     │
          └──────┬───────────┘                     │
                 │                                 │
                 ▼                                 │
          ┌─────────────┐                          │
          │ <CRTShell>  │◄─────────────────────────┤
          └──────┬──────┘                          │
                 │                                 │
    ┌────────────┼────────────┐                    │
    ▼            ▼            ▼                    │
┌────────┐ ┌─────────┐ ┌──────────┐                │
│<About> │ │<Project │ │<Contact> │◄───────────────┘
│Section │ │ Section>│ │ Section> │
└────────┘ └────┬────┘ └──────────┘
                │
                ▼
         ┌───────────────┐        ┌─────────────────────┐
         │<ProjectCard>  │──────► │ src/data/projects.ts│
         └──────┬────────┘        │ src/types/project.ts│
                │                 └─────────────────────┘
      ┌─────────┴──────────┐
      ▼                    ▼
┌──────────────┐  ┌────────────────────┐
│<WebAppPreview│  │<TelegramChatPreview│
└──────────────┘  └────────────────────┘

LAST (decoration, requires everything else to land first):
   ┌──────────────────┐
   │ <BootSequence>   │ ── uses <TypedText>, <Cursor>, <TerminalPrompt>,
   └──────────────────┘    useBootShown, useReducedMotion
```

**Build order rule:** leaf-first. Ship primitives and hooks → shell → sections → cards → media → boot sequence. This keeps every intermediate commit renderable; you can screenshot progress at each layer.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1-10 projects | Current shape is fine — `projects.ts` stays human-editable |
| 10-50 projects | Split `data/projects.ts` into `data/projects/*.ts` re-exported by `index.ts`; consider virtualization if one-page scroll feels heavy |
| 50+ projects | Reconsider single-page — add a `/projects/:id` route (react-router), lazy-load detail pages. At this point, feature-slice layout may pay off |
| Multi-language | Extract strings to `data/i18n/{ru,en}.ts`; read via a tiny `useLocale()` hook. Out of scope for v1 |

### Scaling Priorities

1. **First bottleneck (likely):** Project media weight. Mitigation: `<video>` with `preload="metadata"`, WebP/AVIF screenshots, keep loops < 500KB each. If the page hits > 2MB, lazy-load off-screen project cards with `loading="lazy"` on images and an `IntersectionObserver` for videos.
2. **Second bottleneck:** Self-hosted terminal font (often 80-150KB per weight). Mitigation: subset to Latin + Cyrillic + box-drawing glyphs; `font-display: swap`; single weight.

## Performance Budget

| Asset | Budget | Notes |
|-------|--------|-------|
| JS (gzipped) | < 50 KB | React 18 + minimal app ≈ 45 KB; no extra libs |
| CSS (gzipped) | < 15 KB | CSS Modules + globals; lean |
| Self-hosted font (woff2, subset) | < 40 KB | One weight (regular); Latin+Cyrillic+box-drawing |
| HTML shell | < 3 KB | single `index.html` |
| Page weight before project media | < 300 KB | sum of above + favicon |
| LCP on simulated 3G | < 1.5 s | first section heading is the LCP candidate |
| CLS | 0 | reserve media aspect-ratio boxes explicitly |
| TBT | < 100 ms | no hydration cost, React 18 is enough |

### What to cut first if over budget

1. Boot sequence — pure decoration; largest optional code path.
2. Flicker / glow animations — drop keyframes, keep static glow.
3. Self-hosted font — fall back to system monospace stack (`ui-monospace, "SF Mono", Consolas, monospace`) — saves ~30-40 KB instantly.
4. Curvature overlay — pure CSS, cheap, but if vignette causes paint cost on mobile, simplify to border-radius only.
5. Scanlines — last to cut (core aesthetic). If cut, drop `mix-blend-mode: multiply` first (expensive on low-end GPUs).

## Accessibility Architecture

**Central rule:** Every motion-bearing component **must** gate its animation behind `useReducedMotion()`. No exceptions. Audit = grep for `@keyframes`, `transition`, `animation`, `setInterval` in `src/components/` and verify each call-site reads the hook or has a `@media (prefers-reduced-motion: reduce)` kill switch.

| Concern | Implementation |
|---------|----------------|
| Semantic HTML | `<main>` wraps all sections; each `<section aria-labelledby="about-heading">` pairs with a unique `<h2 id="about-heading">`. Headings flow h1 (site title in `<BootSequence>` or top of `<main>`) → h2 (sections) → h3 (project titles). No level skips. |
| Scanlines / curvature overlays | `aria-hidden="true"`, `pointer-events: none`, not in tab order |
| Focus ring | `outline: var(--focus-ring-width, 2px) solid var(--focus-ring, #fff200); outline-offset: 2px;` — bright yellow (#fff200) pairs against both green and amber phosphor, AA-compliant on black. Applied to `:focus-visible` globally in `globals.css`, never removed. |
| Keyboard | All links reachable via Tab; `<BootSequence>` listens for Esc / Enter / any keydown; Skip button is a real `<button>` |
| Focus return after boot | On boot end, call `mainRef.current?.focus()` with `<main tabIndex={-1}>` so keyboard users land at content, not scroll to top with no focus |
| Reduced motion | `<TypedText>` renders full string instantly; `<Cursor>` stays solid; `<BootSequence>` collapses to a single frame; scanlines `display: none` |
| Telegram chat a11y | Messages rendered as DOM text (not screenshots). Structure: `<ol role="log" aria-label="Пример диалога с ботом">` > `<li><strong>Бот:</strong> текст <time>14:32</time></li>`. Screen readers read the conversation naturally. |
| Contrast | Default `#00ff41` on `#000` = 17.5:1 (AA/AAA). Avoid thin-weight phosphor glow as the only contrast cue. Provide non-glow fallback via `@media (prefers-contrast: more)` that disables text-shadow. |
| `<video>` previews | `muted` (required for autoplay), `playsinline` (iOS), `autoplay`, `loop`, `aria-label="Превью {projectTitle}"`. No audio means no accessibility regression. Poster frame set to prevent blank first paint. |
| Language | `<html lang="ru">`; if stack chips or code snippets include English, mark them `lang="en"` inline |

## Browser Support

**Target:** evergreen — last 2 versions of Chrome, Firefox, Edge, Safari (desktop + iOS). No IE, no legacy Edge.

| Feature used | Status 2026-04 | Notes |
|--------------|----------------|-------|
| CSS custom properties | Universal | — |
| `@media (prefers-reduced-motion)` | Universal | — |
| `@media (prefers-contrast)` | Chrome/FF/Safari ✓ | — |
| `100dvh` | Universal | use `dvh` not `vh` to avoid iOS Safari address-bar jump |
| `mix-blend-mode` | Universal | test on low-end Android for paint cost |
| `backdrop-filter` | Universal in 2026 | only used if needed for a chrome layer; not core |
| `<video autoplay muted playsinline loop>` | iOS Safari requires ALL FOUR attributes | verify on real device |
| `IntersectionObserver` | Universal | no polyfill |
| CSS Modules (build-time) | Vite-native | — |
| `font-display: swap` | Universal | — |

**Safari-specific gotchas:**
- iOS Safari autoplay: `muted playsinline` are non-negotiable; without them, video shows play button instead of playing.
- `100vh` on iOS changes as the address bar shows/hides — use `100dvh`.
- `mix-blend-mode: multiply` on a full-screen fixed overlay can be expensive on older iPhones — measure on iPhone 12 equivalent.

## Boot Sequence Architecture

**Lifecycle:**
```
App mount
    ↓
useBootShown() reads localStorage['portfolio:boot-shown']
    ↓
    ├─ '1' exists → skip <BootSequence>, render <main> directly
    └─ unset     → mount <BootSequence>
                       ↓
                    useReducedMotion()
                       ↓
                       ├─ reduce=true  → render final frame (text fully typed), wait one RAF, call onDone()
                       └─ reduce=false → animate: POST... MEMORY CHECK... BOOT COMPLETE
                       ↓
                    Exit triggers (any of):
                       - animation completes
                       - keydown (Esc, Enter, or any key)
                       - click on Skip <button>
                       ↓
                    onDone():
                       1. markShown() → localStorage['portfolio:boot-shown'] = '1'
                       2. unmount <BootSequence>
                       3. mainRef.current?.focus() — returns focus to <main tabIndex={-1}>
```

**Exit contract:**
- `<BootSequence>` accepts `onDone: () => void`.
- Keydown listener attached to `window` with `{ passive: true }`, cleaned up on unmount.
- Skip button is the last focusable element in the sequence (so Tab from entry reaches it immediately).

**localStorage key:** `portfolio:boot-shown` (namespaced, string value `'1'`). Clearing storage re-shows the sequence — deliberate, useful for demoing.

**Cheat code:** visiting `?boot=1` query param resets the flag and re-plays the boot — handy for showcase. Read in `useBootShown()` on mount:
```typescript
if (new URLSearchParams(location.search).get('boot') === '1') {
  localStorage.removeItem('portfolio:boot-shown');
}
```

## Anti-Patterns

### Anti-Pattern 1: Per-component `matchMedia` calls for reduced motion

**What people do:** Each animated component does its own `window.matchMedia('(prefers-reduced-motion: reduce)')` check inline.
**Why it's wrong:** Drift. One component gets updated, another doesn't. No central audit point. Adding a new animation risks forgetting the check entirely.
**Do this instead:** One `useReducedMotion()` hook. Every component reads it. Audit = 1 grep.

### Anti-Pattern 2: Iframe-ing Telegram bot previews

**What people do:** `<iframe src="https://t.me/foo_bot">` hoping to live-embed a bot.
**Why it's wrong:** Telegram blocks embedding via `X-Frame-Options: DENY`. It renders nothing. Also impossible to control the chat script for a deterministic demo.
**Do this instead:** DOM-rendered static chat mockup from `chatScript: Message[]`. Screen-reader friendly, styleable, deterministic.

### Anti-Pattern 3: Feature-sliced layout for 3 sections

**What people do:** Spin up `src/features/about/`, `src/features/projects/`, `src/features/contact/` with internal `components/`, `hooks/`, `types/` per feature.
**Why it's wrong:** Creates cross-feature shared state (`<CRTShell>`, `<TypedText>`, `<Cursor>` are used by every section) that immediately forces a `shared/` folder — which is the flat structure with extra directories. Cognitive overhead without separation benefit.
**Do this instead:** Flat `components/` + `hooks/`. Revisit only if the component count crosses ~25.

### Anti-Pattern 4: Tailwind for CRT aesthetic

**What people do:** Reach for Tailwind because it's the reflex for "React project in 2026".
**Why it's wrong:** Two problems. (1) Most CRT styles (scanlines, ASCII borders, phosphor glow, `mix-blend-mode`) are arbitrary-value utilities — verbose and unreadable. (2) Tailwind's defaults (rounded-lg, shadow-md, gradient utilities) nudge toward the generic-AI aesthetic the brief explicitly forbids.
**Do this instead:** CSS Modules + CSS custom properties.

### Anti-Pattern 5: Pixel-perfect CRT via SVG `feDisplacementMap`

**What people do:** Apply `filter: url(#barrel-distortion)` with `feDisplacementMap` for "real" CRT curvature.
**Why it's wrong:** Expensive (forces a full composite per frame on the filtered subtree). Buggy/inconsistent in Safari. Breaks text-selection hit-boxes. Kills fonts' subpixel rendering.
**Do this instead:** `border-radius` + inset `box-shadow` vignette (see Pattern 5). Cheap, composited, universal.

### Anti-Pattern 6: Autoplay video without all four attributes

**What people do:** `<video autoplay loop src="...">` — forgets `muted` and `playsinline`.
**Why it's wrong:** iOS Safari refuses to autoplay; shows a play button overlay instead. Desktop browsers with autoplay-block also refuse. UX collapses to "click to play" which defeats the preview-at-a-glance value.
**Do this instead:** Always `<video autoplay muted loop playsinline preload="metadata">`. All four. No exceptions.

### Anti-Pattern 7: Rendering Telegram chat as a screenshot image

**What people do:** Exports chat mockup from Figma as PNG, drops `<img src="tg-chat.png">`.
**Why it's wrong:** Inaccessible (screen readers get `alt` at best, no structural semantics). Doesn't scale — you re-export every content edit. Heavy — a 300×600 PNG is often 80-200 KB.
**Do this instead:** `<TelegramChatPreview>` React component rendering `chatScript: Message[]` into semantic DOM. A11y-friendly, lightweight, content edits are a code change.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `vite build` outputs `dist/`; GH Actions workflow publishes to `gh-pages` branch | `vite.config.ts` must set `base: '/test-portfolio/'` to match repo name; without it, assets 404 on Pages |
| GitHub (repo links) | Static `<a href="https://github.com/...">` in project cards + Contact section | `rel="noopener noreferrer"` on `target="_blank"` links |
| Telegram (bot links + contact) | `tg://resolve?domain=...` or `https://t.me/...` | `t.me` is safer — works without Telegram installed |
| Email | `mailto:` link in Contact section | No JS validation — plain anchor |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `data/projects.ts` ↔ `<ProjectsSection>` | Compile-time `import` | Data is read-only; no runtime mutation |
| `types/project.ts` ↔ everything consuming Project | Type import | Single source of truth for Project shape |
| `hooks/*` ↔ `components/*` | React hook call | One-way: components read hooks, never inverse |
| `styles/tokens.css` ↔ components | CSS custom property lookup | Components never hard-code palette values |
| `<BootSequence>` ↔ `<main>` | `onDone` callback + `mainRef.focus()` | Unidirectional handoff, no shared state |

## Sources

- Vite docs (2026) — `base` config for GitHub Pages static deploy.
- React 18 docs — `useSyncExternalStore` is overkill here; plain `useState` + `useEffect` for media queries is correct.
- MDN — `prefers-reduced-motion`, `prefers-contrast`, `IntersectionObserver`, `<video>` autoplay policy.
- WebKit / Safari release notes — iOS video autoplay requires `muted` + `playsinline`.
- WCAG 2.2 — contrast (1.4.3), focus visible (2.4.7), reduced motion (2.3.3).
- Telegram docs — no iframe embedding supported; `t.me` deep-links are the canonical integration.
- Observations on CRT CSS — community consensus that SVG `feDisplacementMap` is too costly; inset-shadow vignette is the pragmatic pick.

---
*Architecture research for: Vite + React + TypeScript portfolio SPA*
*Researched: 2026-04-15*
