
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey, GEMINI_CONFIG } from "../utils/env";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (aiClient) return aiClient;
  
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure API_KEY is set in your environment variables.");
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

export const streamGeminiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: GEMINI_CONFIG.model,
      config: {
        systemInstruction: GEMINI_CONFIG.systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: prompt });
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
