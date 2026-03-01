import { THE_NEWS_SECTORS } from './sectors';

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
