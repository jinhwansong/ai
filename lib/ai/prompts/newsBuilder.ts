import { THE_NEWS_SECTORS } from '@/constants/keyword';

export const buildNewsPrompt = (newsList: unknown[]) => {
  const allowedSectors = THE_NEWS_SECTORS.map((s) => s.name);
  return `
# Role: Financial News Curator
# Task: 뉴스 리스트 분석 및 요약/상세 리포트 생성

제공된 뉴스 리스트를 분석하여 사용자가 이해하기 쉬운 요약과 전문가 수준의 상세 분석을 생성해줘.

## 뉴스 리스트:
${JSON.stringify(newsList, null, 2)}

## 출력 형식 (JSON):
{
  "news": [
    {
      "title": "뉴스 제목 (원본 제목 또는 번역된 제목)",
      "descriptionShort": "메인 대시보드용 한 줄 요약 (30~50자)",
      "contentLong": "상세 페이지용 심층 분석 본문 (공백 제외 800자 ~ 1,200자 내외)",
      "checkpoints": ["핵심 관전 포인트 1", "핵심 관전 포인트 2", "핵심 관전 포인트 3"],
      "tags": ["태그1", "태그2", "태그3"],
      "relatedSectors": ["섹터1", "섹터2"],
      "impact": "High | Medium | Low",
      "url": "원본 뉴스의 url을 그대로 복사 (필수)",
      "source": "뉴스 출처 (예: 데일리뉴스, 경제신문)"
    }
  ]
}

## 중요 규칙:
1. **반드시 총 20개**의 핵심 뉴스를 선별해서 제공해줘. (메인 대시보드 및 리포트 최적화)
2. **url 및 source 필드는 필수**: 입력된 뉴스의 원본 url과 출처(source)를 **정확히 그대로** 복사해서 포함시켜줘. 정보가 없는 뉴스는 선택하지 마.
3. **모든 텍스트는 한국어**: title, descriptionShort, contentLong은 반드시 한국어로 작성하거나 번역해줘.
4. **relatedSectors**: 아래 "허용 섹터 목록"에서만 1~2개를 **정확히 문자열 일치**로 선택해 배열로 제공해줘.
   - 허용 섹터 목록: ${JSON.stringify(allowedSectors)}
5. **impact 판정**: 시장에 미치는 영향도를 엄격하게 평가 (High: 시장 전체 영향, Medium: 특정 섹터 영향, Low: 정보성)
6. **태그는 3개**: 뉴스의 핵심 키워드를 정확히 3개 추출

반드시 JSON 형식으로만 응답하고, 다른 설명은 포함하지 마.
`;
};
