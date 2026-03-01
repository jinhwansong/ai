/**
 * The News API 수집용 섹터 매핑 (KST 하루 3회, 섹터당 limit=3)
 * - NOTE: 요구사항은 "12개 섹터 (총 36개)"이므로, 아래 12개로 고정합니다.
 * - 언어: en / 정렬: published_at (최신 우선) / 검색어는 중복 사용 가능
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
];
