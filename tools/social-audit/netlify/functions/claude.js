exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    // If this is a Slack notification request handle it separately
    if (body.type === "slack_notification") {
      const { name, email, brand, platform, frustration } = body;

      const slackPayload = {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Social Media Audit Lead"
            }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Name:*\n${name || 'Not provided'}` },
              { type: "mrkdwn", text: `*Email:*\n${email}` },
              { type: "mrkdwn", text: `*Brand:*\n${brand}` },
              { type: "mrkdwn", text: `*Platform:*\n${platform}` }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Biggest Frustration:*\n${frustration || 'Not provided'}`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View Cruz Creative CRM" },
                url: "https://www.cruzcreative.net",
                style: "primary"
              }
            ]
          }
        ]
      };

      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackPayload)
      });

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true })
      };
    }

    // Otherwise handle it as a Claude API request
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