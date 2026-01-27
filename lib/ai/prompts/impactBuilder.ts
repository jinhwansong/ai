export const buildMarketImpactPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `시장 영향. 3개 영역.

{
  "score": 75,
  "direction": "+상승|-하락|보합",
  "zones": [{"label": "채권/금리|기술주|달러/환율|원자재|안전자산", "status": "강세|약세|중립"}],
  "focus": "핵심 테마",
  "description": "근거",
  "tags": ["태그1", "태그2"]
}

규칙: zones 3개, 팩트 기반.

시장: ${JSON.stringify(marketData)}
뉴스: ${JSON.stringify(newsList)}`;
};

