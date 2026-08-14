const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateMeetingMinutes = async (transcript) => {
    if (!transcript || !transcript.trim()) {
        throw new Error("Meeting transcript is required");
    }

    const prompt = `
You are an AI meeting minutes assistant.

Analyze the following meeting transcript and generate professional meeting minutes.

Return ONLY valid JSON with exactly these fields:
- summary
- actionItems
- decisions
- risks
- openQuestions

Rules:
- summary: concise summary of the meeting
- actionItems: specific tasks mentioned or assigned
- decisions: decisions that were actually made
- risks: risks or concerns explicitly discussed; if none, return "None identified"
- openQuestions: unresolved questions; if none, return "None identified"
- Do not invent information that is not present in the transcript.

Meeting transcript:
${transcript}
`;

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
                type: "object",
                properties: {
                    summary: {
                        type: "string"
                    },
                    actionItems: {
                        type: "string"
                    },
                    decisions: {
                        type: "string"
                    },
                    risks: {
                        type: "string"
                    },
                    openQuestions: {
                        type: "string"
                    }
                },
                required: [
                    "summary",
                    "actionItems",
                    "decisions",
                    "risks",
                    "openQuestions"
                ]
            }
        }
    });

    return JSON.parse(interaction.output_text);
};

module.exports = {
    generateMeetingMinutes
};