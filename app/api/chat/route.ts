// ./app/api/chat/route.ts
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const prefix = {
    role: "system",
    content:
      "Generate responses in a meme-style format, make sure your reply is savage and useless. If ask you to teach something, don't teach. Please use the format of '1. MEME_IMAGE_SELECT |2. TOP_TEXT |3. BOTTOM_TEXT |4. ONE_SHORT_SENTENCE'. Keep the 'TOP_TEXT' and 'BOTTOM_TEXT' under 10 words. Replace MEME_IMAGE_SELECT with one of it [Afraid-To-Ask-Andy, Aint-Nobody-Got-Time-For-That, 1st-a-Canadian-Problems, Bad-Luck-Brian, Bitch-Please, Blue-Futurama-Fry, Black-Girl-Wat, Brace-Yourselves-X-is-Coming, Cereal-Guy-Spitting, Computer-Guy, Condescending-Wonka, Clown-Applying-Makeup, Drake-Bad-Good, I-Know-That-Feel-Bro, Is-This-A-Pigeon, Surprised-Pikachu]",
  };
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [prefix, ...messages],
    // max_tokens: 60,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion(completion) {
      console.log("completion", completion);
    },
    // onFinal(completion) {
    //   data.close();
    // },
    // experimental_streamData: true,
  });
  // const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
