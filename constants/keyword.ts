/**
 * The News API 수집용 섹터 매핑 (KST 하루 3회, 섹터당 limit=3)
 * - NOTE: 요구사항은 "12개 섹터 (총 36개)"이므로, 아래 12개로 고정합니다.
 * - 언어: en / 정렬: published_at (최신 우선) / 검색어는 중복 사용 가능
 */

export const THE_NEWS_SECTORS: Array<{
  id: string;
  name: string;
  search: string;
}> = [
  {
    id: 'macro',
    name: '거시경제',
    search: 'Federal Reserve | Inflation | GDP',
  },
  {
    id: 'ai_semis',
    name: 'AI·반도체',
    search: 'Nvidia | TSMC | AI Chip',
  },
  {
    id: 'bigtech',
    name: '빅테크',
    search: 'Microsoft | Apple | Google | Meta | Amazon',
  },
  {
    id: 'energy_infra',
    name: '에너지·전력',
    search: 'Nuclear | SMR | Data Center Power',
  },
  {
    id: 'robotics',
    name: '로보틱스',
    search: 'Humanoid | Tesla Bot | Automation | Robot',
  },
  {
    id: 'bio_health',
    name: '바이오·헬스케어',
    search: 'GLP-1 | Novo Nordisk | Eli Lilly | FDA',
  },
  {
    id: 'finance_crypto',
    name: '금융·가상자산',
    search: 'Bitcoin | Crypto | Fintech | Bank',
  },
  {
    id: 'geopolitics',
    name: '지정학·무역',
    search: 'Tariff | Trade War | China US | Export Control',
  },
  {
    id: 'space_defense',
    name: '우주·방산',
    search: 'SpaceX | Satellite | Defense Tech | Drone',
  },
  {
    id: 'software_cyber',
    name: 'SW·보안',
    search: 'Cybersecurity | SaaS | Cloud | AI Security',
  },
  {
    id: 'real_estate',
    name: '부동산',
    search: 'Housing Market | REITs | Mortgage | Commercial Property',
  },
  {
    id: 'luxury_consumer',
    name: '소비재·사치품',
    search: 'Luxury Goods | LVMH | Brand Trend',
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
  '거시경제': [
    '거시경제',
    '매크로',
    '경기',
    'GDP',
    'PMI',
    '인플레이션',
    '고용',
    '연준',
    'Fed',
  ],
  'AI·반도체': [
    'AI',
    '반도체',
    'GPU',
    'HBM',
    '엔비디아',
    'NVIDIA',
    'TSMC',
    'ASML',
    '삼성전자',
    'Samsung',
    'SK하이닉스',
  ],
  '빅테크': [
    '빅테크',
    '플랫폼',
    '클라우드',
    '애플',
    'Apple',
    '마이크로소프트',
    'MS',
    '구글',
    'Google',
    '메타',
    'Meta',
    '아마존',
    'Amazon',
  ],
  '에너지·전력': [
    '에너지',
    '전력',
    '전력망',
    '그리드',
    '원전',
    'SMR',
    '데이터센터 전력',
  ],
  '로보틱스': [
    '로봇',
    '로보틱스',
    '휴머노이드',
    '자동화',
    'Tesla Bot',
    '피지컬 AI',
  ],
  '바이오·헬스케어': [
    '바이오',
    '헬스케어',
    '제약',
    'FDA',
    '임상',
    'GLP-1',
    '노보노디스크',
    '일라이릴리',
  ],
  '금융·가상자산': [
    '금융',
    '은행',
    '핀테크',
    '가상자산',
    '비트코인',
    'Bitcoin',
    '크립토',
    '이더리움',
    'ETF',
  ],
  '지정학·무역': [
    '지정학',
    '무역',
    '관세',
    '제재',
    '전쟁',
    '분쟁',
    '수출통제',
    '미중 갈등',
  ],
  '우주·방산': [
    '우주',
    '항공',
    '방산',
    '국방',
    '위성',
    'SpaceX',
    '드론',
    'K-방산',
  ],
  'SW·보안': [
    '소프트웨어',
    'SaaS',
    '보안',
    '사이버보안',
    '클라우드 보안',
    'AI Security',
  ],
  '부동산': ['부동산', '주택', '모기지', 'REIT', '리츠', '상업용 부동산'],
  '소비재·사치품': [
    '소비재',
    '사치품',
    '명품',
    'LVMH',
    '브랜드',
    '유통',
    'K-푸드',
  ],
};

/**
 * 분석 키워드(태그) 체계
 * - 수집 섹터(12개)를 분석의 "기본 축"으로 강제 포함시켜 수집-분석 일관성을 보장합니다.
 * - 아래 확장 키워드는 프롬프트 품질을 올리기 위한 "분석용 세분화"로만 사용합니다.
 */
export const BASE_ANALYSIS_KEYWORDS = THE_NEWS_SECTORS.map((s) => s.name);

export const EXTRA_ANALYSIS_KEYWORDS = [
  // 거시 경제 & 정책 (연계 분석용)
  '금리/채권 시장 영향',
  '인플레이션 및 통화정책',
  '고용지표 및 소비심리',
  '글로벌 지정학적 리스크',

  // 기술 및 산업 (심층 분석용)
  '삼성전자 파운드리 및 HBM 전략', // 삼성전자 분석 강화
  '엔비디아/TSMC 반도체 공급망',
  '데이터센터 전력 인프라 및 SMR',
  '휴머노이드 로봇 및 제조 자동화',
  '우주항공/위성 및 차세대 방산',
  '사이버 보안 및 AI 보안 솔루션',

  // 시장 및 실물 자산
  '비만치료제(GLP-1) 및 제약 바이오 트렌드',
  '비트코인/가상자산 ETF 및 규제 동향',
  '상업용 부동산 리스크 및 REITs 수익성',
  '글로벌 사치품 시장 및 소비재 트렌드',
  '원자재 가격 변동 및 공급망 재편',
] as const;

export const ANALYSIS_KEYWORDS = Array.from(
  new Set([...BASE_ANALYSIS_KEYWORDS, ...EXTRA_ANALYSIS_KEYWORDS])
);