export const buildInsightPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `시장 요약.

{
  "summary": "30자 이내"
}

규칙: 핵심 흐름, 팩트 기반.

시장: ${JSON.stringify(marketData)}
뉴스: ${JSON.stringify(newsList)}

IMPORTANT: Return ONLY the raw JSON object above. No markdown, no code blocks, no explanation. Start directly with {`;
};
