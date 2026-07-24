// Netlify serverless function: adds a lead-magnet opt-in to MailerLite.
// Keeps the MailerLite API key server-side (never exposed to the browser).
//
// Requires an env var set in Netlify: Site settings -> Environment variables
//   MAILERLITE_API_KEY = <your MailerLite API token>

const LEAD_MAGNET_GROUP_ID = "193919489339819798";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let firstName, email;
  try {
    const body = JSON.parse(event.body || "{}");
    firstName = (body.firstName || "").trim();
    email = (body.email || "").trim();
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
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
