import Groq from "groq-sdk";

export const reviewCode =
    async (req, res) => {

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
        
        try {
            const {
                code,
                language,
            } = req.body;

            const completion =
                await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `
You are a senior software engineer.

Review the code and provide:

1. Bugs
2. Improvements
3. Best Practices
4. Security Issues
5. Overall Score out of 10

Keep response concise.
`,
                        },
                        {
                            role: "user",
                            content: `
Language: ${language}

Code:

${code}
`,
                        },
                    ],
                    model:
                        "llama-3.3-70b-versatile",
                });

            res.json({
                review:
                    completion
                        .choices[0]
                        .message.content,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "AI review failed",
            });
        }
    };