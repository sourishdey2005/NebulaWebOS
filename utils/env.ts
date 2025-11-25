
export const getGeminiApiKey = (): string => {
  try {
    // Check for both API_KEY (standard) and GEMINI_API_KEY (user specified)
    // We use a safe check for process.env to avoid runtime errors in browsers if not polyfilled
    return (typeof process !== 'undefined' && process.env && (process.env.API_KEY || process.env.GEMINI_API_KEY)) || '';
  } catch (e) {
    console.warn("Could not access process.env");
    return '';
  }
};

export const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash',
  systemInstruction: "You are Nebula, an intelligent AI assistant integrated into the NebulaWeb Operating System. You are helpful, concise, and technical. You can help the user with code, general knowledge, and system tasks. Keep responses formatted in Markdown.",
};
