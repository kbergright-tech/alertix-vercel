const twilio = require("twilio");

module.exports = async function handler(req, res) {
  const {
    TICKETMASTER_URL,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
    ALERT_TO_NUMBER,
  } = process.env;

  const response = await fetch(TICKETMASTER_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = await response.text();

  const ticketsFound = html.includes("edp-quantity-filter-button");

  if (ticketsFound) {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Tickets may be available: ${TICKETMASTER_URL}`,
      from: TWILIO_FROM_NUMBER,
      to: ALERT_TO_NUMBER,
    });
  }

  res.status(200).json({
    checked: true,
    ticketsFound,
  });
};
