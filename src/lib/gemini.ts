import { GoogleGenAI } from "@google/genai";
import { cleanGeminiJsonBlock } from "./helpers";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export interface KeyMoment {
  time: string;
  topic: string;
  timestampSec: number;
}

export interface GeneratedContent {
  shortSummary: string;
  longSummary: string;
  keyMoments: KeyMoment[];
  raw: string;
}

export async function generateSummary(
  episodeDescription: string,
  episodeTitle: string,
  durationSec: number
): Promise<GeneratedContent> {
  const prompt = `
Please analyze this podcast episode and return:
1. A SHORT summary (~250 words)
2. A DETAILED summary (~500 words)
3. 5-8 KEY MOMENTS with approximate timestamps and short topic descriptions

Format your response as **valid JSON** with this structure:
{
  "shortSummary": "brief summary here",
  "longSummary": "detailed summary here",
  "keyMoments": [
    {
      "time": "00:00",
      "timestampSec": 0,
      "topic": "introduction topic"
    }
    // ...
  ]
}

Podcast Title: ${episodeTitle}
Duration: ${Math.floor(durationSec / 60)} minutes
Description: ${episodeDescription}

Distribute timestamps evenly across duration if exact timing is unknown.
Make topics concise but informative.
Only respond with JSON.
`;

  const response = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleanedRaw = cleanGeminiJsonBlock(raw);

  try {
    const parsed = JSON.parse(cleanedRaw) as Omit<GeneratedContent, "raw">;
    return { ...parsed, raw };
  } catch (e) {
    console.error("Failed to parse Gemini response:", raw);

    return {
      shortSummary: raw.slice(0, 300),
      longSummary: raw,
      keyMoments: [],
      raw,
    };
  }
}
