module.exports = async function (req, res) {
    try {
        console.log("Start Execution");

        // 1. Parse Request
        const body = JSON.parse(req.payload);
        const userPrompt = body.prompt || "Hello";

        // 2. Native Fetch Call (No require needed)
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: userPrompt }]
            })
        });

        // 3. Response Check
        if (!response) {
            return res.json({ error: "Fetch returned undefined response" });
        }

        console.log("Status Code:", response.status);

        // 4. Safe Parse
        if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return res.json({ response: data.choices[0].message.content });
            } else {
                return res.json({ error: "API returned empty choices", raw: data });
            }
        } else {
            const errorText = await response.text();
            return res.json({ error: `API Request Failed: ${response.status}`, details: errorText });
        }

    } catch (error) {
        return res.json({ error: "System Error: " + error.message, stack: error.stack });
    }
};
