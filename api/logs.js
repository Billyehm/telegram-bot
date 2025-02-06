export default async function handler(req, res) {
    // Only allow POST requests (since Vercel sends logs via POST)
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Parse the log data from Vercel
        const logData = req.body;

        // Format the log message
        const message = `🚨 *New Log Entry!*\n\n` +
            `📌 *Project:* ${logData.project}\n` +
            `📝 *Message:* ${logData.text}\n` +
            `⏳ *Time:* ${new Date(logData.timestamp).toLocaleString()}`;

        // Telegram Bot API details
        const TELEGRAM_BOT_TOKEN = "7850146899:AAFJlWMKbl9tglL5KNZG2fTF9fVgiR39h0M";  // Replace with your bot token
        const TELEGRAM_CHAT_ID = "5638533347";  // Replace with your chat ID

        // Send the message to Telegram
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });

        // Respond to Vercel with success
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending log to Telegram:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

