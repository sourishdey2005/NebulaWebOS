import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client once. 
// Note: In a real production app, you might want to handle this more dynamically, 
// but for this demo, we assume the env var is present.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamGeminiResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  if (!apiKey) {
    throw new Error("API Key not found. Please check your configuration.");
  }

  try {
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
