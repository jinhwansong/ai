export const buildObservationPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `
# Role: Equity & ETF Research Analyst
# Task: 시장 데이터 및 뉴스를 바탕으로 한 '오늘의 관찰 대상' 종목 및 ETF 선정

다음의 실시간 시장 데이터와 최신 뉴스를 분석하여, 투자자가 오늘 가장 주목해야 할 개별 종목 2개와 ETF 1개를 선정하고 그 이유를 설명해줘.

## 입력 데이터:
- 마켓 데이터: ${JSON.stringify(marketData)}
- 최신 뉴스: ${JSON.stringify(newsList)}

## 출력 형식 (JSON):
{
  "observations": [
    {
      "symbol": "티커/종목코드",
      "name": "종목명/ETF명",
      "type": "Stock | ETF",
      "reason": "AI가 이 종목을 관찰 대상으로 선정한 구체적인 이유 (한 문장)",
      "tags": ["키워드1", "키워드2", "키워드3"],
      "momentum": "Strong | Moderate | Building",
      "relatedNews": [
        {
          "title": "관련 뉴스 제목",
          "source": "뉴스 출처",
          "url": "뉴스 원문 링크 (있는 경우에만, 없으면 null)",
          "time": "상대적 시간 (예: 2시간 전)"
        }
      ]
    }
  ]
}

## 가이드라인:
- **선정 기준**: 최근 24시간 내 발생한 강력한 뉴스 호재/악재, 지수 대비 아웃퍼폼 여부, 섹터 로테이션 방향성 등을 종합적으로 고려.
- **다양성**: 가급적 한국(KOSPI/KOSDAQ) 종목 1개, 미국 종목 1개, 글로벌 ETF 1개로 구성해줘.
- **관련 뉴스**: 해당 종목을 선정한 근거가 되는 가장 중요한 최신 뉴스 2~3개를 포함해줘.
- **신뢰성**: 단순 급등주 추천이 아니라, 거시 경제 흐름이나 기업 펀더멘털의 변화를 포착한 '관찰' 성격이어야 함.
- 반드시 JSON 형식으로만 응답해줘.
`;
};

