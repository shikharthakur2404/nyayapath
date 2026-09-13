import type { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
export const MAX_GRIEVANCE_LENGTH = 4000;
export const MAX_ANSWER_LENGTH = 1000;

export async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI['models']['generateContent']>[0],
  maxRetries: number = 3
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: unknown) {
      lastError = err;
      const errMsg = String((err as Error)?.message || '');
      const isTransient = 
        errMsg.includes('503') || 
        errMsg.includes('high demand') || 
        errMsg.includes('UNAVAILABLE') || 
        errMsg.includes('RESOURCE_EXHAUSTED') || 
        errMsg.includes('429');

      if (isTransient && attempt < maxRetries - 1) {
        const delayMs = (attempt + 1) * 2000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
