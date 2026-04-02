const fetch = require('node-fetch');

module.exports = async function (req, res) {
  const payload = JSON.parse(req.payload);
  const userPrompt = payload.prompt;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  try {
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

    const data = await response.json();
    return res.json({ response: data.choices[0].message.content });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
