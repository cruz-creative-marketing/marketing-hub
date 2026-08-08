// Blocks page requests carrying User-Agent strings that no real 2026 visitor
// would ever send. This is separate from (and runs earlier than) the
// Turnstile/honeypot/origin checks on /subscribe — those only protect the
// form submission itself, not a bot simply *loading* the page, which is
// what's been inflating GA4 pageview/session stats with fake traffic.
//
// Signatures below were pulled directly from the freeprompts GA4 report:
// Internet Explorer (discontinued 2022) and Camino (discontinued 2013) were
// showing up as top-6 browsers, "BeOS" as a top OS, and a chunk of traffic
// with no User-Agent at all — none of that is a real human in 2026.
//
// Deliberately narrow: this only blocks unambiguous dead/spoofed browser
// signatures, not generic "looks like a bot" heuristics, so it won't catch
// legitimate crawlers (search engines, social link-preview bots) that you
// may still want rendering your page.

const DEAD_OR_FAKE_UA_PATTERNS = [
  /MSIE \d/i,       // Internet Explorer (old-style UA)
  /Trident\/\d/i,   // Internet Explorer (compatibility-mode UA)
  /Camino/i,        // Discontinued 2013
  /BeOS/i,          // No modern real-world usage
  /^Mozilla\/5\.0 Mozilla Compatible Agent$/i, // generic scraper-library default UA
];

export default async (request, context) => {
  const ua = request.headers.get("user-agent") || "";

  const isMissing = ua.trim().length === 0;
  const isDeadOrFake = DEAD_OR_FAKE_UA_PATTERNS.some((pattern) => pattern.test(ua));

  if (isMissing || isDeadOrFake) {
    return new Response("Forbidden", { status: 403 });
  }

  return context.next();
};

export const config = {
  path: "/*",
};
