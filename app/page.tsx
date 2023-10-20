"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  function mutateAssistantResponse(inputString: string) {
    // console.log(inputString);
    const splitString = inputString?.split("|");

    // Remove the numbering and trim whitespace for each element
    const resultArray = splitString.map((item) =>
      item
        .replace(/^\s*\d+\.\s*/, "")
        .replace(/["'“”‘’]/g, "")
        .trim()
    );

    // console.log(resultArray);
    // https://apimeme.com/meme?meme=Clown-Applying-Makeup&top=wtf+bro&bottom='haha+you+lame'
    const memeImage = resultArray[3]
      ? `https://apimeme.com/meme?meme=${resultArray[0]}&top=${resultArray[1]}&bottom=${resultArray[2]}`
      : null;
    if (!resultArray[3] || resultArray[3].length <= 3)
      return <>(Thinking...)</>;
    return (
      <>
        {memeImage !== null && <img src={memeImage} alt="meme" />}
        <p>{resultArray[3]}</p>
      </>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.role === "assistant"
                ? mutateAssistantResponse(m.content)
                : m.content}
            </div>
          ))
        : null}

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
