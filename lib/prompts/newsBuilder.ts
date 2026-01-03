export const buildNewsPrompt = (newsList: unknown[]) => {
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
      "title": "뉴스 제목",
      "descriptionShort": "메인 대시보드용 한 줄 요약 (Redis 저장용)",
      "contentLong": "상세 페이지용 심층 분석 본문 (Supabase 저장용)",
      "tags": ["태그1", "태그2"],
      "impact": "High | Medium | Low",
      "time": "방금 전 | n분 전"
    }
  ]
}

## 가이드라인:
- 반드시 **총 5개**의 핵심 뉴스를 선별해서 제공해줘. (메인 대시보드 규격)
- 모든 필드(title, descriptionShort, contentLong)는 반드시 **한국어**로 작성하거나 번역해서 제공해줘.
- 핵심 이슈를 관통하는 태그를 생성해줘.
- 시장에 미치는 영향도(impact)를 엄격하게 판정해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

