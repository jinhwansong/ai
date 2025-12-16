import { runGeminiText } from "@/lib/ai/gemini";
import { buildKeywordPrompt } from "@/lib/prompt/gemini.keyword";


export async function convertKeywordToEnglish(keyword: string) {
  const result = await runGeminiText(buildKeywordPrompt(keyword));

  return result.trim();
}
