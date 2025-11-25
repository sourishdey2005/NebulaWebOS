import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (apiKey: string) => {
  if (aiClient) return aiClient;
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

export const streamGeminiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  // Safety check for API Key presence
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

  if (!apiKey) {
    // Return a mock response or throw a clear error if key is missing
    // For the UI to handle it gracefully without crashing, we'll throw.
    throw new Error("API Key not found. Please check your configuration.");
  }

  try {
    const ai = getAiClient(apiKey);
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Nebula, an intelligent AI assistant integrated into the NebulaWeb Operating System. You are helpful, concise, and technical. You can help the user with code, general knowledge, and system tasks. Keep responses formatted in Markdown.",
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