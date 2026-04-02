module.exports = async function (req, res) {
    try {
        // Safe parsing
        const payload = req.payload ? JSON.parse(req.payload) : {};
        // Appwrite HTTP request mein data double encoded hota hai
        const data = payload.data ? JSON.parse(payload.data) : payload;
        const userPrompt = data.prompt || "Hello";

        const apiKey = process.env.DEEPSEEK_API_KEY;

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

        // Response handling
        if (!response) throw new Error("API did not return a response object");
        
        const responseData = await response.json();
        
        return res.json({ response: responseData.choices[0].message.content });

    } catch (error) {
        return res.json({ error: error.message });
    }
};
