import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 프롬프트 입력 → JSON 객체 출력
export async function runGPTJSON(
  prompt: string,
  opts?: {
    maxTokens?: number;
    tag?: string;
    model?: string;
  }
) {
  try {
    const model = opts?.model ?? 'gpt-4.1-mini';
    const maxTokens = opts?.maxTokens ?? 800;
    const tag = opts?.tag ? ` ${opts.tag}` : '';

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that outputs only in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: maxTokens,
    });

    const choice = completion.choices[0];

    if (!choice || !choice.message || !choice.message.content) {
      console.error(`[GPT EMPTY RESPONSE]${tag}`, {
        model,
        usage: completion.usage,
        finish_reason: choice?.finish_reason,
      });
      throw new Error('GPT returned empty JSON response');
    }

    if (choice.finish_reason !== 'stop') {
      console.error(`[GPT NOT FINISHED]${tag}`, {
        model,
        finish_reason: choice.finish_reason,
        usage: completion.usage,
      });
      throw new Error(
        `GPT response was interrupted (finish_reason=${choice.finish_reason ?? 'unknown'})`
      );
    }

    try {
      return JSON.parse(choice.message.content);
    } catch (parseErr) {
      console.error(`[GPT INVALID JSON]${tag}`, {
        model,
        usage: completion.usage,
        // keep logs small; don't dump prompts
        sample: choice.message.content.slice(0, 400),
      });
      throw new Error(
        `GPT returned invalid JSON (parse_failed=${parseErr instanceof Error ? parseErr.message : String(parseErr)})`
      );
    }
  } catch (error) {
    console.error('❌ GPT JSON Error:', error);
    throw error;
  }
}
