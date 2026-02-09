import type { NewsItem } from '@/types/main';

const DUMMY_NEWS_COUNT = 1000;
const IMPACT_LEVELS = ['High', 'Medium', 'Low'] as const;
const SOURCES = [
  'Bloomberg',
  'Reuters',
  'FT',
  'WSJ',
  'KoreaBiz',
  'MarketPulse',
  'Economic Insight',
  'AI Brief',
];
const TAG_POOL = [
  'AI',
  'Markets',
  'Macro',
  'Equities',
  'Policy',
  'Crypto',
  'Inflation',
  'Rates',
  'Tech',
  'Energy',
  'Supply Chain',
  'ESG',
  'Data',
  'Trading',
];
const TITLE_TEMPLATES = [
  'AI 수요 급증, {} 주식에 실적 기대감',
  '금융시장 변동성 확대, {} 영향 분석',
  '정책 변화가 {}에 미치는 파장',
  '글로벌 {} 흐름 주목',
  '투자 심리 비틀림, {} 중심 공략 필요',
];
const SUMMARY_TEMPLATES = [
  '최근 {} 관련 뉴스가 증가하며 투자자 이목 집중',
  '{} 영역에서 주요 기업들이 신규 전략 발표',
  '데이터에 따르면 {} 리스크가 고조되고 있다',
  '전문가들은 {} 움직임을 면밀히 관찰 중',
  '{} 이슈가 시장에 즉각적인 반응을 이끌어내고 있다',
];

const cachedDummyData: NewsItem[] = [];

const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = <T,>(input: T[]) => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const pickTags = () => {
  const count = randomRange(3, 5);
  return shuffleArray(TAG_POOL).slice(0, count);
};

const formatTitle = (index: number, impact: (typeof IMPACT_LEVELS)[number]) => {
  const template =
    TITLE_TEMPLATES[index % TITLE_TEMPLATES.length] ??
    TITLE_TEMPLATES[0];
  return template.replace('{}', impact);
};

const formatSummary = (index: number, impact: (typeof IMPACT_LEVELS)[number]) => {
  const template =
    SUMMARY_TEMPLATES[index % SUMMARY_TEMPLATES.length] ??
    SUMMARY_TEMPLATES[0];
  return template.replace('{}', impact);
};

const buildDummyItem = (index: number): NewsItem => {
  const impact =
    IMPACT_LEVELS[randomRange(0, IMPACT_LEVELS.length - 1)];
  const dateOffset = Math.random() * 30 * 24 * 60 * 60 * 1000;
  return {
    id: `dummy-${index + 1}`,
    title: formatTitle(index, impact),
    summary: formatSummary(index, impact),
    impact,
    source: SOURCES[randomRange(0, SOURCES.length - 1)],
    published_at: new Date(Date.now() - dateOffset).toISOString(),
    tags: pickTags(),
  };
};

const generateDummyNewsItems = () => {
  if (cachedDummyData.length) {
    return cachedDummyData;
  }

  for (let i = 0; i < DUMMY_NEWS_COUNT; i += 1) {
    cachedDummyData.push(buildDummyItem(i));
  }

  return cachedDummyData;
};

export const getDummyNewsItems = () => generateDummyNewsItems();
