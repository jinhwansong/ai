export const buildPortfolioPrompt = (userPortfolio: Record<string, unknown>, marketContext: Record<string, unknown>) => {
  return `
# Role: Asset Management Specialist
# Task: 전략 포트폴리오 및 자산 배분 현황 생성

현재 시장 상황과 유저의 투자 성향을 고려하여 최적의 포트폴리오 구성안을 생성해줘.

## 유저 현황 및 시장 컨텍스트:
${JSON.stringify({ userPortfolio, marketContext }, null, 2)}

## 출력 형식 (JSON):
{
  "performance": [
    {
      "label": "수익률/지표명 (ex: 연간 수익률)",
      "value": "현재 수치 (ex: 24.8%)",
      "delta": "변동 수치 (ex: +5.2%)"
    }
  ],
  "holdings": [
    {
      "name": "자산/섹터명",
      "ratio": "비중 (ex: 42%)",
      "change": "최근 비중 변동 (ex: +2.4%)"
    }
  ],
  "strategicSummary": "전략 포트폴리오 핵심 요약 (반드시 2줄 정도로 요약해서 작성)"
}

## 가이드라인:
- 반드시 **총 5개**의 주요 보유 종목(Major Holdings)을 선별해서 제공해줘. (메인 대시보드 규격)
- **strategicSummary**는 전체 시장 전략을 관통하는 핵심 통찰을 **반드시 2줄**로 요약하여 제공해줘.
- Major Holdings 비중의 합이 100%에 근접하도록 구성해줘.
- 오늘의 섹터 전략과 일관성 있는 자산 배분안을 제시해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

