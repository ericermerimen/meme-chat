'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat-with-functions',
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'eval_code_in_browser') {
        const args = toolCall.args as { code: string };
        // WARNING: Do NOT do this in real-world applications!
        return eval(args.code);
      }
    },
  });

  const roleToColorMap: Record<string, string> = {
    system: 'red',
    user: 'black',
    assistant: 'green',
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div
              key={m.id}
              className="whitespace-pre-wrap"
              style={{ color: roleToColorMap[m.role] ?? 'black' }}
            >
              <strong>{`${m.role}: `}</strong>
              {m.content}
              <br />
              <br />
            </div>
          ))
        : null}
      <div id="chart-goes-here"></div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
