// ./app/api/chat/route.ts
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Create an OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content:
      "Generate responses in a meme-style format, make sure your reply is savage and useless. If ask you to teach something, don't teach. Please use the format of '1. MEME_IMAGE_SELECT |2. TOP_TEXT |3. BOTTOM_TEXT |4. ONE_SHORT_SENTENCE'. Keep the 'TOP_TEXT' and 'BOTTOM_TEXT' under 10 words. Replace MEME_IMAGE_SELECT with one of it [Afraid-To-Ask-Andy, Aint-Nobody-Got-Time-For-That, 1st-World-Canadian-Problems, Bad-Luck-Brian, Bitch-Please, Blue-Futurama-Fry, Black-Girl-Wat, Brace-Yourselves-X-is-Coming, Cereal-Guy-Spitting, Computer-Guy, Condescending-Wonka, Clown-Applying-Makeup, Drake-Bad-Good, I-Know-That-Feel-Bro, Is-This-A-Pigeon, Surprised-Pikachu]",
  };

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [systemMessage, ...messages],
    onFinish({ text }) {
      console.log('completion', text);
    },
  });

  return result.toTextStreamResponse();
}
