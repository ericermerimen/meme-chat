import { createOpenAI } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';
import { z } from 'zod';

// Create an OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const data = new StreamData();
  data.append({
    text: 'Hello, how are you?',
  });

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
    tools: {
      get_current_weather: {
        description: 'Get the current weather.',
        parameters: z.object({
          format: z.enum(['celsius', 'fahrenheit']).describe('The temperature unit to use.'),
        }),
        execute: async ({ format }) => {
          // Call a weather API here
          const weatherData = {
            temperature: 20,
            unit: format === 'celsius' ? 'C' : 'F',
          };
          data.append({
            text: 'Some custom data',
          });
          return weatherData;
        },
      },
      eval_code_in_browser: {
        description: 'Execute javascript code in the browser with eval().',
        parameters: z.object({
          code: z.string().describe('Javascript code that will be directly executed via eval().'),
        }),
      },
    },
    onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
