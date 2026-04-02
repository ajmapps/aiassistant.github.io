module.exports = async function (req, res) {
    try {
        // 1. Parse JSON safely
        let body;
        try {
            body = JSON.parse(req.payload);
        } catch (e) {
            return res.json({ error: "Invalid JSON format" });
        }

        const userPrompt = body.prompt || "Hello";
        const apiKey = process.env.DEEPSEEK_API_KEY;

        // 2. Fetch call with Error Handling
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

        // 3. Check if response is okay
        if (!response.ok) {
            const errorText = await response.text();
            return res.json({ error: `API Error: ${response.status} - ${errorText}` });
        }

        // 4. Safe JSON parsing
        const data = await response.json();
        
        // 5. Final Success
        return res.json({ response: data.choices[0].message.content });

    } catch (error) {
        // Agar code crash kare, to yahan se error milega
        return res.json({ error: "System Error: " + error.message });
    }
};
