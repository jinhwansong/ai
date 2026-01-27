import { THE_NEWS_SECTORS } from "@/constants/keyword";

export const buildNewsPrompt = (newsList: unknown[]) => {
  const allowedSectors = THE_NEWS_SECTORS.map((s) => s.name);
  const today = new Date().toISOString().split('T')[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // 최적화: 불필요한 설명 제거, 핵심만 유지
  return `뉴스 분석. ${threeDaysAgo} 이후.

{
  "news": [{
    "title": "한국어 제목",
    "descriptionShort": "30-50자",
    "contentLong": "500-800자",
    "checkpoints": ["포인트1", "포인트2", "포인트3"],
    "tags": ["태그1", "태그2"],
    "relatedSectors": ["섹터1", "섹터2"],
    "impact": "High|Medium|Low",
    "url": "URL",
    "source": "출처",
    "publishedAt": "YYYY-MM-DD"
  }]
}

규칙: ${threeDaysAgo} 이후, 한국어 번역, relatedSectors는 ${allowedSectors.join(',')} 중에서만, JSON만.

뉴스: ${JSON.stringify(newsList)}`;
};