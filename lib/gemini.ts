import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * 공통 Gemini 모델 가져오기
 */
export function getGeminiModel(model: string = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model });
}

/**
 * 프롬프트 입력 → JSON 파싱 출력
 */
export async function runGeminiJSON(prompt: string) {
  const model = getGeminiModel();

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}
