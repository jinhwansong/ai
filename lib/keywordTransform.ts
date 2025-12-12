import { runGPTJSON } from '@/lib/openai';
import { buildKeywordTransformPrompt } from '@/lib/prompt/buildKeywordTransformPrompt';

export type KeywordTransformResult = {
  original: string;
  queryEn: string;
  isKoreanInput: boolean;
};

function hasKorean(text: string) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

/**
 * 검색어 전처리:
 * - 한글이면: 해외 뉴스 검색에 적합한 "영문" 키워드로 변환
 * - 영어(또는 비한글)이면: 그대로 사용
 */
export async function transformSearchKeyword(
  input: string
): Promise<KeywordTransformResult> {
  const original = (input ?? '').trim();
  const isKoreanInput = hasKorean(original);

  if (!original) {
    return { original: '', queryEn: '', isKoreanInput };
  }

  if (!isKoreanInput) {
    return { original, queryEn: original, isKoreanInput };
  }

  // 한글 입력 → 검색용 영문 키워드 변환
  try {
    const prompt = buildKeywordTransformPrompt(original);
    const res = (await runGPTJSON(prompt)) as { query?: string };
    const queryEn = (res?.query ?? '').trim();

    // 안전장치: 변환 실패 시 원문 사용 (그래도 파이프라인이 깨지지 않게)
    if (!queryEn) {
      return { original, queryEn: original, isKoreanInput };
    }

    return { original, queryEn, isKoreanInput };
  } catch (e) {
    // OpenAI 키 미설정/네트워크 등 실패 시에도 검색은 진행
    console.error('[transformSearchKeyword] failed:', e);
    return { original, queryEn: original, isKoreanInput };
  }
}


