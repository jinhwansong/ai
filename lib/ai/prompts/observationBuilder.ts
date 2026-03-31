export const buildObservationPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `관찰 대상. 반드시 총 6개: 한국 상장 주식 2개, 미국 상장 주식 2개, ETF 2개.

{
  "observations": [
    {
      "symbol": "티커",
      "name": "종목명",
      "type": "Stock|ETF",
      "reason": "한 문장",
      "tags": ["키워드1", "키워드2"],
      "momentum": "Strong|Moderate|Building",
      "relatedNews": [{"title": "제목", "source": "출처", "url": "링크|null"}]
    }
  ]
}

규칙: 위 배열에 정확히 6개 객체. 각 항목은 아래 뉴스·시장 맥락과 연결될 것. 중복 티커 금지.

시장: ${JSON.stringify(marketData)}
뉴스: ${JSON.stringify(newsList)}`;
};