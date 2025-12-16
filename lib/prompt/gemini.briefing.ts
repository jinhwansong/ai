// 뉴스 요약 + 글로벌 매크로

import { TranslateNewsItem } from '@/types/news';

export const buildBriefingPrompt = (items: TranslateNewsItem[]) => `
당신은 글로벌 경제 리서치 전문가입니다.

아래는 해외 주요 경제 뉴스 기사 목록입니다.
이 기사들을 종합하여
한국 사용자를 위한 "전문 경제 브리핑 리포트"를 작성하세요.

규칙:
1) 한국어로 작성하세요.
2) 개별 기사 번역이 아니라 전체 경제 흐름을 요약합니다.
3) 핵심 이슈는 3~5개로 정리합니다.
4) 글로벌 매크로 요약은 아래 지역을 포함합니다:
   - 미국
   - 중국
   - 유럽
   - 일본
5) 사실 중심으로 서술하며, 과도한 해석이나 투자 추천은 하지 않습니다.
6) 결과는 반드시 아래 JSON 형식으로만 출력하세요.

출력 형식(JSON):
{
  "keyIssues": [
    "..."
  ],
  "globalMacro": {
    "us": "",
    "china": "",
    "eu": "",
    "japan": ""
  },
  "summary": ""
}

기사 목록:
${items
  .map(
    (it, i) =>
      `${i + 1}. title: ${it.title}\n   description: ${it.description}\n`
  )
  .join('\n')}
`;