import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function runGeminiJSON(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini 응답에서 텍스트를 찾을 수 없습니다.');
    }
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('JSON 객체를 찾을 수 없습니다.');
    }
    return JSON.parse(match[0]);
  } catch {
    throw new Error('Gemini 에러 발생');
  }
}

export async function runGeminiText(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text ?? '';
}
