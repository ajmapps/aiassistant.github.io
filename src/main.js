module.exports = async function (req, res) {
    try {
        console.log("--- START EXECUTION ---");
        
        // 1. Payload check
        if (!req.payload) {
            return res.json({ error: "Payload is empty" });
        }
        const body = JSON.parse(req.payload);
        const userPrompt = body.prompt || "Hello";
        
        // 2. API Key check
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return res.json({ error: "DEEPSEEK_API_KEY is missing in Appwrite Settings" });
        }

        console.log("Fetching DeepSeek API...");

        // 3. Fetch call
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: userPrompt }]
            })
        });

        // 4. Checking if response exists before calling .json()
        if (!response) {
            return res.json({ error: "Response is undefined (Network failure)" });
        }

        // 5. Check if response is successful
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            return res.json({ error: `API Failed with status ${response.status}: ${errorText}` });
        }

        // 6. Finally parse JSON
        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return res.json({ response: data.choices[0].message.content });
        } else {
            return res.json({ error: "API returned malformed data", raw: JSON.stringify(data) });
        }

    } catch (e) {
        console.error("SYSTEM CRASH:", e.message);
        return res.json({ error: "System Error: " + e.message });
    }
};
