export const buildSectorPrompt = (keywords: string[], marketData: Record<string, unknown>) => {
  return `
# Role: Investment Strategy Expert
# Task: 글로벌 경제 분석 기반 섹터별 투자 전략 생성

다음의 주요 경제 카테고리(섹터)와 시장 데이터를 바탕으로 전문적인 투자 전략 리포트를 생성해줘.

## 분석 대상 카테고리:
${keywords.join(', ')}

## 현재 시장 데이터:
${JSON.stringify(marketData, null, 2)}

## 출력 형식 (JSON):
{
  "sectors": [
    {
      "name": "섹터명 (카테고리명과 일치해야 함)",
      "signal": "POSITIVE | WATCHING | NEUTRAL | NEGATIVE",
      "focus": "핵심 분석 요약 (한 줄)",
      "momentum": "Strong | Moderate | Building",
      "descriptionLong": "섹터별 상세 투자 전략 리포트 (현재 시장 상황, 기회 요인, 리스크 요인 포함)"
    }
  ]
}

## 가이드라인:
- **분석 대상 카테고리**에 명시된 모든 항목에 대해 각각의 섹터 전략을 생성해줘.
- "AI는 참고용"이라는 서비스 원칙에 따라, 분석 내용은 객관적인 데이터(marketData)를 바탕으로 논리적으로 서술해줘.
- 모든 필드(name, focus, descriptionLong)는 반드시 **한국어**로 작성해줘.
- signal은 투자 심리와 모멘텀을 반영하여 POSITIVE, WATCHING, NEUTRAL, NEGATIVE 중 가장 적합한 것을 선택해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

