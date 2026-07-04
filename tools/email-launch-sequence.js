#!/usr/bin/env node

// Cruz Creative — Email Launch Sequence Builder
// 6-email framework: Waitlist → Tease → Open Cart → Social Proof → Urgency → Last Call

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function buildSequence({ course, price, benefits, dates, signoff, earlyBirdPrice }) {
  const b = benefits.map((item) => `- ${item}`).join("\n");
  const displayPrice = earlyBirdPrice || price;
  const parsePrice = (p) => parseFloat(p.replace(/[^0-9.]/g, ""));
  const priceDiff = earlyBirdPrice
    ? (parsePrice(price) - parsePrice(earlyBirdPrice)).toFixed(0)
    : null;

  return [
    // ─── EMAIL 1: WAITLIST ───────────────────────────────────────────────
    // Send: 7 days before cart open | Length: 150 words max
    {
      type: "Waitlist",
      timing: "Send 7 days before cart open",
      date: dates.waitlist,
      subject: `Something I've been building — watch this space`,
      previewText: `This one's different.`,
      body: `Hey [First Name],

I've been quiet about this for a while. Not because nothing's happening — because I wanted to get it right before I said anything.

Next week I'm opening something new. It's for [ideal student — be specific, e.g. "content creators who want to build faster using AI without sounding like a robot"].

I'm not ready to share the full details yet. But if you've ever struggled with [biggest pain point this course solves], this is going to be worth your attention.

More in a few days. Keep an eye on your inbox.

Until then — what's your biggest AI content challenge right now? Hit reply and tell me. I read every one.

${signoff}`,
      ctaButtonText: `Reply and tell me your biggest AI content challenge`,
    },

    // ─── EMAIL 2: TEASE ──────────────────────────────────────────────────
    // Send: 3 days before cart open | Length: 200 words
    {
      type: "Tease",
      timing: "Send 3 days before cart open",
      date: dates.tease,
      subject: `[Specific result, e.g. "How one creator went from 4 hours to 40 minutes per post"]`,
      previewText: `The method behind it opens ${dates.cartOpen}.`,
      body: `Hey [First Name],

[Open with a concrete win. One specific result. Make it real — a number, a tool, a before/after. E.g.:

"Last month, one of our clients cut their content production time by 60% using a single AI workflow we built in an afternoon. No extra tools. No complicated setup. Just a smarter process."]

That's exactly what ${course} teaches.

In [X weeks / X hours of video / X modules], you'll learn:

${b}

This isn't theory. It's the exact [process / system / workflow] we use at Cruz Creative every day.

Cart opens ${dates.cartOpen}. Early bird pricing closes fast — I'm only holding it for [X hours / the first X students].

If you want first access and the best price, get on the early bird list now.

${signoff}

P.S. Questions before we open? Hit reply. I'll get back to you today.`,
      ctaButtonText: `Cart opens ${dates.cartOpen} — get on the early bird list`,
    },

    // ─── EMAIL 3: OPEN CART ──────────────────────────────────────────────
    // Send: cart open day | Length: 350 words
    {
      type: "Open Cart",
      timing: "Send on cart open day",
      date: dates.cartOpen,
      subject: `${course} is open. Here's everything inside`,
      previewText: `Early bird price — today only.`,
      body: `Hey [First Name],

We're open.

${course} is live right now. Here's everything you need to know.

WHAT YOU GET:

${b}

[Add 2–3 sentences expanding on the transformation. Be specific. E.g. "By the end of Module 2, you'll have a working AI content system you can use immediately — not a concept, an actual workflow. Most students get their first output the same day."]

WHO IT'S FOR:

This is for [ideal student]. Specifically: [2–3 bullet points describing them. E.g.:
- You're spending too many hours on content that barely performs
- You know AI can help but don't know where to start
- You want a repeatable system, not a one-off hack]

THE INVESTMENT:

Early bird: ${displayPrice}
Full price after [DATE/cutoff]: ${price}

[Guarantee: e.g. "If you go through the course and don't get [result] within [timeframe], I'll refund every cent."]
[Payment plan if applicable: "Or split it into [X] payments of [amount]."]

WHAT HAPPENS WHEN YOU ENROLL:

You get instant access to [platform]. All [X] modules. All [X] resources. Plus [bonus if applicable].

No waiting. No drip. Everything's there the moment you join.

Cart closes ${dates.cartClose}. Early bird price disappears with it.

${signoff}

P.S. Got a question before you join? Reply now. I'm checking email all day.`,
      ctaButtonText: `Get ${course} at early bird price →`,
    },

    // ─── EMAIL 4: SOCIAL PROOF ───────────────────────────────────────────
    // Send: 2 days after cart open | Length: 200 words
    {
      type: "Social Proof",
      timing: "Send 2 days after cart open",
      date: dates.socialProof,
      subject: `"[Paste a short result quote here — under 10 words]"`,
      previewText: `Real result. Real person. Here's the story.`,
      body: `Hey [First Name],

[Open with the full story or quote. Make it specific. One person, one result, one transformation. E.g.:

"[Name] came to us spending 6 hours a week on content. No system. No consistency. Three weeks after going through ${course}, she'd cut that to 90 minutes — and her engagement had doubled.

Her words: 'I finally feel like I'm in control of my content instead of it controlling me.'"]

That's what this course does. Not magic. Just a clear system, applied consistently.

[NAME] is one of [NUMBER] people already inside ${course}.

Still on the fence? Here's what I'd ask: what does it cost you to keep doing things the way you're doing them now?

${displayPrice}. Cart closes ${dates.cartClose}.

${signoff}

P.S. Any questions? Reply to this email. I'll answer personally.`,
      ctaButtonText: `Join [NUMBER] students already inside →`,
    },

    // ─── EMAIL 5: URGENCY ────────────────────────────────────────────────
    // Send: 24 hours before cart close | Length: 150 words max
    {
      type: "Urgency",
      timing: "Send 24 hours before cart close",
      date: dates.urgency,
      subject: `Early bird closes in 24 hours`,
      previewText: `After midnight, price goes up.`,
      body: `Hey [First Name],

24 hours.

The early bird price on ${course} — ${displayPrice} — closes tomorrow at midnight. After that, it goes up to ${price}.

That's a ${priceDiff ? `$${priceDiff}` : "[$ difference]"} difference for the exact same course.

You've seen what's inside. You know who it's for. You know what it delivers.

The only question is whether [the core outcome — e.g. "building a content system that runs in 90 minutes a week instead of 6 hours"] is worth acting on today.

If it is, here's your link.

${signoff}

P.S. No exceptions on the deadline. Midnight is midnight.`,
      ctaButtonText: `Lock in your early bird price before midnight →`,
    },

    // ─── EMAIL 6: LAST CALL ──────────────────────────────────────────────
    // Send: cart close day | Length: 150 words max
    {
      type: "Last Call",
      timing: "Send on cart close day",
      date: dates.cartClose,
      subject: `Closing tonight. No extensions.`,
      previewText: `Last chance to join ${course}.`,
      body: `Hey [First Name],

Tonight. That's it.

${course} closes at [TIME] and I won't reopen enrollment [until X / for the foreseeable future].

If you've been sitting on this — I get it. Big decisions take time. But the time is up.

${displayPrice}. Everything you've seen in these emails. Instant access. Closes tonight at [TIME].

I'm not going to list everything out again. You've read the emails. You know what it is.

This is the last time I'll mention it.

${signoff}`,
      ctaButtonText: `This is the last time I'll mention it →`,
    },
  ];
}

function formatOutput({ course, price, earlyBirdPrice, emails }) {
  const lines = [];

  lines.push(`# Email Launch Sequence: ${course}`);
  lines.push(`**Price:** ${price}${earlyBirdPrice ? ` | **Early Bird:** ${earlyBirdPrice}` : ""}`);
  lines.push(`**Generated:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  lines.push("");
  lines.push("> Edit `[BRACKETED]` placeholders before sending.");
  lines.push("");
  lines.push("---");
  lines.push("");

  emails.forEach((email, i) => {
    lines.push(`## Email ${i + 1} of 6 — ${email.type.toUpperCase()}`);
    lines.push(`**${email.timing}**`);
    lines.push(`**Send date:** ${email.date}`);
    lines.push("");
    lines.push(`**SUBJECT:** ${email.subject}`);
    lines.push(`**PREVIEW TEXT:** ${email.previewText}`);
    lines.push("");
    lines.push("**BODY:**");
    lines.push("");
    lines.push(email.body);
    lines.push("");
    lines.push(`**CTA BUTTON TEXT:** ${email.ctaButtonText}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}

async function main() {
  console.log("\n✦ Cruz Creative — Email Launch Sequence Builder");
  console.log("Waitlist → Tease → Open Cart → Social Proof → Urgency → Last Call\n");

  const course = await ask("Course name: ");
  const price = await ask("Full price (e.g. $497): ");
  const earlyBirdPrice = (await ask("Early bird price (press Enter to skip): ")).trim() || null;

  console.log('\nKey benefits — enter each one, press Enter. Type "done" when finished.');
  const benefits = [];
  while (true) {
    const b = await ask(`  Benefit ${benefits.length + 1}: `);
    if (b.trim().toLowerCase() === "done") break;
    if (b.trim()) benefits.push(b.trim());
  }

  console.log("\nLaunch dates — press Enter to skip any and fill in later.");
  const dates = {
    waitlist: (await ask("  Email 1 send date (7 days before cart open): ")).trim() || "[7 DAYS BEFORE CART OPEN]",
    tease: (await ask("  Email 2 send date (3 days before cart open): ")).trim() || "[3 DAYS BEFORE CART OPEN]",
    cartOpen: (await ask("  Cart open date: ")).trim() || "[CART OPEN DATE]",
    socialProof: (await ask("  Email 4 send date (2 days after cart open): ")).trim() || "[2 DAYS AFTER CART OPEN]",
    urgency: (await ask("  Email 5 send date (24 hours before cart close): ")).trim() || "[24 HOURS BEFORE CART CLOSE]",
    cartClose: (await ask("  Cart close date/time: ")).trim() || "[CART CLOSE DATE]",
  };

  const signoff = await ask("\nSign-off name (e.g. 'Ana' or 'The Cruz Creative Team'): ");

  rl.close();

  const emails = buildSequence({ course, price, earlyBirdPrice, benefits, dates, signoff });
  const output = formatOutput({ course, price, earlyBirdPrice, emails });

  const slug = course.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `launch-sequence-${slug}.md`;
  const outPath = path.join(__dirname, filename);

  fs.writeFileSync(outPath, output);

  console.log(`\n✓ Sequence written to tools/${filename}`);
  console.log("Edit [BRACKETED] placeholders before sending.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
