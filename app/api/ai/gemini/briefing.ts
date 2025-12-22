import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildBriefingPrompt } from '@/lib/prompt/gemini.briefing';
import { DailyBriefing } from '@/types/briefing';
import { TranslateNewsItem } from '@/types/news';
import { getDailyBriefingMeta } from '@/util/times';

export async function generateBriefing(
  items: TranslateNewsItem[]
): Promise<DailyBriefing> {
  const meta = getDailyBriefingMeta();
  return runGeminiJSON(
    buildBriefingPrompt(items, {
      id: meta.id,
      date: meta.date,
      publishTime: meta.publishTime,
    })
  );
}
