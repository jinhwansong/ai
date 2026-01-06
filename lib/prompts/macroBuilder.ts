export const buildMacroPrompt = (data: Record<string, unknown>) => {
  return `
# Role: Global Macro Analyst
# Task: 글로벌 매크로 상태 분석 및 요약 생성

다음 지역의 시장 지수 데이터를 바탕으로 현재 상태를 분석하고 지정된 JSON 형식으로 반환해줘.
대상 지역: 한국(KOSPI), 미국(NASDAQ), 일본(Nikkei 225), 유럽(Euro Stoxx 50)

## 입력 데이터 (Yahoo Finance):
${JSON.stringify(data, null, 2)}

## 출력 형식 (JSON):
{
  "macro": [
    {
      "region": "KOREA | USA | JAPAN | EUROPE",
      "indexName": "지수명 (코스피, 나스닥 등)",
      "value": "현재가 (콤마 포함 문자열)",
      "change": "변동률 (ex: +0.5% 또는 -1.2%)",
      "status": "positive | neutral | cautious | negative",
      "aiAnalysis": "해당 지수의 현재 흐름에 대한 핵심적인 AI 분석 (15자 이내의 짧고 강렬한 한 문장)"
    }
  ]
}

## 가이드라인 (UX 원칙):
- indexName은 반드시 **한국어**로 작성 (코스피, 나스닥, 닛케이 225, 유로 Stoxx 50).
- aiAnalysis는 사용자에게 가장 중요한 '왜 변동했는지' 또는 '현재 심리'를 아주 짧게 요약해줘.
- status 기준:
  - positive: 상승세 및 호재 중심
  - neutral: 변동성이 적고 대기세
  - cautious: 불확실성이나 지표 악화 조짐
  - negative: 명확한 하락세나 악재 발생

반드시 JSON 형식으로만 응답해줘.
`;
};

