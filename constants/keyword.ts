/**
 * The News API 수집용 섹터 매핑 (KST 하루 3회, 섹터당 limit=3)
 * - NOTE: 요구사항은 "12개 섹터 (총 36개)"이므로, 아래 12개로 고정합니다.
 * - 언어: en / 정렬: published_at (최신 우선) / 검색어는 중복 사용 가능
 * - UPDATE: 키워드를 간소화하여 검색 성공률 향상 (2024-12)
 */
export const THE_NEWS_SECTORS: Array<{ id: string; name: string; search: string }> = [
  {
    id: 'macro',
    name: '거시경제',
    search: 'economy GDP inflation recession growth',
  },
  {
    id: 'monetary_fx',
    name: '통화정책·환율',
    search: 'Fed interest rates forex dollar euro',
  },
  {
    id: 'ai_semis',
    name: 'AI·반도체',
    search: 'artificial intelligence AI Nvidia AMD TSMC semiconductor',
  },
  {
    id: 'bigtech_platform',
    name: '빅테크·플랫폼',
    search: 'Apple Microsoft Google Meta Amazon tech',
  },
  {
    id: 'robotics_physical_ai',
    name: '로보틱스·피지컬 AI',
    search: 'robotics AI automation industrial robots',
  },
  {
    id: 'energy_power_infra',
    name: '에너지·전력 인프라',
    search: 'energy power electricity nuclear renewable',
  },
  {
    id: 'battery_ev',
    name: '이차전지·전기차',
    search: 'electric vehicle EV Tesla battery lithium',
  },
  {
    id: 'commodities_supply_chain',
    name: '원자재·공급망',
    search: 'commodities oil copper supply chain logistics',
  },
  {
    id: 'bio_health',
    name: '바이오·헬스케어',
    search: 'biotech healthcare pharmaceutical medicine',
  },
  {
    id: 'real_assets',
    name: '부동산·실물자산',
    search: 'real estate property housing commercial',
  },
  {
    id: 'crypto_blockchain',
    name: '가상자산·블록체인',
    search: 'Bitcoin cryptocurrency crypto blockchain Ethereum',
  },
  {
    id: 'trade_geopolitics',
    name: '무역·지정학 리스크',
    search: 'trade geopolitics sanctions tariffs conflict',
  },
];

/**
 * 뉴스 리스트 카테고리 필터용 별칭(동의어) 매핑
 * - 기존 데이터가 ["로봇","클라우드"] 처럼 "세부 키워드"로 저장돼도,
 *   카테고리(섹터명) 선택 시 결과가 나오도록 overlaps 필터에 사용합니다.
 * - 앞으로는 프롬프트에서 relatedSectors를 THE_NEWS_SECTORS.name 중에서만 고르도록 강제하지만,
 *   기존 데이터 호환을 위해 유지합니다.
 */
export const NEWS_SECTOR_ALIASES: Record<string, string[]> = {
  '거시경제': ['거시경제', '매크로', '경기', 'GDP', 'PMI', '인플레이션', '고용'],
  '통화정책·환율': ['통화정책', '환율', '달러', 'USD', '중앙은행', '연준', '금리'],
  'AI·반도체': ['AI', '반도체', 'GPU', 'HBM', '엔비디아', 'NVIDIA', 'TSMC', 'ASML'],
  '빅테크·플랫폼': ['빅테크', '플랫폼', '클라우드', '애플', '마이크로소프트', '구글', '메타', '아마존'],
  '로보틱스·피지컬 AI': ['로봇', '로보틱스', '휴머노이드', '피지컬 AI', '자동화'],
  '에너지·전력 인프라': ['에너지', '전력', '전력망', '그리드', '원전', 'SMR', '데이터센터 전력'],
  '이차전지·전기차': ['이차전지', '배터리', '전기차', 'EV', '테슬라', '리튬'],
  '원자재·공급망': ['원자재', '공급망', '물류', '해운', '유가', '구리', '희토류'],
  '바이오·헬스케어': ['바이오', '헬스', '헬스케어', '제약', 'FDA', '임상', 'GLP-1'],
  '부동산·실물자산': ['부동산', '주택', '모기지', 'REIT', '리츠', '상업용 부동산'],
  '가상자산·블록체인': ['가상자산', '암호화폐', '크립토', '비트코인', '이더리움', '블록체인', 'ETF'],
  '무역·지정학 리스크': ['무역', '관세', '지정학', '제재', '전쟁', '분쟁', '수출통제'],
};

/**
 * 분석 키워드(태그) 체계
 * - 수집 섹터(12개)를 분석의 "기본 축"으로 강제 포함시켜 수집-분석 일관성을 보장합니다.
 * - 아래 확장 키워드는 프롬프트 품질을 올리기 위한 "분석용 세분화"로만 사용합니다.
 */
export const BASE_ANALYSIS_KEYWORDS = THE_NEWS_SECTORS.map((s) => s.name);

export const EXTRA_ANALYSIS_KEYWORDS = [
  // 거시 경제 & 금융 (세분화)
  '글로벌 금융',
  '금리/채권',
  '인플레이션',
  '정부부채/재정',
  '고용지표',

  // 기술/산업 (세분화)
  '우주항공',
  '전력망/SMR',
  '원자재',
  '공급망재편',
  '관세/무역전쟁',
  '소비재/K-푸드',
] as const;

export const ANALYSIS_KEYWORDS = Array.from(
  new Set([...BASE_ANALYSIS_KEYWORDS, ...EXTRA_ANALYSIS_KEYWORDS])
);