const pool = require("../config/db");
const generateMeetingMinutes = async (transcript) => {
    if (!transcript || !transcript.trim()) {
        throw new Error("Meeting transcript is required");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const templateResult = await pool.query(
    "SELECT prompt FROM prompt_templates WHERE name = 'Standard Meeting Minutes' LIMIT 1"
);

const templatePrompt =
    templateResult.rows[0]?.prompt ||
    "Analyze the meeting transcript and generate professional meeting minutes.";

const prompt = `
${templatePrompt}

Return ONLY a valid JSON object.
Do not use markdown.
Do not use code fences.
Do not add any text before or after the JSON.

The JSON must contain exactly these fields:
{
  "summary": "string",
  "actionItems": "string",
  "decisions": "string",
  "risks": "string",
  "openQuestions": "string"
}

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
    const providerResult = await pool.query(
    "SELECT config_value FROM system_config WHERE config_key = 'ai_provider'"
);

const aiProvider = providerResult.rows[0]?.config_value || "Google Gemini";

if (aiProvider !== "Google Gemini") {
    throw new Error(`Unsupported AI provider: ${aiProvider}`);
}

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                model: (await pool.query(
                   "SELECT config_value FROM system_config WHERE config_key = 'ai_model'"
                )).rows[0]?.config_value || "gemini-3.6-flash",
                input: prompt
            })
        }
    );

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Gemini API error (${response.status}): ${responseText}`
        );
    }

    let interaction;

    try {
        interaction = JSON.parse(responseText);
    } catch (error) {
        throw new Error("Gemini returned an invalid API response");
    }

    const modelOutputStep = interaction.steps?.find(
        (step) => step.type === "model_output"
    );

    if (!modelOutputStep) {
        throw new Error("Gemini returned no model output");
    }

    const textPart = modelOutputStep.content?.find(
        (item) => item.type === "text"
    );

    if (!textPart || !textPart.text) {
        throw new Error("Gemini returned no text output");
    }

    const generatedText = textPart.text.trim();

    console.log("Gemini raw output:");
    console.log(generatedText);

    let generatedMinutes;

    try {
        generatedMinutes = JSON.parse(generatedText);
    } catch (error) {
        console.error(
            "Gemini returned invalid JSON:",
            generatedText
        );

        throw new Error(
            "Gemini returned invalid JSON for meeting minutes"
        );
    }

    const requiredFields = [
        "summary",
        "actionItems",
        "decisions",
        "risks",
        "openQuestions"
    ];

    for (const field of requiredFields) {
        if (!(field in generatedMinutes)) {
            throw new Error(
                `Gemini response is missing required field: ${field}`
            );
        }
    }

    return generatedMinutes;
};

module.exports = {
    generateMeetingMinutes
};