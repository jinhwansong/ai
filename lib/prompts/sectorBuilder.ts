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
      "signal": "BUY | HOLD | SELL",
      "focus": "핵심 요약 (한 줄)",
      "momentum": "Strong | Moderate | Building",
      "descriptionLong": "섹터별 상세 투자 전략 리포트 (Supabase 저장용)"
    }
  ]
}

반드시 JSON 형식으로만 응답해줘.
`;
};

