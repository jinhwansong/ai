import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'],
});

export interface MarketIndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  region: string;
}

const GLOBAL_INDICES = {
  KOSPI: { symbol: '^KS11', region: 'KOREA', name: '코스피' },
  NASDAQ: { symbol: '^IXIC', region: 'USA', name: '나스닥' },
  NIKKEI: { symbol: '^N225', region: 'JAPAN', name: '닛케이 225' },
  EUROSTOXX: { symbol: '^STOXX50E', region: 'EUROPE', name: '유로 Stoxx 50' },
} as const;

export async function fetchGlobalIndices(): Promise<MarketIndexData[]> {
  const results = await Promise.all(
    Object.values(GLOBAL_INDICES).map(async (config) => {
      try {
        const quote = await yahooFinance.quote(config.symbol);

        return {
          symbol: config.symbol,
          name: config.name,
          price: quote.regularMarketPrice ?? quote.price ?? quote.bid ?? 0,
          change: quote.regularMarketChange ?? 0,
          changePercent: quote.regularMarketChangePercent ?? 0,
          region: config.region,
        };
      } catch (error) {
        console.error(`Failed to fetch ${config.symbol}:`, error);
        return {
          symbol: config.symbol,
          name: config.name,
          price: 0,
          change: 0,
          changePercent: 0,
          region: config.region,
        };
      }
    })
  );

  return results;
}
