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
    name: 'AI/반도체',
    search: 'Nvidia | TSMC | AI Chip',
  },
  {
    id: 'bigtech',
    name: '빅테크',
    search: 'Microsoft | Apple | Google | Meta | Amazon',
  },
  {
    id: 'energy_infra',
    name: '에너지/전력',
    search: 'Nuclear | SMR | Data Center Power',
  },
  {
    id: 'robotics',
    name: '로보틱스',
    search: 'Humanoid | Tesla Bot | Automation | Robot',
  },
  {
    id: 'bio_health',
    name: '바이오/헬스',
    search: 'GLP-1 | Novo Nordisk | Eli Lilly | FDA',
  },
  {
    id: 'finance_crypto',
    name: '금융/가상자산',
    search: 'Bitcoin | Crypto | Fintech | Bank',
  },
  {
    id: 'geopolitics',
    name: '지정학/무역',
    search: 'Tariff | Trade War | China US | Export Control',
  },
  {
    id: 'space_defense',
    name: '우주/방산',
    search: 'SpaceX | Satellite | Defense Tech | Drone',
  },
  {
    id: 'software_cyber',
    name: 'SW/보안',
    search: 'Cybersecurity | SaaS | Cloud | AI Security',
  },
  {
    id: 'real_estate',
    name: '부동산',
    search: 'Housing Market | REITs | Mortgage | Commercial Property',
  },
  {
    id: 'luxury_consumer',
    name: '소비재/사치품',
    search: 'Luxury Goods | LVMH | Brand Trend',
  },
];

/**
 * 뉴스 리스트 카테고리 필터용 별칭(동의어) 매핑
 * - 기존 데이터가 ["로봇","클라우드"] 처럼 "세부 키워드"로 저장돼도,
 *   카테고리(섹터명) 선택 시 결과가 나오도록 overlaps 필터에 사용합니다.
 */
export const NEWS_SECTOR_ALIASES: Record<string, string[]> = {
  '거시경제': ['거시경제', '매크로', '인플레이션', '연준'],
  'AI/반도체': ['AI', '반도체', '엔비디아', 'TSMC', '삼성전자'],
  '빅테크': ['빅테크', '클라우드', '애플', '구글', '메타'],
  '에너지/전력': ['에너지', '전력', '원전', 'SMR'],
  '로보틱스': ['로봇', '로보틱스', '휴머노이드', '자동화'],
  '바이오/헬스': ['바이오', '헬스케어', '제약', 'GLP-1'],
  '금융/가상자산': ['금융', '가상자산', '비트코인', 'ETF'],
  '지정학/무역': ['지정학', '무역', '관세', '미중'],
  '우주/방산': ['우주', '방산', '위성', 'SpaceX'],
  'SW/보안': ['SW', '보안', 'SaaS', '사이버보안'],
  '부동산': ['부동산', 'REIT', '주택'],
  '소비재/사치품': ['소비재', '사치품', 'LVMH'],
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