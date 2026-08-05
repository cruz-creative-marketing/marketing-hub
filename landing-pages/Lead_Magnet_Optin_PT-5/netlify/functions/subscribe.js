// Netlify serverless function: adds a lead-magnet opt-in to MailerLite.
// Keeps the MailerLite API key server-side (never exposed to the browser).
//
// Requires env vars set in Netlify: Site settings -> Environment variables
//   MAILERLITE_API_KEY   = <your MailerLite API token>
//   TURNSTILE_SECRET_KEY = <your Cloudflare Turnstile secret key>

const LEAD_MAGNET_GROUP_ID = "193919489339819798";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Verifies the Turnstile token server-side. This is the layer that catches
// headless-browser bots (real Chrome via Puppeteer/Playwright etc.) that
// otherwise clear the origin check and correctly skip the CSS-hidden
// honeypot, since they render the page like a genuine browser.
async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed: if the secret isn't configured, don't silently skip
    // verification — that would leave the site unprotected without anyone
    // noticing.
    return { ok: false, reason: "TURNSTILE_SECRET_KEY is not configured on this site" };
  }
  if (!token) {
    return { ok: false, reason: "Missing Turnstile token" };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteIp) params.append("remoteip", remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: params });
    const data = await res.json();
    if (!data.success) {
      return { ok: false, reason: "Turnstile verification failed", codes: data["error-codes"] };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: "Turnstile verification request errored: " + err.message };
  }
}

// Only accept submissions that actually came from our own page. Blocks
// scripts/bots that POST straight to this endpoint without loading the site.
const ALLOWED_ORIGINS = ["https://freeprompts.cruzcreative.net"];

// Simple email shape check — not exhaustive, just enough to reject junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const origin = event.headers.origin || event.headers.Origin || "";
  const referer = event.headers.referer || event.headers.Referer || "";
  const fromAllowedOrigin = ALLOWED_ORIGINS.some(function (allowed) {
    return origin === allowed || referer.indexOf(allowed) === 0;
  });
  if (!fromAllowedOrigin) {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  let firstName, email, hpContactRef, turnstileToken;
  try {
    const body = JSON.parse(event.body || "{}");
    firstName = (body.firstName || "").trim();
    email = (body.email || "").trim();
    // Honeypot field: hidden from real visitors via display:none, so only bots
    // that blindly fill every input tend to populate it. Field name is
    // deliberately obscure (not "website"/"url"/etc) since Safari ignores
    // autocomplete="off" and will autofill common-sounding hidden fields from
    // a user's saved Contact card, which was silently dropping real signups.
    hpContactRef = (body.hp_contact_ref || "").trim();
    turnstileToken = (body["cf-turnstile-response"] || "").trim();
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (hpContactRef) {
    // Pretend success so bots don't learn the honeypot tripped.
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const clientIp = event.headers["x-nf-client-connection-ip"] || "";
  const turnstileResult = await verifyTurnstile(turnstileToken, clientIp);
  if (!turnstileResult.ok) {
    return { statusCode: 403, body: JSON.stringify({ error: "Verification failed" }) };
  }

  if (!email || !EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "A valid email is required" }) };
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "MAILERLITE_API_KEY is not configured on this site" }),
    };
  }

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        email: email,
        fields: { name: firstName },
        groups: [LEAD_MAGNET_GROUP_ID],
      }),
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};