
export const getGeminiApiKey = (): string => {
  // Exclusively use process.env.API_KEY as per guidelines
  return process.env.API_KEY || '';
};

export const GEMINI_CONFIG = {
  // Using the standard Flash model (not Pro)
  model: 'gemini-2.5-flash',
  systemInstruction: "You are Nebula, an intelligent AI assistant integrated into the NebulaWeb Operating System. You are helpful, concise, and technical. You can help the user with code, general knowledge, and system tasks. Keep responses formatted in Markdown.",
};
