import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * GPT 모델 가져오기
 */
export function getGPTModel(model: string = 'gpt-4.1-mini') {
  return model;
}

/**
 * 프롬프트 입력 → JSON 객체 출력
 */
export async function runGPTJSON(prompt: string) {
  try {
    const model = getGPTModel();

    const completion = await client.responses.create({
      model,
      input: prompt,
    });

    const text = typeof completion.output_text === 'string' ? completion.output_text : '';
    if (!text) {
      throw new Error('OpenAI 응답에서 텍스트를 찾을 수 없습니다.');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('❌ GPT JSON Error:', error);
    throw new Error('GPT JSON parsing failed');
  }
}
