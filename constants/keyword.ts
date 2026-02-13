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
      // Note: keep multi-word terms unquoted; let the API tokenize naturally.
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

/**
 * 뉴스 리스트 카테고리 필터용 별칭(동의어) 매핑
 * - 기존 데이터가 ["로봇","클라우드"] 처럼 "세부 키워드"로 저장돼도,
 *   카테고리(섹터명) 선택 시 결과가 나오도록 overlaps 필터에 사용합니다.
 */
export const NEWS_SECTOR_ALIASES: Record<string, string[]> = {
  '거시경제': [
    '거시경제',
    '매크로',
    '연준',
    'FOMC',
    'Fed',
    '금리',
    '채권',
    'CPI',
    '인플레이션',
    'GDP',
    '고용',
    '실업률',
    'Treasury',
    'yield',
  ],
  'AI/반도체': [
    'AI',
    '반도체',
    '칩',
    'chip',
    'Nvidia',
    '엔비디아',
    'NVDA',
    'GPU',
    'accelerator',
    'H100',
    'Blackwell',
    'HBM',
    'TSMC',
    'foundry',
    '삼성전자',
  ],
  '빅테크': [
    '빅테크',
    '클라우드',
    'Microsoft',
    'MSFT',
    'Apple',
    'AAPL',
    'Google',
    'Alphabet',
    'GOOGL',
    'Meta',
    'META',
    'Amazon',
    'AMZN',
    'antitrust',
    '반독점',
  ],
  '에너지/전력': [
    '에너지',
    '전력',
    '전력망',
    'grid',
    'utility',
    '전기',
    '원전',
    'nuclear',
    'SMR',
    'LNG',
    '가스터빈',
    'gas turbine',
    '데이터센터 전력',
    'data center power',
  ],
  '로보틱스': [
    '로봇',
    '로보틱스',
    'robot',
    'robotics',
    '휴머노이드',
    'humanoid',
    '자동화',
    'automation',
    'Optimus',
    'Tesla Optimus',
    '물류 로봇',
    'warehouse robot',
  ],
  '바이오/헬스': [
    '바이오',
    '헬스',
    '헬스케어',
    '제약',
    'GLP-1',
    'Novo Nordisk',
    'NVO',
    'Eli Lilly',
    'LLY',
    'FDA',
    '임상',
    'clinical trial',
    '승인',
    'drug approval',
  ],
  '금융/가상자산': [
    '금융',
    '가상자산',
    'fintech',
    '비트코인',
    'Bitcoin',
    'BTC',
    'Ethereum',
    'stablecoin',
    'ETF',
    '은행',
    'bank earnings',
  ],
  '지정학/무역': [
    '지정학',
    '무역',
    '관세',
    'tariff',
    '제재',
    'sanctions',
    'export control',
    '수출통제',
    'chip ban',
    '미중',
    'China',
    'US',
    '중동',
    'Middle East',
  ],
  '우주/방산': [
    '우주',
    '방산',
    '위성',
    'satellite',
    '발사',
    'launch',
    'SpaceX',
    '드론',
    'drone',
    'Pentagon',
    'NATO',
    'defense tech',
  ],
  'SW/보안': [
    'SW',
    '소프트웨어',
    '보안',
    '사이버보안',
    'cybersecurity',
    'data breach',
    '해킹',
    'ransomware',
    'zero trust',
    '클라우드 보안',
    'cloud security',
    'SaaS',
    'AI security',
  ],
  '부동산': [
    '부동산',
    '주택',
    'housing market',
    'mortgage rates',
    '금리',
    'REIT',
    'CRE',
    'commercial real estate',
    '오피스 공실',
    'office vacancy',
  ],
  '소비재/사치품': [
    '소비재',
    '사치품',
    'luxury',
    'luxury goods',
    'LVMH',
    'Hermes',
    'Gucci',
    'Prada',
    'consumer spending',
    '소비',
  ],
};

/**
 * 분석 키워드(태그) 체계
 * - 수집 섹터(12개)를 분석의 "기본 축"으로 강제 포함시켜 수집-분석 일관성을 보장합니다.
 * - 아래 확장 키워드는 프롬프트 품질을 올리기 위한 "분석용 세분화"로만 사용합니다.
 */
export const BASE_ANALYSIS_KEYWORDS = THE_NEWS_SECTORS.map((s) => s.name);

export const EXTRA_ANALYSIS_KEYWORDS = [
  '금리/채권',
  '인플레이션/통화',
  '고용/소비',
  '지정학리스크',
  '삼성전자/HBM',
  '엔비디아/TSMC',
  '데이터센터/SMR',
  '휴머노이드',
  '우주/위성',
  'AI보안',
  'GLP-1',
  '비트코인/ETF',
  '부동산/REIT',
  '사치품',
  '원자재',
] as const;

export const ANALYSIS_KEYWORDS = Array.from(
  new Set([...BASE_ANALYSIS_KEYWORDS, ...EXTRA_ANALYSIS_KEYWORDS])
);
