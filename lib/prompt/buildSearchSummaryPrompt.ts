import { NewsArticle } from '@/types/news';

export const buildSearchSummaryPrompt = (
  keyword: string,
  news: NewsArticle[]
) => `
당신은 글로벌 경제 및 금융 데이터를 해석하는 전문 애널리스트입니다.
아래는 '${keyword}'와 관련된 최근 글로벌 경제 뉴스 목록입니다.

이 뉴스들을 기반으로 다음 작업을 수행하세요:

1) 원본 뉴스는 영어이지만, 최종 출력은 자연스럽고 정확한 "한국어"로 작성합니다.
2) '${keyword}'와 직접적인 관련성이 높은 인사이트만 선별하여 3~5개의 핵심 주제로 요약합니다.
3) 각 인사이트는 반드시 다음 3가지 정보를 포함해야 합니다:
   - title: 뉴스 흐름을 대표하는 한국어 핵심 제목(1줄)
   - summary: 해당 이슈의 핵심 내용을 2~4줄로 정리한 설명
   - marketImpact: '${keyword}'가 관련된 산업군/섹터/주식시장(특히 한국 시장 포함)에 미칠 가능성 있는 영향 분석

4) 단순 번역이 아니라, 다음 분석 기준을 반영해 경제적 의미를 도출하세요:
   - 글로벌 동향이 한국 경제에 전달되는 메커니즘
   - 금리·환율·원자재 가격 변화 가능성
   - 관련 산업군(예: 반도체, 자동차, 에너지, AI, 금융)의 전망
   - 지정학적·통화정책 변수

5) 출력은 아래 JSON 형식과 동일해야 합니다.
   추가 텍스트 없이 JSON만 출력하세요.
   모든 필드는 문자열이어야 하며, null 또는 undefined를 사용하지 마세요.

출력 형식(JSON):
{
  "keyword": "${keyword}",
  "insights": [
    {
      "title": "",
      "summary": "",
      "marketImpact": ""
    }
  ]
}

아래는 분석 대상 뉴스 목록입니다:
${news
  .map(
    (n, i) => `${i + 1}. 제목: ${n.title}\n   요약: ${n.description ?? ''}\n`
  )
  .join('\n')}
`;
