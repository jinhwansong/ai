export const buildSectorPrompt = (keywords: string[], marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `섹터 분석.

{
  "sectors": [{
    "name": "섹터명",
    "signal": "POSITIVE|WATCHING|NEUTRAL|NEGATIVE",
    "focus": "한 줄",
    "momentum": "Strong|Moderate|Building",
    "descriptionLong": "2-4문장"
  }]
}

규칙: 뉴스 기반, 팩트 위주, focus 120자 이내.

키워드: ${keywords.join(', ')}
시장: ${JSON.stringify(marketData)}
뉴스: ${JSON.stringify(newsList)}`;
};
