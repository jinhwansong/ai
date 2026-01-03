export const buildSectorPrompt = (userKeywords: string[], marketData: Record<string, unknown>) => {
  return `
# Role: Investment Strategy Expert
# Task: 유저 관심사 기반 섹터별 투자 전략 생성

유저의 온보딩 관심 키워드와 현재 시장 데이터를 바탕으로 맞춤형 섹터 전략을 생성해줘.

## 유저 관심 키워드:
${userKeywords.join(', ')}

## 현재 시장 데이터:
${JSON.stringify(marketData, null, 2)}

## 출력 형식 (JSON):
{
  "sectors": [
    {
      "name": "섹터명",
      "signal": "POSITIVE | WATCHING | NEUTRAL | NEGATIVE",
      "focus": "핵심 요약 (한 줄)",
      "momentum": "Strong | Moderate | Building",
      "descriptionLong": "섹터별 상세 투자 전략 리포트 (Supabase 저장용)"
    }
  ]
}

## 가이드라인:
- **전달된 모든 키워드**에 대해 각각의 섹터 전략을 생성해줘. (유저 개인화 지원을 위해 전체 풀 확보 필요)
- 모든 필드(name, focus, descriptionLong)는 반드시 **한국어**로 작성해줘.
- signal은 반드시 POSITIVE, WATCHING, NEUTRAL, NEGATIVE 중 하나를 선택해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

