const { GoogleGenAI } = require("@google/genai");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { responseSchemaWithExample, responseSchemaWithoutExample } = require("../validators/llmValidator");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const withExamplePrompt = (text) => `Define the word or phrase "${text}".

You MUST return a JSON object with ALL of these fields populated:
{
  "definition": "write the definition here",
  "example": "write an example sentence using ${text} here",
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "antonyms": ["antonym1", "antonym2", "antonym3"]
}

Rules:
- ALL fields are required
- "example" MUST be a sentence containing the word "${text}"
- Do NOT return null for any field`;

const withoutExamplePrompt = (text) => `Define the word or phrase "${text}".

Return a JSON object with exactly these fields:
- "definition": a clear concise definition (string, required)
- "example": null
- "synonyms": array of up to 5 synonyms (required)
- "antonyms": array of up to 5 antonyms (required)`;

async function generate({ text, wantsExample }) {
  try {
    const prompt = wantsExample ? withExamplePrompt(text) : withoutExamplePrompt(text);
    const schema = wantsExample ? responseSchemaWithExample : responseSchemaWithoutExample;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(schema),
      },
    });

    console.log('Raw response:', response.text);
    const parsed = schema.parse(JSON.parse(response.text));
    return parsed;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

module.exports = { generate };