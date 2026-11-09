// PT-129: keep the bio page's "Latest" article card current.
//
// On each request for the bio page this reads https://www.cruzcreative.net/blog
// (newest first), takes the first article link, reads that article's title, share
// image and publish date, and swaps them into the card between the
// <!-- latest-article --> markers in bio/bio-cruz-creative.html.
//
// The result is cached on Netlify's CDN for an hour (stale for up to a day while it
// refreshes), so cruzcreative.net is read at most about once an hour per edge location.
// If anything fails or looks wrong (site down, slow, redirected, layout changed) the page
// is served exactly as deployed, with the static fallback card already in the HTML.

import type { Config, Context } from "@netlify/edge-functions";

const SITE = "https://www.cruzcreative.net";
const SECTION = "blog";
const START = "<!-- latest-article -->";
const END = "<!-- /latest-article -->";
const TIMEOUT_MS = 2500;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface Article {
  url: string;
  title: string;
  image: string;
  alt: string;
  date: string; // "Nov 2026", or "" when not found
}

type Fetcher = (url: string) => Promise<string>;

// Fetches a page and insists it is the page asked for. Framer can redirect by visitor
// language or location (for example to the homepage); a redirect anywhere else is an error.
const fetchText: Fetcher = async (url) => {
  const r = await fetch(url, {
    headers: {
      "user-agent": "CruzCreativeBio/1.0 (+https://bio.cruzcreative.net)",
      "accept-language": "en-GB,en;q=0.9",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!r.ok) throw new Error(`${url} returned ${r.status}`);
  const want = new URL(url).pathname.replace(/\/$/, "");
  const got = new URL(r.url || url).pathname.replace(/\/$/, "");
  if (got !== want) throw new Error(`${url} redirected to ${r.url}`);
  return await r.text();
};

const decode = (s: string) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const meta = (html: string, prop: string) => {
  const tag = html.match(new RegExp(`<meta[^>]+property="${prop}"[^>]*>`, "i"))?.[0];
  return tag ? decode(tag.match(/content="([^"]*)"/i)?.[1] ?? "") : "";
};

export async function getLatestArticle(get: Fetcher = fetchText): Promise<Article> {
  const list = await get(`${SITE}/${SECTION}`);
  const linkRe = new RegExp(`href="(?:\\.|https://www\\.cruzcreative\\.net)?/${SECTION}/([a-z0-9.-]+)"`, "i");
  const slug = list.match(linkRe)?.[1];
  if (!slug) throw new Error(`no article link on /${SECTION}`);
  const url = `${SITE}/${SECTION}/${slug}`;

  const page = await get(url);

  // The page must describe this article, not the site as a whole (e.g. a homepage served
  // in its place). Its share URL has to point back at the article.
  const ogUrl = meta(page, "og:url");
  if (!ogUrl.replace(/\/$/, "").endsWith(`/${SECTION}/${slug}`)) {
    throw new Error(`${url} has og:url "${ogUrl}"`);
  }

  const h1 = page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
  const title = decode(h1) || meta(page, "og:title").replace(/\s*\|\s*Cruz Creative\s*$/i, "");
  if (!title || /^Cruz Creative\b/i.test(title)) throw new Error(`no article title on ${url}`);

  let image = meta(page, "og:image");
  if (!image.startsWith("https://framerusercontent.com/")) throw new Error(`unexpected image on ${url}`);
  image = image.replace(/\?.*$/, "") + "?scale-down-to=1024";

  // Publish date: the first "Mon D, YYYY" in the visible text (the article header).
  const text = page.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "").replace(/<[^>]+>/g, " ");
  const d = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, (20\d\d)\b/);
  const date = d ? `${MONTHS[MONTHS.indexOf(d[1])]} ${d[2]}` : "";

  return { url, title, image, alt: title, date };
}

export function renderCard(a: Article): string {
  const meta = a.date ? `${esc(a.date)} · Read the article ↗` : "Read the article ↗";
  return `<a class="media-card" href="${esc(a.url)}">
        <div class="frame">
          <img src="${esc(a.image)}" alt="${esc(a.alt)}" width="1024" height="576" loading="lazy" />
          <span class="chip">Latest article</span>
        </div>
        <div class="meta"><strong>${esc(a.title)}</strong><span>${meta}</span></div>
      </a>`;
}

export function injectCard(html: string, card: string): string | null {
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) return null;
  return html.slice(0, a + START.length) + "\n      " + card + "\n      " + html.slice(b);
}

export default async (_req: Request, context: Context) => {
  const res = await context.next();
  if (res.status !== 200 || !(res.headers.get("content-type") ?? "").includes("text/html")) return res;

  const html = await res.text();
  const headers = new Headers(res.headers);
  headers.delete("content-length");
  headers.delete("etag"); // the body may differ from the deployed file

  let out = html;
  try {
    out = injectCard(html, renderCard(await getLatestArticle())) ?? html;
  } catch (err) {
    console.log(`latest-article: kept fallback card (${err instanceof Error ? err.message : err})`);
    // Cache the fallback briefly so a hiccup on cruzcreative.net doesn't stick for an hour.
    headers.set("netlify-cdn-cache-control", "public, s-maxage=300");
    return new Response(out, { status: 200, headers });
  }

  headers.set("cache-control", "public, max-age=0, must-revalidate");
  headers.set("netlify-cdn-cache-control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return new Response(out, { status: 200, headers });
};

export const config: Config = {
  path: ["/", "/bio-cruz-creative.html"],
  cache: "manual",
};
