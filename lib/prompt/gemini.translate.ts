// 기사 번역
import { TranslateNewsItem } from "@/types/news";

export const buildNewsTranslatePrompt = (items: TranslateNewsItem[]) => `
당신은 경제·금융 분야 전문 번역가입니다.

아래 영문 기사 제목과 요약을
자연스럽고 정확한 한국어로 번역하세요.

규칙:
1) 고유명사(기업·기관·인명·지명)는 원문 표기를 유지하되 필요 시 괄호로 보충합니다.
2) 과장이나 추측 없이 원문의 의미를 보존합니다.
3) 결과는 반드시 JSON 형식으로만 출력합니다.
4) 모든 필드는 문자열이며, 비어 있으면 ""을 사용합니다.
5) 입력 항목과 1:1로 결과를 반환하세요.

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
      `${i + 1}. url: ${it.url}\n   title: ${it.title}\n   description: ${
        it.description
      }\n`
  )
  .join('\n')}
`;