import { buildKeywordPrompt } from "../prompts/keyword";
import { runGeminiText } from "./gemini";

export async function convertKeywordToEnglish(
  keyword: string
): Promise<string> {
  if (!keyword.trim()) {
    throw new Error('Keyword is empty');
  }

  const result = await runGeminiText(buildKeywordPrompt(keyword));

  // Gemini가 가끔 줄바꿈/따옴표 주는 경우 방어
  return result.replace(/["']/g, '').replace(/\n/g, ' ').trim();
}
