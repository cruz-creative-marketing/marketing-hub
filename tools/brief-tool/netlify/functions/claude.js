exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    if (body.type === "slack_notification") {
      const { brand, product, platform, goal, deadline, briefText } = body;

      const sections = (briefText || "").split("\n\n").map((block) => block.trim()).filter(Boolean);

      const blocks = [
        {
          type: "header",
          text: { type: "plain_text", text: "New Creative Brief Received" }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Brand:*\n${brand}` },
            { type: "mrkdwn", text: `*Product:*\n${product}` },
            { type: "mrkdwn", text: `*Platform:*\n${platform}` },
            { type: "mrkdwn", text: `*Goal:*\n${goal}` },
            { type: "mrkdwn", text: `*Deadline:*\n${deadline || "Not specified"}` }
          ]
        },
        { type: "divider" }
      ];

      sections.forEach((section) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: section.length > 3000 ? section.substring(0, 2990) + "..." : section
          }
        });
      });

      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks })
      });

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true })
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};