# Feature Research

**Domain:** Personal developer portfolio (one-pager, CRT/terminal aesthetic, 3-4 projects: web apps + Telegram bots)
**Researched:** 2026-04-15
**Confidence:** HIGH (feature landscape for portfolios and CRT UIs is well-established; only the mix is specific to this project)

---

## Complexity Key

- **S** = under 2h
- **M** = 2–8h
- **L** = 1+ day

## Feature Landscape

### Table Stakes (Users Expect These)

A 2026 developer portfolio that omits any of these reads as broken or abandoned within 10 seconds.

| Feature | Why Expected | Complexity | Notes |
|---|---|---|---|
| Clear "what I do" above the fold | Visitors leave in ~10s if they can't classify the owner | S | One line under the name: role + stack. Must be readable without scroll on mobile. |
| Name + identity | Recruiter / collaborator needs to know whose site they're on | S | ASCII-art name or plain H1 — both acceptable. |
| Projects section with real preview | "List of repo links" signals low effort | M | Mandatory — screenshot or video for web, chat mockup for bots. |
| Contact method (email or tg) | Otherwise the site has no call-to-action | S | `mailto:` + `tg://` + `github.com/...`. |
| GitHub link | De facto proof-of-work for devs | S | Footer + in About. |
| Mobile-usable layout | ~50%+ traffic from phones; CRT must not break | M | Scanlines/flicker must be tuned down on narrow screens. |
| Load under 3s on 4G | Over 3s = bounce, also hurts SEO | S | Vite static build; no heavy web fonts; inline critical CSS. |
| Crawler-friendly meta | LinkedIn/Twitter/Telegram previews + Google snippet | S | `<title>`, `meta description`, OG tags, Twitter card, favicon. |
| `prefers-reduced-motion` support | Accessibility + vestibular safety for flicker/scanlines | S | Disables flicker, scanline animation, typewriter. |
| Keyboard navigation | Accessibility baseline; also matches terminal vibe | S | Visible focus rings styled as CRT-block cursor. |
| WCAG AA contrast (or deliberate exemption) | Phosphor green on black passes easily; glow blur can kill it | S | Provide non-glow fallback; test with axe. |
| Working back/forward + anchors | Expected for any one-pager with hash nav | S | `#about`, `#projects`, `#contact` with `scrollIntoView`. |
| 404 / base-path correctness | GitHub Pages requires matching `base` in Vite config | S | Add `404.html` redirect for hash-routing safety. |

### Differentiators (Competitive Advantage)

These turn a portfolio from "fine" into "I'm sending this link to a friend." Chosen for alignment with the Core Value: *intentional artistic choice, not template*.

#### General portfolio differentiators

| Feature | Value Proposition | Complexity | Notes |
|---|---|---|---|
| Memorable hero / first frame | Decides whether the visitor reads or leaves | M | ASCII-art name is this project's version. |
| Project cards with role + year + stack chips | Recruiters scan for these signals in <5s | S | Non-negotiable metadata per card. |
| Case-study depth option (expand card) | Shows thinking, not just output | M | Can be deferred to v1.x — link out to a README is acceptable for v1. |
| Konami code easter egg | Shareable moment; dev-audience bait | S | Trigger a retro effect (green rain, CRT off animation). Low risk. |
| Copy-to-clipboard contact | Removes one friction step vs `mailto:` alone | S | Tiny win, near-zero cost. |
| Resume / CV download link | Recruiters will look for it | S | Optional — link to PDF or LinkedIn. |

#### CRT-specific differentiators (the whole point)

These are what make the aesthetic feel *intentional* vs "dark theme with a monospace font." Ranked by signal-to-effort.

| Feature | Value Proposition | Complexity | Notes / Risks |
|---|---|---|---|
| Faux command-prompt nav (`cd projects`, `cd about`, `cd contact`) | Single strongest "this is on purpose" signal; doubles as actual nav | M | Type-to-navigate input OR clickable faux-prompt links. Start with clickable; add typed input in v1.x. |
| Scanlines + phosphor glow (CSS) | Immediate visual identity; cheap | S | Pure CSS: `repeating-linear-gradient` + `text-shadow`. Must respect `prefers-reduced-motion`. |
| Subtle CRT flicker | Adds "it's alive" feel | S | 0.1–0.3% opacity wobble at 60fps; disabled under reduced-motion and on mobile. |
| Blinking block cursor next to headings / inputs | Free aesthetic, universally readable | S | `▋` with CSS `animation: blink 1s steps(1) infinite`. |
| Typewriter effect on hero + section headings | Sets pacing; feels like boot-time output | S | IntersectionObserver-triggered; skip on reduced-motion (render final text immediately). |
| Boot sequence on first visit | High-impact "welcome" moment | M | Fake BIOS/POST log → prompt. **Must** be skippable (click/key) and stored in `localStorage` so repeat visitors don't hate it. Skip entirely under reduced-motion. |
| ASCII-art hero name | Replaces the gradient-blob hero; is the anti-generic-AI move | S | Generate once with `figlet` or hand-tune; include non-ASCII fallback (plain H1) for narrow mobile. |
| ASCII-bordered project cards | Consistent visual language | S | Box-drawing chars (`┌─┐│└┘`) via borders or background grid. |
| `--help` / `ls`-style navigation output | Rewards curiosity; sharable | M | If a typed-input nav exists: `help`, `ls`, `whoami`, `cat about.txt`. v1.x candidate. |
| `cat about.txt` reveal pattern | Narrative reveal of About section | S | Even without typed input, label the About block as `$ cat about.txt` then show contents — gets 80% of the effect for 10% of the work. |
| Phosphor color variants (green #33FF33 / amber #FFB000) | Choose one deliberately; amber reads warmer and differentiates | S | Decision: pick **one** and commit. Toggle = anti-feature (see below). |
| "Connection established" status line | Footer flavor: `● online · last deploy YYYY-MM-DD` | S | Real deploy date from build-time injection. |
| Terminal-style scroll indicator | `[▓▓▓░░░░░] 37%` in a corner | S | Cute, low-cost; can be cut. |

### Anti-Features (Commonly Requested, Often Problematic)

#### Anti-features for any portfolio at this scale

| Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| Blog / CMS | "A dev site should have a blog" | 3-4 projects and no backlog of posts = ghost blog; maintenance burden; conflicts with static constraint | Link to GitHub / dev.to / external blog if one exists; otherwise omit |
| Testimonials row | Looks "professional" | For an individual with 3-4 projects, reads as fake/cringe; generic-AI-portfolio marker | Let the work speak; add a quote only if genuine and in an About paragraph |
| Newsletter signup | Pattern-matching from SaaS landings | No newsletter content; collects nothing; conflicts with "no backend" constraint | Link GitHub follow / Telegram channel if real |
| Hero stats ("+5 years · 10 projects · 4 bots") | Feels substantive | With only 4 items, stats are thin and feel padded | Omit; let the Projects grid be the stat |
| Pricing / services section | Portfolio → freelance lander drift | Not the goal (personal portfolio); adds confusion | "Open to work" sentence in Contact is enough |
| Theme toggle (light / system) | Accessibility / "user choice" | **Breaks CRT aesthetic entirely** — already excluded in PROJECT.md Out of Scope; listed here because LLMs love to add it | Commit to one CRT palette; honor `prefers-reduced-motion` instead |
| Parallax scroll / scroll-jacking | "Feels premium" | Fights CRT aesthetic (CRTs don't parallax); motion-sickness risk; kills mobile perf | Static sections; use typewriter for pacing instead |
| Mouse-follow gradient / radial spotlight | TikTok-popular effect in 2024-25 | Signature generic-AI-portfolio tell; conflicts with phosphor palette | Static CRT glow only |
| Gradient-blob / mesh-gradient hero | Default Shadcn/Framer look | **The #1 anti-reference for this project** — instantly reads as AI-generated | ASCII-art name + boot sequence |
| Emoji feature icons in a 3-col grid (🚀 ⚡ ✨) | Shadcn landing template default | Generic-AI tell; no emojis in a terminal aesthetic anyway | Omit feature grid entirely — not a SaaS |
| ✨ sparkle / "AI-powered" badges | AI-era filler | Direct generic-AI marker | Just don't |
| Animated-border / conic-gradient cards | 2024 CSS trend | Clashes with CRT; looks like a crypto landing | ASCII border or 1px phosphor border |
| Tilt-on-hover cards (`react-tilt`) | "Interactive" | Already overused; parallax-adjacent; mobile-useless | Subtle brightness or scanline-density change on hover |
| Filter / tag system on projects | "What if there are many?" | With 3-4 items, filters filter to 1-2 results — feels empty | Show all; if/when >8 projects, revisit |
| Live iframe embed of TG bot | "Show the real thing" | Telegram forbids iframe embedding; already Out of Scope | Static styled chat mockup rendered as React |
| 3D/WebGL hero (three.js globe, shader bg) | "Wow factor" | Payload 100kB+, drains battery, conflicts with <3s target and CRT purity | CSS-only effects |
| Custom cursor (JS-driven trail) | "Retro flavor" | Hurts accessibility and perf | Native cursor; use blinking block cursor inside text areas only |
| Confetti / celebration on contact click | Feels friendly | Undermines the restrained terminal tone | Terminal-style `$ message sent.` line |
| Loading spinner on first paint | "Loading states are good practice" | Static site renders instantly; spinner delays first content | Ship HTML with content; avoid client-only rendering for hero |

#### Generic-AI-look patterns to avoid by name

Owner's #1 concern. Every one of these present = -1 credibility point. Do **not** ship any.

1. **Gradient-blob hero** (radial / mesh / conic gradient backgrounds behind an H1)
2. **Glassmorphism cards** (backdrop-blur + 1px white border + semi-transparent bg)
3. **`✨ / 🚀 / ⚡` badge pills** near the hero ("✨ AI-powered", "🚀 Now shipping")
4. **3-column emoji feature grid** under the hero
5. **Testimonial rows** with fake headshots or star ratings
6. **Pricing section** on a personal site
7. **Stats strip** ("10+ projects · 5 years · 4 bots") with only 4 items to back it
8. **Mouse-follow radial light** (the `shadcn/ui` + `@paper-design` spotlight)
9. **Animated gradient text** on headings (`bg-clip-text` rainbow)
10. **"Trusted by" logo row** without actual clients
11. **Sticky CTA bar** on a one-pager
12. **Dark/light toggle** (listed in Out of Scope; incompatible with CRT)
13. **Hero with a Lottie animation**
14. **"Open to opportunities" gradient button** with a green dot (fine as plain terminal text, generic as a button)
15. **Shadcn default `Card` with 1px border and subtle shadow** — it's recognizable at a glance
16. **Auto-scrolling logo marquee** of tech stack icons
17. **Generic `Inter` / `Geist` sans** — CRT demands mono (e.g. `IBM Plex Mono`, `JetBrains Mono`, `VT323`, `Berkeley Mono`)

## Project Showcase Patterns

### Web app previews — verdict

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Static screenshot (PNG/WebP) | Cheapest; loads instant; zero CPU | Static = less impressive for dynamic apps | **v1 default.** Use WebP ~80kB each, `loading="lazy"`. |
| Autoplay silent `<video muted loop playsinline>` (MP4/WebM, 3-6s) | Shows motion / flow; GIF-like without the size | Larger payload (~300-800kB); autoplay battery drain; requires `prefers-reduced-motion` gate | **v1.x upgrade** for 1-2 hero projects. |
| Scripted iframe of live site | Maximum realism | Heavy; cross-origin restrictions; breaks mobile; breaks GitHub Pages sandboxing expectations | **No.** Too much cost, fragile. |
| Animated WebP / AVIF | Smaller than MP4 | Safari quirks historically | Acceptable alternative to video. |

**Recommendation:** poster-image by default, with optional `<video>` upgrade on hover or on intersection (swap `img` for `video`) for the 1-2 flagship web projects. All videos honor `prefers-reduced-motion` (stay on poster).

### Telegram bot previews — static React chat mockup (already decided)

Details that make a mockup feel like a real Telegram screenshot rather than a generic chat bubble:

- **Bot username** rendered as `@yourbot_bot` with the Telegram-blue checkmark only if the bot is actually verified — otherwise skip the checkmark (fake checkmarks read as scammy).
- **Avatar** — bot's real PFP, 40px, circular.
- **Timestamps** — realistic (`14:32`, not `just now`); same message cluster shares a single timestamp in the corner of the last bubble (matches Telegram behavior).
- **Message tail** on first bubble of a cluster only (Telegram omits the tail for consecutive messages from the same sender).
- **"typing…"** indicator shown briefly before bot response (animated three dots, CSS only) — adds life without JS state machines.
- **Reply-markup inline keyboards** — rendered as rounded-rectangle buttons under the message (grid layout, 1-3 per row) with the Telegram-blue background on hover.
- **User bubble on the right, bot bubble on the left**, correct shades (user = Telegram blue `#3390ec` or dark-theme `#8774e1`; bot = neutral).
- **Read receipts** (✓✓) on user messages — double check in Telegram blue.
- **Scroll into view** animation or staged reveal on intersection — one bubble at a time, 300ms apart (skip on reduced-motion).
- **Authentic commands** — `/start`, `/help` feel real; avoid scripted-demo-only commands.
- **Dark mode Telegram theme** — matches the CRT site better than light Telegram.
- **"Chat header"** bar with bot name + online status + back arrow — sells the screenshot illusion in the first glance.

The mockup is a React component receiving `{ messages: Message[] }` — easy to author per bot, no image assets to maintain.

### Project card metadata (every card)

| Field | Required | Notes |
|---|---|---|
| Title | yes | Project name. |
| Role | yes | "Solo", "Lead", "Contributor" — recruiters look for this. |
| One-line pitch | yes | What it does in <10 words. |
| Stack chips | yes | 3-5 tags max; plain text, no colored logos (generic-AI tell). |
| Year | yes | "2025" or "2024–2025". |
| Links | yes | Some subset of: **Demo** / **Repo** / **Bot** / **Case study**. |
| Status | optional | "Active", "Archived", "WIP" — helps context. |
| Preview | yes | Screenshot (web) or chat mockup (bot). |

### Filter / tag system — skip for v1

With 3-4 items, a filter UI has more chrome than content. **Revisit only if project count crosses ~8.**

## Contact Patterns

| Pattern | Complexity | Verdict | Notes |
|---|---|---|---|
| `mailto:` link | S | **Ship.** | Primary contact. Copy-to-clipboard sibling button. |
| `tg://resolve?domain=...` link | S | **Ship.** | Falls back to `https://t.me/<user>` on desktop without TG installed — use `https://t.me/<user>` as `href` for max compatibility; `tg://` hurts more than helps. |
| Copy-to-clipboard email button | S | **Ship.** | `navigator.clipboard.writeText` + terminal-style `$ copied.` confirmation. |
| GitHub profile link | S | **Ship.** | Footer + About. |
| QR code (mailto / tg) | S | Optional. | Cute for mobile-to-desktop handoff; can be generated at build time as SVG. Low priority. |
| Email obfuscation (JS join, entity-encoding) | S | **Skip.** | 2026 scrapers defeat this trivially; hurts copy-paste and accessibility. Clear address wins. |
| Contact form with backend | L | **Skip.** | Out of Scope (no backend). |
| Calendly / Cal.com embed | S | **Skip.** | Generic-recruiter-portal vibe; iframe drag. |

Recommended contact block render:
```
$ contact --list
  email    you@domain.dev       [copy]
  telegram @yourhandle          [open]
  github   github.com/yourname  [open]
```

## SEO / Shareability

For a one-pager, each of these is a single-line change but collectively decides whether the link previews well.

| Asset | Complexity | Notes |
|---|---|---|
| `<title>` | S | `Name — Role / Stack`. Under 60 chars. |
| `meta description` | S | 140-160 chars; same one-liner as hero. |
| Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`) | S | Mandatory for Telegram / LinkedIn / Slack previews. |
| Twitter card (`twitter:card=summary_large_image`) | S | Shares OG image. |
| Favicon (SVG + ICO) | S | Green block cursor `▋` as SVG — matches theme, scales to any size. |
| Apple touch icon | S | 180×180 PNG; same mark. |
| OG image (1200×630) in CRT theme | S–M | **Generate at build time** via a small HTML→PNG step (e.g. `satori` + `resvg`) OR hand-export once from a Figma/HTML file. Contents: ASCII name + one-line pitch + phosphor background + scanlines. Keep under 200kB. |
| `robots.txt` | S | Allow all; point at sitemap. |
| `sitemap.xml` | S | One URL (the root); still worth it. |
| Canonical URL | S | `<link rel="canonical">` — important because GitHub Pages may be reachable via multiple hostnames. |
| JSON-LD `Person` schema | S | `@type: Person`, name, url, sameAs: [github, telegram]. Helps Google Knowledge panel. |
| Lighthouse ≥ 95 on all four | S | Vite + no heavy deps makes this free. |

**Decision:** author the OG image as an HTML page inside the repo and screenshot it once (or generate at build via `satori`). Hand-drawn matches CRT theme better than any OG-image SaaS.

## Feature Dependencies

```
CRT palette + mono font (foundation)
    └── Scanlines + phosphor glow
            └── prefers-reduced-motion fallback (required)
    └── Blinking block cursor
    └── Typewriter effect
            └── prefers-reduced-motion fallback (required)
    └── Boot sequence
            ├── requires: localStorage "seen" flag
            ├── requires: skip-on-keypress handler
            └── requires: prefers-reduced-motion bypass
    └── ASCII-art hero
            └── requires: narrow-mobile fallback (plain H1)

Faux command-prompt nav (clickable)
    └── enhances → section-anchor routing
    └── enables v1.x → typed-input nav (--help, ls, cat)
            └── enables v1.x → konami code / easter eggs

Project cards
    └── requires: card metadata schema (role/stack/year/links)
    └── web preview → screenshot asset OR <video>
    └── bot preview → chat mockup React component
            └── requires: message schema
            └── enhances → staged reveal animation

SEO bundle
    └── OG image generation
            └── requires: build-time image step OR hand-export
    └── meta tags
    └── JSON-LD Person schema

Conflicts:
  Theme toggle  ✗  CRT aesthetic   (mutually exclusive — Out of Scope)
  Parallax      ✗  CRT aesthetic   (CRTs are flat; scroll-jacking breaks the metaphor)
  Live iframe   ✗  Telegram ToS     (platform forbids embedding)
  Filter UI     ✗  3-4 projects     (empty filter results)
```

### Dependency Notes

- **All motion features require `prefers-reduced-motion` fallback before ship** — non-negotiable for accessibility and vestibular safety.
- **Boot sequence requires `localStorage`** so repeat visitors skip it — otherwise it becomes hostile UX.
- **ASCII hero requires a plain-text fallback** for narrow mobile (ASCII wraps and looks broken under ~40 chars).
- **Typed-input nav (`--help`, `ls`, `cat`) enhances faux-prompt nav** but shouldn't block v1 — clickable faux-prompts get 80% of the aesthetic signal.
- **OG image generation has two viable paths** (build-time via `satori`, or hand-exported once) — pick one; don't build both.

## MVP Definition

### Launch With (v1) — Top CRT differentiators chosen

From the CRT list, these 5 deliver the strongest "intentional, not generic" signal per hour of work. They form v1 together with all Table Stakes.

1. **ASCII-art hero name** (S) — single biggest anti-generic-AI move; replaces the gradient-blob hero entirely. Justification: the first 200ms of first paint decide whether the visitor classifies the site as "AI template" or "made on purpose."
2. **Scanlines + phosphor glow + blinking block cursor** (S, grouped) — foundational CRT look; cheap; covers 60% of the aesthetic budget. Without these the site is just "dark theme + monospace."
3. **Faux command-prompt section nav** (`$ cd projects`, etc.) (M) — clickable (not typed yet). Turns navigation itself into a theme element — nothing else does this work.
4. **Typewriter reveal on hero + section headings** (S) — sets reading pace; makes the site feel like it's *running*, not just *rendered*. Low cost, high signal. Disabled under reduced-motion (text appears immediately).
5. **`$ cat about.txt` framing for the About section** (S) — narrative cue that the content is terminal output. Gets most of the "typed-nav" feel without requiring a parser.

**Deferred from v1:** full typed-input nav, boot sequence, konami code. Rationale: boot sequence is high-impact but also high-risk (annoys repeat visitors if localStorage fails); ship once the rest is stable.

### Full v1 Checklist

Table stakes:
- [ ] Three sections (About / Projects / Contact) with hash-anchor nav and working back/forward
- [ ] One-line pitch above the fold (role + stack)
- [ ] 3-4 project cards with full metadata (title, role, pitch, stack, year, links, preview)
- [ ] Web preview: static screenshot (WebP, lazy-loaded)
- [ ] Bot preview: static React chat mockup with realistic TG details (timestamps, typing indicator, inline keyboards, dark theme)
- [ ] Contact block: email (mailto + copy), telegram (t.me link), github
- [ ] Mobile layout verified at 360px
- [ ] Lighthouse ≥ 95 performance; <3s LCP on 4G
- [ ] Meta bundle: title, description, OG tags, Twitter card, favicon SVG, JSON-LD Person
- [ ] Hand-exported OG image in CRT theme (1200×630)
- [ ] `prefers-reduced-motion` disables scanline animation, flicker, typewriter
- [ ] WCAG AA contrast verified with glow on and glow off
- [ ] Keyboard navigation with visible focus
- [ ] `vite build` → GitHub Pages deploy workflow green
- [ ] Correct `base` path in `vite.config.ts` for repo-name subpath

CRT v1 differentiators:
- [ ] ASCII-art hero name (with plain-H1 mobile fallback)
- [ ] Scanlines + phosphor glow layer
- [ ] Blinking block cursor styling
- [ ] Typewriter on hero + section headings
- [ ] Faux command-prompt section nav (clickable)
- [ ] `$ cat about.txt` framing for About

### Add After Validation (v1.x)

- [ ] Boot sequence on first visit (skippable, localStorage-flagged) — trigger: v1 is stable, owner wants more "wow"
- [ ] Typed-input nav (`help`, `ls`, `cat about.txt`, `whoami`) — trigger: boot sequence in place, owner wants Easter-egg layer
- [ ] Konami code easter egg (green-rain Matrix effect) — trigger: typed-input nav shipped
- [ ] Autoplay silent `<video>` previews for 1-2 flagship projects — trigger: poster-only MVP feels too static
- [ ] QR code for mobile contact handoff — trigger: owner starts sharing live at events
- [ ] CRT-off shutdown animation on external-link clicks — trigger: bored after v1

### Future Consideration (v2+)

- [ ] Project filter / tag system — only if project count > 8
- [ ] Case-study sub-pages (per-project deep dives) — only if a real case-study pipeline emerges
- [ ] EN translation — only if non-RU audience materializes (currently Out of Scope)
- [ ] RSS feed of shipped projects — only if shipping cadence justifies it

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---|---|---|---|
| Hero one-liner ("what I do") | HIGH | LOW | P1 |
| Project cards with full metadata | HIGH | MEDIUM | P1 |
| Web preview (static screenshot) | HIGH | LOW | P1 |
| TG bot chat mockup (React) | HIGH | MEDIUM | P1 |
| Contact block (mailto / tg / github + copy) | HIGH | LOW | P1 |
| Mobile responsive CRT layout | HIGH | MEDIUM | P1 |
| Meta + OG + favicon bundle | HIGH | LOW | P1 |
| Hand-exported OG image | HIGH | LOW | P1 |
| `prefers-reduced-motion` gating | HIGH | LOW | P1 |
| ASCII-art hero name | HIGH | LOW | P1 |
| Scanlines + phosphor glow | HIGH | LOW | P1 |
| Blinking block cursor | MEDIUM | LOW | P1 |
| Typewriter on headings | HIGH | LOW | P1 |
| Faux command-prompt nav (clickable) | HIGH | MEDIUM | P1 |
| `$ cat about.txt` framing | MEDIUM | LOW | P1 |
| GitHub Pages deploy + base path | HIGH | LOW | P1 |
| Boot sequence (skippable) | HIGH | MEDIUM | P2 |
| Typed-input nav (`--help`, `ls`) | MEDIUM | MEDIUM | P2 |
| Konami code easter egg | LOW | LOW | P2 |
| Video previews for flagship projects | MEDIUM | MEDIUM | P2 |
| Case-study expansion per card | MEDIUM | MEDIUM | P2 |
| QR code contact | LOW | LOW | P3 |
| Project filter / tags | LOW | MEDIUM | P3 (skip unless >8) |
| CRT shutdown animation | LOW | LOW | P3 |
| Blog / CMS | — | HIGH | **Anti** |
| Testimonials | — | LOW | **Anti** |
| Theme toggle | — | MEDIUM | **Anti (conflicts with CRT)** |
| Newsletter | — | MEDIUM | **Anti** |
| Hero stats strip | — | LOW | **Anti (only 4 items)** |
| Parallax / scroll-jacking | — | MEDIUM | **Anti** |
| Mouse-follow gradient | — | LOW | **Anti (generic-AI tell)** |
| Gradient-blob hero | — | LOW | **Anti (#1 tell)** |
| Emoji 3-col feature grid | — | LOW | **Anti (generic-AI tell)** |
| Pricing section | — | LOW | **Anti** |

**Priority key:**
- **P1** — must ship in v1
- **P2** — add in v1.x after validation
- **P3** — defer / skip unless justified

## Competitor / Reference Analysis

Reference portfolios that successfully commit to a distinctive aesthetic (used for pattern extraction, **not** visual cloning):

| Pattern | Example class of sites | Our approach |
|---|---|---|
| Terminal-themed portfolios (e.g. `term.js` / `xterm.js`-powered) | Full typed shell on page load — every interaction is a command | We cherry-pick faux-prompt nav + `$ cat about.txt` framing, but **sections are still scrollable** — don't force typed input on first-time visitors |
| Brutalist dev portfolios | Raw HTML, Times New Roman, no styling beyond links | Shares the "intentional" ethos but rejects the CRT direction owner chose — we borrow *commitment to a look*, not the look itself |
| Shadcn / Geist-default portfolios | Gradient hero, `Inter`, emoji feature grid, testimonial row | **This is the anti-reference.** Every pattern on this list is something to avoid. |
| `tezis.111.88.153.18.nip.io` | (Project-specific anti-reference per CLAUDE.md §6) | Avoid visual patterns |
| `frontend-seven-omega-17.vercel.app` | (Project-specific anti-reference per CLAUDE.md §6) | Avoid visual patterns |

## Sources

- PROJECT.md for this project (`.planning/PROJECT.md`, 2026-04-15)
- Global CLAUDE.md §6 anti-generic-AI rules (user's private instructions)
- Telegram Bot API docs — reply markup, message formatting, inline keyboards (verified pattern-level; versions may have moved by 2026-Q2, re-check during implementation)
- WCAG 2.2 contrast guidelines (AA = 4.5:1 normal text)
- MDN `prefers-reduced-motion` media query
- Open Graph protocol spec; Twitter card spec
- Schema.org `Person` type

---
*Feature research for: personal developer portfolio with CRT/terminal aesthetic (Vite + React + TS, GitHub Pages, 3-4 projects mixing web apps and TG bots)*
*Researched: 2026-04-15*
