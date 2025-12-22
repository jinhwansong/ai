// 뉴스 요약 + 글로벌 매크로
import { TranslateNewsItem } from '@/types/news';
import { getDailyBriefingMeta } from '@/util/times';

export const buildBriefingPrompt = (
  items: TranslateNewsItem[],
  today: { id: string; date: string; publishTime: string }
) => `
당신은 글로벌 경제 리서치 전문가입니다.

오늘 날짜는 ${today.date} 입니다.
아래 기사에 과거 시점의 사건이 포함되어 있더라도
반드시 오늘 기준의 경제 상황을 정리하세요.

목표:
- 오늘 글로벌 경제 환경과 주요 이슈를 사실 중심으로 정리합니다.
- 투자 전략이나 섹터 판단은 절대 포함하지 않습니다.

작성 원칙:
1) 모든 내용은 한국어로 작성합니다.
2) 개별 기사 요약이 아닌, 종합적인 경제 흐름을 설명합니다.
3) 핵심 이슈는 반드시 3~5개로 구성합니다.
4) 글로벌 매크로 평가는 "상태 요약"만 합니다.
5) 매수·매도, 섹터 유망/비유망 판단을 하지 않습니다.
6) 결과는 반드시 JSON 객체 하나만 출력합니다.

출력 형식(JSON):
{
  "id": "${today.id}",
  "date": "${today.date}",
  "publishTime": "${getDailyBriefingMeta().publishTime}",
  "title": "",
  "summary": "",
  "keyIssues": [
    {
      "title": "",
      "description": ""
    }
  ],
  "globalMacro": {
    "us": "positive | neutral | cautious | negative",
    "china": "positive | neutral | cautious | negative",
    "eu": "positive | neutral | cautious | negative",
    "japan": "positive | neutral | cautious | negative"
  }
}

기사 목록:
${items.map((it, i) => `${i + 1}. ${it.title}\n${it.description}`).join('\n\n')}
`;
