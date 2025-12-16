import { DailyReport } from "@/types/report";
import { fetchDailyNews } from "../news/fetchNews";
import { mapToTranslateItems } from "../news/mapToTranslateItem";
import { generateBriefing } from "@/app/api/ai/gemini/briefing";
import { generateStrategy } from "@/app/api/ai/gpt/strategy";

export async function generateDailyReport(): Promise<DailyReport> {
  //  뉴스 수집
  const articles = await fetchDailyNews();

  //  Gemini 입력용 가공
  const items = mapToTranslateItems(articles);

  //  Gemini 브리핑
  const briefing = await generateBriefing(items);

  //  GPT 전략
  const strategy = await generateStrategy(briefing);

  return {
    date: new Date().toISOString().slice(0, 10),
    briefing,
    strategy,
    articles,
    createdAt: new Date().toISOString(),
  };
}
