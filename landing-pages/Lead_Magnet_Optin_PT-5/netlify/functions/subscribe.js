// Netlify serverless function: adds a lead-magnet opt-in to MailerLite.
// Keeps the MailerLite API key server-side (never exposed to the browser).
//
// Requires an env var set in Netlify: Site settings -> Environment variables
//   MAILERLITE_API_KEY = <your MailerLite API token>

const LEAD_MAGNET_GROUP_ID = "193919489339819798";

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

  let firstName, email, website;
  try {
    const body = JSON.parse(event.body || "{}");
    firstName = (body.firstName || "").trim();
    email = (body.email || "").trim();
    // Honeypot field: hidden from real visitors via CSS, so only bots
    // that blindly fill every input tend to populate it.
    website = (body.website || "").trim();
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (website) {
    // Pretend success so bots don't learn the honeypot tripped.
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
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
