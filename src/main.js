module.exports = async function (req, res) {
    // 1. Logs mein check karein ke kya aaya
    console.log("Raw Payload:", req.payload);

    try {
        // Payload ko parse karein
        const body = JSON.parse(req.payload);
        
        // Agar body mein prompt direct hai ya data ke andar hai, handle karein
        const userPrompt = body.prompt || (body.data ? JSON.parse(body.data).prompt : null);
        
        console.log("Parsed Prompt:", userPrompt);

        if (!userPrompt) {
            return res.json({ error: "No prompt found", received: req.payload });
        }

        // DeepSeek logic... (baqi code waisa hi rahega)
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const fetch = require('node-fetch'); // Make sure node-fetch is in package.json
        
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: userPrompt }]
            })
        });

        const data = await response.json();
        return res.json({ response: data.choices[0].message.content });

    } catch (error) {
        return res.json({ error: "Function Error: " + error.message });
    }
};
