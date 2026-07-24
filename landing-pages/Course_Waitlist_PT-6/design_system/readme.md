# Cruz Creative — Design System

## Company & context

Cruz Creative is a social media and video content agency based in Tenerife, Canary Islands, serving brands that want to stand out on Instagram, TikTok, and YouTube. The brand personality is confident, direct, and results-obsessed — no fluff, no templates, no hand-holding. Tagline: **"Big ideas. Bold content. Zero fluff."**

There is one core product represented here: the **marketing website** (cruzcreative.net) — the agency's own site, used to sell its content services. No app, dashboard, or client portal was provided, so no additional product surfaces are included.

### Sources provided
- `uploads/Cruz-Creative-Brand-Guidelines.pdf` — official brand guidelines, v1.3, July 2026 (logo system, color palette, typography). Full text extracted to `scraps/brand-guidelines.txt`.
- `uploads/cruz-creative-logo-horizontal-darkbg.{png,svg}`
- `uploads/cruz-creative-logo-stacked-darkbg.{png,svg}`
- `uploads/cruz-creative-icon-darkbg.{png,svg}`

No codebase, Figma file, or existing website export was attached — this design system is built directly from the brand guidelines PDF and logo files. Component inventory and UI kit are therefore an **original, brand-appropriate build** (not a copy of an existing live site), sized to what a one-product marketing agency site needs.

## Font substitution — please confirm

The guidelines specify **Montserrat** (400/600/800) for all UI text. No font files were provided, so Montserrat was pulled from Google Fonts (exact family, official source) and embedded locally in `assets/fonts/`. This is a same-family match, not a substitute — no action needed unless you have licensed static files you'd prefer bundled instead.

**Poppins Black** is specified for the logo wordmark *only*, and the guidelines state it "does not appear anywhere else." Since the logo ships as a pre-outlined SVG/PNG (text converted to paths), Poppins was **not** installed as a webfont, and no CSS token references it — it isn't needed to render any live text. If a future need arises to set live text in Poppins, upload the real font files and add a token then.

## Icon substitution — please confirm

The brand guidelines don't define an icon system (they cover logo, color, and type only). [Lucide](https://lucide.dev) was used as a CDN-linked substitute — a neutral, thin-stroke (2px) icon set with wide coverage, tinted mint to match the accent color. See **Iconography** below. Flag if you have a preferred icon set or the agency has established icon usage on its live site.

---

## Content fundamentals

Source: Brand Guidelines, "Tone of Voice."

- **Voice**: punchy, imperative, outcome-focused — written like a bold creative director, not a corporate copywriter.
- **Sentence style**: short sentences, strong verbs, fragments are fine.
- **Lead with outcome, not service**: e.g. *"Stop guessing what to post,"* not *"We offer content planning."*
- **Address the reader directly**: second person — "you," "your."
- **Section structure**: Problem → Agitation → Solution.
- **CTAs are action-first and specific**: *"Plan My Content,"* *"Let's Make Reels"* — never "Learn More" or "Click Here."
- **Casing**: sentence case in body copy; hero/H1 often set in a mix of white + mint spans for emphasis (see `guidelines/type/hero-h1.card.html`).
- **Emoji**: none observed or specified — the tone is direct copy, not emoji-driven.
- **Numbers as proof**: stat call-outs like "9:16," "3x," "400K views" are part of the voice — the guidelines note these are candidates for a future secondary numerals typeface (see Typography below), though none is adopted yet.

## Visual foundations

- **Color**: Mint (`#A5F0B1`) is the single primary accent — used for the logo, primary CTA buttons, icon accents, tick marks, and the nav Contact button. **It is never used as a large background fill** — always used the way you'd use a color pop, not a wash. Dark backgrounds are near-black (`#0A0909`) with two lighter tints (`Surface #141212`, `Elevated #1E1A1A`) for layering cards and hover states on top of it. Light sections use off-white (`#F5F5F0`) and light grey (`#F0F0F0`), alternating for section rhythm.
- **Type**: One typeface system-wide — Montserrat. Hero/H1 and H2 share the same Extra Bold (800) weight; only size differs. Paragraphs are Regular (400); lists/bullets are SemiBold (600). No secondary display face is used (Space Grotesk was floated as a future idea for stat numerals only — not implemented).
- **Spacing**: no scale is defined in the guidelines; a 4px-based scale (`--space-1`…`--space-10`) and generous section padding (`clamp(64px, 8vw, 128px)`) were authored to match the bold, high-contrast, breathing-room feel implied by the brand's confident tone and large type scale.
- **Backgrounds**: flat color fields, no photography specified in the guidelines. No gradients, no repeating textures or patterns, no hand-drawn illustration style. Full-bleed color sections (dark → light → dark) are the primary rhythm device, not imagery.
- **Animation**: not specified. Given the "zero fluff" personality, foundations favor fast, no-bounce motion — `cubic-bezier(0.16, 1, 0.3, 1)` easing, ~120–200ms durations, no elastic/bounce curves.
- **Hover states**: buttons darken/lighten slightly rather than changing hue — primary mint button hovers to a slightly deeper mint; secondary (outlined) buttons fill with the `Elevated` tint; ghost/text links fade to 70% opacity.
- **Press states**: primary actions scale down subtly (`scale(0.97)`) on press — a snappy, confident click-down rather than a color change.
- **Borders**: thin (1px), low-contrast — `Elevated` color used as the border on dark surfaces; a soft translucent charcoal border on light surfaces. Borders define structure, not decoration.
- **Shadows**: used sparingly. Cards on dark backgrounds rely on the surface/elevated color steps rather than drop shadows for depth; a soft outer shadow (`--shadow-card`) exists for the rare case a card needs to lift off a busy background, but flat contrast is preferred over shadow depth.
- **Corner radii**: small on controls (6–10px), larger on cards and media blocks (16px), full pill on buttons and badges — echoing the mint outline "box" motif from the logo lockup.
- **Cards**: flat-filled (`Surface` or `Elevated`), 1px `Elevated`-colored border, 16px radius, no drop shadow by default. No colored left-border accent strips.
- **Transparency & blur**: used narrowly — the sticky header uses `rgba` + backdrop-blur so content scrolls underneath it; not used elsewhere as a general effect.
- **Imagery color vibe**: not specified in the guidelines (no photography included) — no imagery is invented here per design-system policy; UI kit media blocks are placeholder color fields with proof-stat overlays instead.
- **Layout rules**: sticky header on the marketing site; content capped at `--content-max-width: 1200px` with responsive side padding; no other fixed/floating elements specified.

## Iconography

No icon system is defined in the brand guidelines. [Lucide](https://lucide.dev) (CDN-hosted, `lucide-static`, thin 2px stroke, no fill) was used as a **substitute** — chosen for its neutral geometric style that doesn't compete with the bold Montserrat type. Icons are referenced directly from the CDN (`https://unpkg.com/lucide-static@latest/icons/<name>.svg`) via `<img>` tags and tinted mint with a CSS filter where used as accents — nothing is hand-drawn. No emoji or Unicode glyphs are used as icons anywhere in this system. **Flag to the agency**: confirm whether the live site already has an established icon set before shipping.

## Intentional additions

No component library, codebase, or Figma file was provided, so the component set below is an original, minimal build for a one-product marketing site (not copied from a specific source) — see the Components list below for the full inventory and reasoning per component.

---

## Index

**Root**
- `styles.css` — single global stylesheet entry point (imports everything under `tokens/`)
- `readme.md` — this file
- `SKILL.md` — Claude Code / Agent Skill-compatible packaging of this system

**Tokens** (`tokens/`)
- `colors.css` — primary accent, dark/light backgrounds, text/neutral, semantic aliases
- `fonts.css` — Montserrat `@font-face` (400/600/800)
- `typography.css` — type scale, weights, line-heights, tracking
- `spacing.css` — spacing scale, section rhythm, radii, borders, shadow, motion

**Assets** (`assets/`)
- `logos/` — horizontal, stacked, and icon-monogram lockups (dark-background versions, SVG + PNG)
- `fonts/` — Montserrat woff2 files (400/600/800)

**Guidelines** (`guidelines/`) — Design System tab specimen cards
- `colors/` — primary accent, dark backgrounds, light backgrounds, text & neutral (4 cards)
- `type/` — hero/H1, H2, body, list, eyebrow/button, logo wordmark (6 cards)
- `spacing/` — spacing scale, corner radii (2 cards)
- `brand/` — logo lockups, tagline (2 cards)

**Components** (`components/`) — reusable UI primitives, grouped by concern
- `buttons/Button` — primary/secondary/ghost pill CTA button
- `feedback/Badge` — eyebrow tag / proof-number pill
- `surfaces/Card` — content container for feature/testimonial/pricing blocks
- `forms/Input`, `forms/Textarea` — labeled form fields for the contact form
- `disclosure/Accordion` — FAQ disclosure row

**UI Kit** (`ui_kits/website/`)
- `index.html` — interactive single-page recreation of the marketing site (sticky nav with smooth-scroll, hero, services, work/results, FAQ accordion, working contact form, footer)
- `Header.jsx`, `Hero.jsx`, `Services.jsx`, `Work.jsx`, `FAQSection.jsx`, `ContactSection.jsx`, `Footer.jsx` — the individual screen sections, composed from the primitives above

**Templates** (`templates/website/`)
- `Website.dc.html` — the same marketing-site page as a Design Component template, for consuming projects to start a new build from (Design System tab → Starting Points / Templates)
