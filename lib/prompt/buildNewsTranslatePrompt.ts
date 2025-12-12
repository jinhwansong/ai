export type TranslateNewsItem = {
  url: string;
  title: string;
  description: string;
};

export const buildNewsTranslatePrompt = (items: TranslateNewsItem[]) => `
당신은 전문 번역가입니다.
아래 영문 기사 제목/요약을 자연스럽고 정확한 "한국어"로 번역하세요.

규칙:
1) 고유명사(회사/기관/인명/지명)는 가능한 한 원문 표기를 유지하되, 한국어 독자가 이해하기 쉽게 필요하면 괄호로 보충합니다.
2) 과장/추측/의역을 하지 말고 의미를 보존합니다.
3) 번역 결과는 반드시 아래 JSON 형식으로만 출력합니다. 추가 텍스트는 금지입니다.
4) 모든 필드는 문자열이어야 하며, null/undefined를 사용하지 마세요. 비어 있으면 빈 문자열("")을 사용하세요.
5) 입력 배열의 각 항목에 대해 반드시 1:1로 결과를 반환하세요.

출력 형식(JSON):
{
  "items": [
    {
      "url": "",
      "koTitle": "",
      "koDescription": ""
    }
  ]
}

번역 대상:
${items
  .map(
    (it, i) =>
      `${i + 1}. url: ${it.url}\n   title: ${it.title}\n   description: ${it.description}\n`
  )
  .join('\n')}
`;


