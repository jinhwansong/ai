export const buildInsightPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `
# Role: Market Summary Analyst
# Task: 시장 데이터와 뉴스를 종합한 한 줄 요약 생성

제공된 시장 데이터와 최신 뉴스 리스트를 분석하여, 오늘의 시장 상황을 한 문장으로 요약해줘.

## 입력 데이터:
- 마켓 데이터: ${JSON.stringify(marketData)}
- 최신 뉴스: ${JSON.stringify(newsList)}

## 출력 형식 (JSON):
{
  "summary": "시장 상황을 한 문장으로 요약한 내용 (30자 이내의 간결한 문장)"
}

## 가이드라인:
- 한 문장으로 시장의 핵심 흐름을 포착해야 함
- 현재 시장의 주요 트렌드나 뉴스 영향을 반영
- 투자 심리에 영향을 줄 수 있는 핵심 요인을 포함
- 객관적인 사실에 기반한 요약

반드시 JSON 형식으로만 응답해줘.
`;
};

