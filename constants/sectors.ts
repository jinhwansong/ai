/**
 * RSS 수집용 섹터 매핑 (Cron 빈도·섹터당 상한은 collect-news 참고)
 * - 언어: en 위주 / 검색어 중복 허용 (필터링용 OR 체인)
 */

function normalizeSearchQuery(query: string): string {
  return query
    .split('|')
    .map((keyword) => {
      const trimmed = keyword.trim();
      return trimmed;
    })
    .join(' OR ');
}

export const THE_NEWS_SECTORS: Array<{
  id: string;
  name: string;
  search: string;
}> = [
  {
    id: 'macro',
    name: '거시경제',
    search: normalizeSearchQuery(
      'Federal Reserve | Fed | FOMC | CPI | inflation | GDP | jobs report | unemployment | Treasury yield'
    ),
  },
  {
    id: 'ai_semis',
    name: 'AI/반도체',
    search: normalizeSearchQuery(
      'Nvidia | NVDA | GPU | accelerator | AI chip | H100 | Blackwell | TSMC | foundry | HBM'
    ),
  },
  {
    id: 'bigtech',
    name: '빅테크',
    search: normalizeSearchQuery(
      'Microsoft | MSFT | Apple | AAPL | Google | Alphabet | GOOGL | Meta | META | Amazon | AMZN | antitrust'
    ),
  },
  {
    id: 'energy_infra',
    name: '에너지/전력',
    search: normalizeSearchQuery(
      'data center | power grid | utility | electricity | nuclear | SMR | gas turbine | LNG'
    ),
  },
  {
    id: 'robotics',
    name: '로보틱스',
    search: normalizeSearchQuery(
      'humanoid | robotics | robot | automation | warehouse robot | Tesla Optimus'
    ),
  },
  {
    id: 'bio_health',
    name: '바이오/헬스',
    search: normalizeSearchQuery(
      'GLP-1 | Novo Nordisk | NVO | Eli Lilly | LLY | FDA | clinical trial | drug approval'
    ),
  },
  {
    id: 'finance_crypto',
    name: '금융/가상자산',
    search: normalizeSearchQuery(
      'Bitcoin | BTC | crypto | Ethereum | ETF | stablecoin | fintech | bank earnings'
    ),
  },
  {
    id: 'geopolitics',
    name: '지정학/무역',
    search: normalizeSearchQuery(
      'tariff | sanctions | export control | chip ban | trade | China US | Middle East'
    ),
  },
  {
    id: 'space_defense',
    name: '우주/방산',
    search: normalizeSearchQuery(
      'SpaceX | satellite | launch | defense tech | drone | Pentagon | NATO'
    ),
  },
  {
    id: 'software_cyber',
    name: 'SW/보안',
    search: normalizeSearchQuery(
      'cybersecurity | data breach | ransomware | zero trust | cloud security | SaaS | AI security'
    ),
  },
  {
    id: 'real_estate',
    name: '부동산',
    search: normalizeSearchQuery(
      'housing market | mortgage rates | commercial real estate | CRE | REIT | office vacancy'
    ),
  },
  {
    id: 'luxury_consumer',
    name: '소비재/사치품',
    search: normalizeSearchQuery(
      'luxury | luxury goods | LVMH | Hermes | Gucci | Prada | consumer spending'
    ),
  },
  {
    id: 'politics_policy',
    name: '정치/입법',
    search: normalizeSearchQuery(
      'Congress | Senate | House | White House | election | ballot | Supreme Court | legislation | parliament | policy bill | EU commission'
    ),
  },
  {
    id: 'regulatory',
    name: '규제/반독점',
    search: normalizeSearchQuery(
      'SEC | FTC | DOJ antitrust | merger approval | CFPB | regulation | compliance fine | slot rule | market manipulation'
    ),
  },
  {
    id: 'commodities',
    name: '원자재/상품',
    search: normalizeSearchQuery(
      'crude oil | WTI | Brent | OPEC | copper | gold price | silver | iron ore | LNG spot | farming commodity'
    ),
  },
  {
    id: 'climate_esg',
    name: '기후/ESG',
    search: normalizeSearchQuery(
      'net zero | carbon credit | climate summit | COP | renewable capacity | ESG disclosure | methane rule | sustainability bond'
    ),
  },
];
