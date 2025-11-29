const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { pb } = req.body;

    if (!pb) {
        return res.status(400).json({ error: 'Personal Best (PB) is required' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured on the server');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are THE ORACLE, an AI for a running race called 'THE DROP' in Ávila, Spain. 
            The race has 110m negative elevation drop (downhill).
            The brand personality is: Hypebeast, Minimalist, Arrogant, Cool, Mysterious. Gen Z fashion style.
            Language: Spanglish (natural mix of English and Spanish slang like 'vibe', 'flow', 'brutal', 'hype', 'renta').
            Keep the advice short, punchy, and direct. Max 2 sentences.

            User Input Current 10K PB: ${pb}

            Task:
            1. Predict their time for THE DROP (significantly faster due to downhill). Format "MM:SS".
            2. Write a short, punchy advice paragraph in Spanglish.

            Output format JSON:
            { "prediction": "MM:SS", "advice": "String" }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean markdown if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        res.status(200).json(data);

    } catch (error) {
        console.error('Oracle Error:', error);
        res.status(500).json({
            error: 'Oracle is currently offline (API Error)',
            details: error.message
        });
    }
};
