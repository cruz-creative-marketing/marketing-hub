# Handoff: Course Waitlist Page (Jira PT-6)

## Overview
A single-purpose course waitlist landing page for Cruz Creative's "AI for Content Creators" course. Its only job is collecting emails until the October cart open. Suggested URL: /course-waitlist. Per the Jira ticket: build in Framer in the same stripped format as the opt-in page (no nav, one action), wire the form to Kajabi with the `course-waitlist` tag, and fire a GA4 event on submission.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior, not production code to copy directly. Recreate this design in the target environment (Framer, per the ticket) using its native components. `Course Waitlist Page.dc.html` is the design source; the `_ds/` folder holds the brand tokens and stylesheets it references.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and copy. Recreate pixel-perfectly.

## Screen: Course Waitlist
Single centered column on a near-black page. Column max-width 640px, centered, text-align center. Page padding: clamp(40px, 6vw, 72px) top, 24px sides, 80px bottom. Vertical order:

1. **Logo** — Cruz Creative horizontal dark-bg logo (`assets/cruz-creative-logo-horizontal-darkbg.svg`), height 34px, margin-bottom clamp(48px, 7vw, 88px).
2. **Eyebrow badge** — "Coming this autumn" in the design system's Badge component (mint pill, uppercase).
3. **Headline (H1)** — "AI for Content Creators: the practical system, from an agency that uses it daily." Montserrat 800, clamp(34px, 5vw, 52px), line-height 1.1, letter-spacing -0.01em, white (#FFFFFF) with "the practical system" in mint (#A5F0B1). Margin-top 28px.
4. **Subheadline** — "8 modules. 40+ lessons. The complete workflow we use to produce client content with AI: prompting, platform content, video, automation, strategy." Montserrat 400, clamp(17px, 2vw, 20px), line-height 1.6, #CCCCCC, max-width 560px, margin-top 24px.
5. **Hero image** — 16:9, width 100% (max 640px), border-radius 16px, object-fit cover. Asset: `uploads/hf_20260722_112807_d6f68f83-3d9f-42b4-9dac-6b15608f435e.png`. Margin-top clamp(32px, 4vw, 48px).
6. **Benefit cards** (3, stacked, gap 16px, max-width 520px, left-aligned, margin-top clamp(36px, 5vw, 56px)). Each: background #141212, 1px border #1E1A1A, border-radius 16px, padding 20px 22px, flex row gap 16px. Icon: Lucide (target / badge-percent / zap), 24px, tinted mint. Text: Montserrat 600 16px/1.55, lead phrase white, remainder #CCCCCC:
   - "First access when doors open. The waitlist hears before anyone else."
   - "Early-bird pricing, waitlist only. A meaningful discount that disappears 72 hours after launch."
   - "Built from real client work. Every lesson field-tested on live brands, not theory."
7. **Video block** — label "Watch: what's inside the course" (13px, 600, uppercase, letter-spacing 0.12em, mint, centered), then a 16:9 YouTube embed (video ID `C0uUd59VhXE`), border-radius 16px, 1px border #1E1A1A. Implemented as click-to-play: YouTube thumbnail + centered 72px mint circle play button (dark scrim rgba(10,9,9,0.25)); click swaps in the iframe with autoplay. Max-width 640px, margin-top clamp(36px, 5vw, 56px).
8. **Form** — max-width 520px, column, gap 18px, margin-top clamp(36px, 5vw, 56px). Two labeled inputs (First name, Email — label 13px/600/uppercase #CCCCCC; input: background #141212, 1px border #1E1A1A, radius ~8px, 14px 16px padding, 16px white text; focus border mint). Submit: pill button, mint fill, near-black text, Montserrat 600 18px, padding 18px 32px, centered horizontally (not full width).
9. **Trust line** — "No spam, no daily countdown emails. We'll tell you when it matters." 14px, #CCCCCC at 75% opacity, margin-top 20px.

**Deliberate omission: no pricing anywhere on the page** (per ticket — early-bird numbers stay unpublished until launch week).

## Interactions & Behavior
- Form submit: prevent default → replace form with success card (background #141212, 1px mint border, radius 16px, padding 32px 28px, centered): "You're on the list." (800, 22px, white) + "First access and early-bird pricing land in your inbox before anyone else hears a word." (16px/1.6, #CCCCCC). Trust line stays visible.
- **Production wiring (from the ticket):** form posts to Kajabi with tag `course-waitlist` (this tag is the Gate C metric — must be a cleanly filterable segment); fire a GA4 event on submission.
- Video: thumbnail facade → click loads YouTube iframe with autoplay (use youtube-nocookie.com, referrerpolicy="origin").
- Button hover: mint → #8FE39C; press: scale(0.97). Input focus: border-color mint. Motion: 120–200ms, cubic-bezier(0.16, 1, 0.3, 1).

## State Management
- `submitted: boolean` — toggles form vs success card.
- `videoPlaying: boolean` — toggles thumbnail facade vs iframe.

## Design Tokens
Colors: mint #A5F0B1 (accent only, never large fills), near-black #0A0909 (page bg), surface #141212, elevated #1E1A1A (borders/cards), white #FFFFFF, text-on-dark #CCCCCC.
Type: Montserrat only — 800 headings, 600 UI/bullets, 400 body (woff2 files in `_ds/.../assets/fonts/`).
Radii: 16px cards/media, ~8px inputs, full pill buttons/badges. Borders 1px #1E1A1A. No shadows, no gradients.

## Assets
- `assets/cruz-creative-logo-horizontal-darkbg.svg` — brand logo
- `uploads/hf_20260722_112807_d6f68f83-3d9f-42b4-9dac-6b15608f435e.png` — hero image
- Lucide icons via CDN: target, badge-percent, zap (https://unpkg.com/lucide-static@latest/icons/<name>.svg), tinted mint
- YouTube video: https://youtu.be/C0uUd59VhXE

## Files
- `Course Waitlist Page.dc.html` — the design prototype (template + logic)
- `_ds/cruz-creative-design-system-.../` — brand tokens (colors.css, fonts.css, typography.css, spacing.css), fonts, component bundle
