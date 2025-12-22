import { runGPTJSON } from '@/lib/ai/openai';
import { buildStrategyPrompt } from '@/lib/prompt/gpt.strategy';
import { DailyBriefing } from '@/types/briefing';
import { DailyStrategy } from '@/types/strategy';

export async function generateStrategy(
  briefing: DailyBriefing
): Promise<DailyStrategy> {
  return runGPTJSON(buildStrategyPrompt(briefing));
}
