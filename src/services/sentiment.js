const fetch = require("node-fetch");
const sentiment = require('multilang-sentiment');

const LANG = process.env["SYSTEM_LANG"];
const GEMINI_BASE_URL = process.env["GEMINI_BASE_URL"] ?? "https://generativelanguage.googleapis.com";
const GEMINI_API_KEY = process.env["GEMINI_API_KEY"];

async function generateSentimentLabels(input) {
  const result = sentiment(input, LANG);
  return {
    sentiment_score: result.score,
  }
}

async function generateSentimentLabelsWithAI(text) {
  // Define the prompt with clear instructions and expected JSON output format
  const prompt = `
    Please analyze the following sentence and return only the following JSON structure.
    1. Evaluate the emotional sentiment of the sentence and return a score between -10 and 10:
      - Positive → positive number  
      - Negative → negative number  
      - Neutral or mixed → 0 or around zero
    2. Extract exactly 5 meaningful **conceptual phrases** that reflect the core **purpose or intent** of the sentence.
      - Use the **same language** as the input sentence.  
      - Each phrase must be **complete and meaningful**, not just a single word.  
      - **Avoid isolated nouns or vague terms.** Each phrase must include **a verb, action, or descriptive structure** (e.g., "نیاز به ارتقا وجود دارد", "تاخیر در ارسال رخ داده", "رنگ مطابق انتظار بود")  
      - If the sentence includes slang, incomplete, or culturally specific words, replace them with standard, general-purpose concepts.  
      - Avoid filler or function-only words like “از”, “به”, “در”, “of”, “to” unless part of a complete phrase.  
      - The final phrases must be **semantically rich**, human-readable, and suitable for **semantic vector search**.
    Return only this JSON format:
    \`\`\`json
    {
      "score": number from -10 to 10,
      "comparative": score divided by total meaningful words,
      "purpose": "five full conceptual phrases separated by commas, written in the same language as the input"
    }
    sentence: "${text}"
`;

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
              type: "object",
              properties: {
                score: { type: "number" },
                comparative: { type: "number" },
                purpose: { type: "string" },
              },
              required: ["score", "comparative", "purpose"]
            },
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Empty response from Gemini");
    }

    const json = JSON.parse(textResponse);

    const score = typeof json.score === "number" ? json.score : 0;
    const comparative = typeof json.comparative === "number" ? json.comparative : 0;
    const purpose = typeof json.purpose === "string" ? json.purpose : null;

    return {
      sentiment_score: score,
      sentiment_comparative: comparative,
      sentiment_purpose: purpose,
    };
  } catch (error) {
    console.error("Error generating sentiment labels:", error);
    await new Promise((res, _) => setTimeout(res, 2000));
    return await generateSentimentLabelsWithAI(text);
  }
}

module.exports = {
  generateSentimentLabels,
  generateSentimentLabelsWithAI,
};
