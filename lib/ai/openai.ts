import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 프롬프트 입력 → JSON 객체 출력
export async function runGPTJSON(prompt: string) {
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
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
      max_tokens: 800,
    });

    const choice = completion.choices[0];

    if (!choice || !choice.message || !choice.message.content) {
      console.error('[GPT EMPTY RESPONSE]', completion);
      throw new Error('GPT returned empty JSON response');
    }

    if (choice.finish_reason !== 'stop') {
      console.error('[GPT NOT FINISHED]', choice.finish_reason);
      throw new Error('GPT response was interrupted');
    }

    return JSON.parse(choice.message.content);
  } catch (error) {
    console.error('❌ GPT JSON Error:', error);
    throw error;
  }
}
