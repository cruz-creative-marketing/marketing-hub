# Cruz Creative — Team Email Signature

A single, on-brand email signature for everyone at Cruz Creative, plus a generator so nobody hand-edits HTML.

## How to use it

1. Open `index.html` in a browser.
2. Fill in your name, job title, email and (optionally) mobile/WhatsApp.
3. Pick a style:
   - **Bold**: near-black card with mint accents. Looks identical in light and dark inboxes. Use this by default.
   - **Clean**: no background, charcoal text with a mint edge. Lighter feel for long client threads.
4. Click **Copy signature** and paste it into Gmail, Outlook or Apple Mail. Step-by-step instructions are on the page.

The generator remembers your details in your own browser.

## What's in the signature

| Element | Source |
|---|---|
| Name (Montserrat 800) and title (uppercase, letter-spaced) | Brand Guidelines v1.3 typography |
| Mint `#A5F0B1` rule, labels and CTA pill | Primary accent, used as a pop, never a fill |
| Near-Black `#0A0909` card (Bold style) | Canonical dark background |
| Horizontal logo lockup, 160px wide | Guidelines name the horizontal lockup for email signatures; minimum width is 120px |
| Instagram / TikTok / YouTube / LinkedIn as text links | Same accounts as the bio page; text links never break when images are blocked |
| Optional profile photo, 88px square in a 2px mint frame | Echoes the logo's mint outline box. The frame is a padded mint table cell, so Outlook keeps it (Outlook ignores rounded corners and image borders) |
| Optional CTA button | Action-first copy, per tone of voice ("Book a discovery call", never "Learn more") |
| Optional tagline | "Big ideas. Bold content. Zero fluff." |

Montserrat is set first in the font stack. Most email clients don't load web fonts, so they fall back to Arial, which keeps the same proportions.

## Logo hosting

Email clients only show images from a public `https://` URL, and they don't support SVG. The signature logo lives in this repo and is served by the bio site:

- File: `bio/assets/email/cruz-creative-logo-signature@2x.png` (320×56, shown at 160×28 so it stays sharp on retina screens)
- Public URL: `https://bio.cruzcreative.net/assets/email/cruz-creative-logo-signature@2x.png`

Netlify publishes it whenever `bio/` changes on `main`. Don't rename or move the file: every signature already sent points at that URL. To update the logo, replace the file in place with the same name and size.

## Profile photos

Team headshots live next to the logo, served by the bio site:

- Folder: `bio/assets/email/team/`, one file per person named by first name (`james.jpg`, `agata.jpg`)
- Public URL: `https://bio.cruzcreative.net/assets/email/team/<first-name>.jpg`
- Size: 176×176 JPG, square, face centred, shown at 84×84 so it stays sharp on retina screens. Keep it under 30 KB.

The current `james.jpg` and `agata.jpg` are cropped from the AI hero images. Swap in real headshots any time by replacing the files with the same names.

To add a new team member: add their photo to the folder, add their name as a quick-pick button in `index.html` (the `chip` buttons) and to `PHOTO_PREVIEW` so the generator can preview it, then merge to `main` and confirm the bio site redeploys.

## Rules

- One signature for the whole team. Don't restyle it.
- Keep the logo as supplied. No resizing, recolouring or effects.
- No quotes, banners or extra images underneath.
- Send yourself a test email before switching it on.
