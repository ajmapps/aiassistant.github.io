module.exports = async function (req, res) {
    try {
        const body = JSON.parse(req.payload);
        const userPrompt = body.prompt || "Hello";
        
        // Native fetch use karein (require ki zaroorat nahi)
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

        const data = await response.json();
        return res.json({ response: data.choices[0].message.content });
    } catch (e) {
        return res.json({ response: "Error: " + e.message });
    }
};
