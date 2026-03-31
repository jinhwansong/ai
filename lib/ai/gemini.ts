import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

/** 503/429·과부하 등 일시적 실패 — 짧게 재시도 */
const RETRYABLE =
  /503|429|UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|overloaded|try again|ECONNRESET|ETIMEDOUT|socket hang up/i;

const MAX_GENERATE_ATTEMPTS = 4;
const BASE_DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function isRetryableGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return RETRYABLE.test(msg);
}

async function generateContentWithRetry(prompt: string) {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_GENERATE_ATTEMPTS; attempt++) {
    try {
      return await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
    } catch (err) {
      lastErr = err;
      const retry = attempt < MAX_GENERATE_ATTEMPTS && isRetryableGeminiError(err);
      if (retry) {
        const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
        console.warn(
          `[Gemini] generateContent 실패 (${attempt}/${MAX_GENERATE_ATTEMPTS}), ${delay}ms 후 재시도:`,
          err instanceof Error ? err.message : err,
        );
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

export async function runGeminiJSON<T = unknown>(prompt: string): Promise<T> {
  const response = await generateContentWithRetry(prompt);

  const text = response.text;
  if (!text) {
    throw new Error(
      'Gemini JSON 파싱: 응답 본문이 비어 있습니다. (API는 성공했으나 텍스트 없음)',
    );
  }

  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('본문에서 { ... } JSON을 찾지 못했습니다.');
    }
    return JSON.parse(match[0]) as T;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Gemini JSON 파싱: ${msg}`);
  }
}

export async function runGeminiText(prompt: string) {
  const response = await generateContentWithRetry(prompt);
  return response.text ?? '';
}
