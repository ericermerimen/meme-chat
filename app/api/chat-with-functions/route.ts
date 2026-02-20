import { openai } from '@ai-sdk/openai';
import { streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    tools: {
      get_current_weather: tool({
        description: 'Get the current weather.',
        inputSchema: z.object({
          format: z
            .enum(['celsius', 'fahrenheit'])
            .describe('The temperature unit to use.'),
        }),
        execute: async ({ format }) => ({
          temperature: 20,
          unit: format === 'celsius' ? 'C' : 'F',
        }),
      }),
      eval_code_in_browser: tool({
        description: `Execute javascript code in the browser with eval(). Do not use backticks in your response.
           DO NOT include any newlines in your response, and be sure to provide only valid JSON when providing the arguments object.
           The output of the eval() will be returned directly by the function.`,
        inputSchema: z.object({
          code: z.string(),
        }),
        // No execute - handled client-side
      }),
    },
    stopWhen: stepCountIs(5),
    onFinish({ text }) {
      console.log('completion', text);
    },
  });

  return result.toDataStreamResponse();
}
