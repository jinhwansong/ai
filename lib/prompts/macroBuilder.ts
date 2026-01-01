export const buildMacroPrompt = (data: Record<string, unknown>) => {
  return `
# Role: Global Macro Analyst
# Task: 글로벌 매크로 상태 분석 및 요약 생성

다음 지역의 시장 지수 데이터를 바탕으로 현재 상태를 분석하고 지정된 JSON 형식으로 반환해줘.
대상 지역: 한국(KOSPI), 미국(S&P 500), 일본(Nikkei 225), 유럽(Euro Stoxx 50)

## 입력 데이터:
${JSON.stringify(data, null, 2)}

## 출력 형식 (JSON):
{
  "macro": [
    {
      "region": "지역명",
      "indexName": "지수명",
      "value": "현재가",
      "change": "변동률(ex: +0.5%)",
      "status": "positive | neutral | cautious | negative"
    }
  ]
}

## 상태 판정 가이드 (카카오 T 스타일):
- positive: 상승세 및 호재 중심
- neutral: 변동성이 적고 대기세
- cautious: 불확실성이나 지표 악화 조짐
- negative: 명확한 하락세나 악재 발생

반드시 JSON 형식으로만 응답해줘.
`;
};

