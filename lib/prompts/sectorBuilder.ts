export const buildSectorPrompt = (keywords: string[], marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `
# Role: Investment Strategy Expert
# Task: 실시간 시장 지표 및 최신 뉴스를 결합한 섹터별 투자 전략 생성

다음의 경제 섹터 키워드, 실시간 시장 데이터, 그리고 최신 뉴스 리스트를 종합 분석하여 각 섹터별 투자 전략을 생성해줘.

## 분석 대상 섹터 키워드:
${keywords.join(', ')}

## 실시간 시장 지표:
${JSON.stringify(marketData, null, 2)}

## 최신 뉴스 리스트:
${JSON.stringify(newsList)}

## 출력 형식 (JSON):
{
  "sectors": [
    {
      "name": "섹터명 (카테고리명과 일치해야 함)",
      "signal": "POSITIVE | WATCHING | NEUTRAL | NEGATIVE",
      "focus": "핵심 분석 요약 (한 줄)",
      "momentum": "Strong | Moderate | Building",
      "descriptionLong": "뉴스에 기반한 현재 상황과 지표 흐름을 반영한 상세 전략"
    }
  ]
}

## 가이드라인:
1. **뉴스 기반 분석**: 단순 지수 등락뿐만 아니라, 뉴스에서 언급되는 각 섹터의 호재/악재를 반드시 반영해줘.
2. **논리적 연결**: "나스닥이 하락했으므로 빅테크는 부정적" 같은 단순 논리가 아니라, "금리 인하 뉴스로 인해 기술주에 자금이 유입되는 흐름이 포착됨" 같이 구체적 뉴스를 근거로 작성해줘.
3. **신뢰성**: 데이터에 근거하지 않은 과도한 예측은 지양하고, 현재 관찰되는 팩트 위주로 정리해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

