const axios = require('axios');

module.exports = async function (req, res) {
    try {
        console.log("Execution Started");
        
        // 1. Payload Parse
        const body = JSON.parse(req.payload);
        const userPrompt = body.prompt || "Hello";

        // 2. Axios API Call
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: [{ role: "user", content: userPrompt }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            }
        });

        // 3. Axios automatically JSON handle karta hai
        if (response.data && response.data.choices && response.data.choices[0]) {
            return res.json({ response: response.data.choices[0].message.content });
        } else {
            return res.json({ error: "Invalid response structure from DeepSeek" });
        }

    } catch (error) {
        // Axios error handling
        if (error.response) {
            console.error("API Error Response:", error.response.data);
            return res.json({ error: "API Error: " + JSON.stringify(error.response.data) });
        } else {
            console.error("System Error:", error.message);
            return res.json({ error: "System Error: " + error.message });
        }
    }
};
