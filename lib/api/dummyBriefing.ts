import { BriefingSnapshot } from '@/types/briefing';

export const DUMMY_BRIEFING: BriefingSnapshot = {
  id: 'snapshot-2025-01-05-12',
  createdAt: '2025-01-05T12:00:00Z',
  tldr: '미 연준의 금리 동결 시그널과 반도체 수출 호조로 코스피가 상승세를 보이고 있으나, 중동 지정학적 리스크는 여전히 변수로 남아있습니다.',
  hotTopics: [
    {
      summary: { id: 'ht-1', title: '연준, 금리 동결 가능성 시사', tag: '거시경제', impactScore: 8 },
      detail: {
        description: '최근 발표된 고용 지표가 둔화됨에 따라 연준이 금리를 동결할 것이라는 기대감이 확산되고 있습니다.',
        relatedNews: [
          { title: '뉴욕증시, 금리 동결 기대에 상승 마감', url: '#', source: '경제일보' },
          { title: '고용 보고서 분석: 노동시장 열기 식어가는 중', url: '#', source: '글로벌파이낸스' }
        ],
        aiAnalysis: '금리 동결은 시장에 유동성 공급 신호로 작용하며, 특히 성장주에 긍정적인 영향을 미칠 것으로 보입니다.',
        caveat: '인플레이션 지표가 다시 반등할 경우 연준의 입장은 언제든 바뀔 수 있습니다.'
      }
    },
    {
      summary: { id: 'ht-2', title: '반도체 업황 회복 본격화', tag: '산업', impactScore: 9 },
      detail: {
        description: '삼성전자와 SK하이닉스의 실적 가이던스가 상향 조정되며 반도체 섹터 전반에 긍정적인 기류가 흐르고 있습니다.',
        relatedNews: [{ title: 'HBM 수요 폭증으로 반도체 실적 개선', url: '#', source: 'IT투데이' }],
        aiAnalysis: 'AI 서버 수요가 반도체 업황의 새로운 동력이 되고 있습니다.',
        caveat: '글로벌 공급망 리스크와 경쟁 심화는 변수가 될 수 있습니다.'
      }
    }
  ],
  sectorMap: {
    summary: {
      sectors: [
        { name: '반도체', performance: 2.5, trend: 'up' },
        { name: '이차전지', performance: -1.2, trend: 'down' },
        { name: '금융', performance: 0.5, trend: 'up' },
        { name: '에너지', performance: 1.8, trend: 'up' }
      ]
    },
    detail: {
      analysis: '반도체와 에너지 섹터가 시장을 견인하고 있으며, 이차전지는 차익 실현 매물로 인해 약세를 보이고 있습니다.',
      topPerformers: ['반도체', '에너지'],
      bottomPerformers: ['이차전지']
    }
  },
  marketImpact: [
    {
      summary: { id: 'mi-1', newsTitle: '유가 급등', affectedMarket: '항공/물류', direction: 'negative' },
      detail: {
        logicChain: ['중동 긴장 고조', '공급 우려로 유가 상승', '항공사 연료비 부담 증가', '수익성 악화'],
        evidence: 'WTI 유가가 배럴당 90달러를 돌파하며 3개월 만에 최고치를 기록했습니다.',
        aiOpinion: '단기적으로 항공 및 물류 관련주의 변동성이 커질 것으로 예상됩니다.'
      }
    }
  ],
  globalIndices: [
    { name: 'KOSPI', value: '2,650.30', change: '+25.10', changePercent: '+0.96%' },
    { name: 'NASDAQ', value: '16,274.94', change: '+180.20', changePercent: '+1.12%' },
    { name: 'USD/KRW', value: '1,320.50', change: '-5.20', changePercent: '-0.39%' }
  ],
  futureScenarios: [
    {
      summary: { id: 'fs-1', title: '연착륙 시나리오: 골디락스 진입', probability: 'high' },
      detail: {
        fullScenario: '물가 상승률이 완만하게 하락하면서도 경기가 침체에 빠지지 않는 연착륙 가능성이 높아지고 있습니다.',
        preconditions: ['소비 지출 유지', '고용 시장의 점진적 안정'],
        riskFactors: ['지정학적 갈등 심화', '유가 추가 급등'],
        aiDisclaimer: '이 시나리오는 현재 데이터를 기반으로 한 확률 모델이며, 실제 시장 상황과 다를 수 있습니다.'
      }
    }
  ],
  glossary: [
    { term: '골디락스', definition: '경기가 과열되지도, 침체되지도 않은 아주 적당한 상태를 의미합니다.' },
    { term: '매파적 (Hawkish)', definition: '통화 긴축과 금리 인상을 선호하는 정책 성향을 말합니다.' }
  ]
};

