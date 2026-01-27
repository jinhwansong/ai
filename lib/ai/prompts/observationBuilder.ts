export const buildObservationPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `관찰 대상. 종목 2개 + ETF 1개.

{
  "observations": [{
    "symbol": "티커",
    "name": "종목명",
    "type": "Stock|ETF",
    "reason": "한 문장",
    "tags": ["키워드1", "키워드2"],
    "momentum": "Strong|Moderate|Building",
    "relatedNews": [{"title": "제목", "source": "출처", "url": "링크|null"}]
  }]
}

규칙: 한국 1개, 미국 1개, ETF 1개, 뉴스 기반.

시장: ${JSON.stringify(marketData)}
뉴스: ${JSON.stringify(newsList)}`;
};