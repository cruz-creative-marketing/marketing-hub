# Handoff: Lead Magnet Opt-In + Thank-You Pages (Jira PT-5)

## Overview
The email-capture funnel for the "15 AI Prompts We Use on Real Client Brands" lead magnet.
Production URL: https://freeprompts.cruzcreative.net/
Two pages: opt-in at /free-prompts (index.html) and thank-you at thank-you.html (map to /free-prompts/thanks via a redirect rule if preferred).
Copy source: Cruz_Creative_Lead_Magnet_Funnel_PT-5 doc, Parts 2 + 3. Design base: the deployed PT-6 course waitlist page (same stripped format: no nav, no footer, one action).

## Files
- index.html — opt-in page (static, deployable)
- thank-you.html — thank-you page (static, deployable)
- Opt-In Page.dc.html / Thank You Page.dc.html — design-tool source prototypes
- assets/ — brand logo
- design_system/ — brand tokens + Montserrat woff2
- netlify.toml — deploy config (subscribe function expected at netlify/functions/subscribe, same as PT-6)

## Open items before go-live
1. Hero image on both pages: uploads/hero-agata.png.
2. Wire /.netlify/functions/subscribe (or Kajabi form embed) to apply tag lead-magnet-prompts → triggers instant PDF delivery email + Day 2/5/8/11 nurture sequence.
3. Delivery email sends from hello@cruzcreative.agency (page copy references this address).
4. Thank-you "For teams" card is the W18 tripwire slot — keep it as a distinct block so the €27 prompt-pack offer can swap in.
5. GA4: opt-in submit event (lead_magnet_optin) + thank-you page view event (lead_magnet_thankyou_view) are wired to G-452DCFWWE6; UTM the link-in-bio and homepage CTA separately.

## Design tokens
Colors: mint #A5F0B1 (accent only), near-black #0A0909 (bg), surface #141212, elevated #1E1A1A, white #FFFFFF, text #CCCCCC.
Type: Montserrat 800 headings / 600 UI / 400 body. Radii: 16px cards, 8px inputs, pill buttons. Motion: 120–200ms cubic-bezier(0.16,1,0.3,1).
Icons: Lucide via CDN (zap, mic, clapperboard, mail-check), tinted mint.
