import { runGeminiJSON } from "@/lib/ai/gemini";
import { buildBriefingPrompt } from "@/lib/prompt/gemini.briefing";
import { DailyBriefing } from "@/types/ai";
import { TranslateNewsItem } from "@/types/news";

export async function generateBriefing(
  items: TranslateNewsItem[]
): Promise<DailyBriefing> {
  return runGeminiJSON(buildBriefingPrompt(items));
}
