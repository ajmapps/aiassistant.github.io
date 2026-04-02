const fetch = require('node-fetch');

module.exports = async function (req, res) {
    try {
        console.log("Start Execution");

        // 1. Safe Payload Parsing
        let userPrompt = "Hello";
        try {
            const body = JSON.parse(req.payload);
            userPrompt = body.prompt || "Hello";
        } catch (e) {
            console.log("Payload parsing error, using default");
        }

        // 2. API Call
        console.log("Calling DeepSeek API...");
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

        // 3. Very Safe Response Handling
        if (!response) {
            console.log("Critical Error: response object is undefined");
            return res.json({ error: "Fetch returned no response object" });
        }

        console.log("Response Status:", response.status);

        if (response.ok) {
            const data = await response.json();
            return res.json({ response: data.choices[0].message.content });
        } else {
            const errorText = await response.text();
            console.log("API Error details:", errorText);
            return res.json({ error: "API Request Failed: " + response.status });
        }

    } catch (error) {
        console.log("Caught Error:", error.message);
        return res.json({ error: "System Error: " + error.message });
    }
};
