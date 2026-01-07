export const buildMarketImpactPrompt = (marketData: Record<string, unknown>, newsList: unknown[]) => {
  return `
# Role: Global Economic Pulse Detector
# Task: 뉴스 및 지표 분석을 통한 주요 자산군 영향권(Impact Map) 추출

제공된 시장 데이터와 최신 뉴스 리스트를 분석하여, 현재 시장에서 가장 큰 영향을 받고 있는 3가지 핵심 영역(자산군 또는 경제 지표)을 식별하고 그 상태를 판별해줘.

## 입력 데이터:
- 마켓 데이터: ${JSON.stringify(marketData)}
- 최신 뉴스: ${JSON.stringify(newsList)}

## 출력 형식 (JSON):
{
  "score": 75,
  "direction": "+ 상승세 | - 하락세 | 보합",
  "zones": [
    { "label": "채권/금리", "status": "강세 | 약세 | 중립" },
    { "label": "기술주", "status": "강세 | 약세 | 중립" },
    { "label": "달러/환율", "status": "강세 | 약세 | 중립" }
  ],
  "focus": "오늘 시장의 핵심 테마 (한 문장)",
  "description": "이러한 영향권이 형성된 근거에 대한 짧은 설명",
  "tags": ["태그1", "태그2"]
}

## 가이드라인:
- zones는 반드시 **딱 3개**만 추출해줘.
- label은 '기술주', '반도체', '채권/금리', '달러/환율', '원자재', '안전자산' 등 범용적인 경제 용어를 사용해줘.
- status는 현재 뉴스와 지표 흐름상 해당 영역의 '힘'이 어디로 실리는지를 의미해.
- "AI는 참고용"이라는 원칙에 따라, 주관적 추측보다는 뉴스에 나타난 팩트(ex: 금리 인하 기대감 확산, 엔저 현상 심화 등)를 기반으로 작성해줘.

반드시 JSON 형식으로만 응답해줘.
`;
};

