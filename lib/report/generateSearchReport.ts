import { DailyReport } from '@/types/report';
import { convertKeywordToEnglish } from '../ai/keyword';
import { fetchSearchNews } from '../news/fetchNews';
import { mapToTranslateItems } from '../news/mapToTranslateItem';
import { generateBriefing } from '@/app/api/ai/gemini/briefing';

export async function generateSearchReport(
  keyword: string
): Promise<DailyReport> {
  if (!keyword.trim()) {
    throw new Error('검색어가 비어 있습니다.');
  }

  // 제미나이: 한글에서 영어로 번역
  const englishKeyword = await convertKeywordToEnglish(keyword);

  // 뉴스 영문검색
  const articles = await fetchSearchNews(englishKeyword);

  // 제미나이 입력용 가공
  const items = mapToTranslateItems(articles);

  // 제미나이 브리핑
  const briefing = await generateBriefing(items);
  return {
    date: new Date().toISOString().slice(0, 10),
    keyword,
    englishKeyword,
    briefing,
    articles,
    createdAt: new Date().toISOString(),
  };
}
