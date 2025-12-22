// 기사 번역

import { TranslateNewsItem } from '@/types/news';

export const buildNewsTranslatePrompt = (items: TranslateNewsItem[]) => `
당신은 경제·금융 분야 전문 번역가입니다.

아래 영문 기사 정보를
정확하고 자연스러운 한국어로 번역하세요.

규칙:
1) 고유명사는 원문 표기를 유지합니다.
2) 과장이나 해석을 추가하지 않습니다.
3) 반드시 JSON 형식으로만 출력합니다.
4) 입력 항목과 동일한 개수로 반환합니다.

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
      }`
  )
  .join('\n\n')}
`;
