"use client";

import { useChat } from "ai/react";
import loading0 from "./images/loading-0.gif";
import loading1 from "./images/loading-1.gif";
import loading2 from "./images/loading-2.gif";
import loading3 from "./images/loading-3.gif";
import loading4 from "./images/loading-4.gif";
import mainpic from "./images/mainpic.jpg";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  // console.log("messages", messages);
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

    function loadingImage() {
      switch ((messages?.length / 2) % 5) {
        case 0:
          return (
            <>
              <img src={loading0.src} alt="loading" />
              loading...
            </>
          );
          break;
        case 1:
          return (
            <>
              <img src={loading1.src} alt="loading" />
              loading...
            </>
          );
          break;
        case 2:
          return (
            <>
              <img src={loading2.src} alt="loading" />
              loading...
            </>
          );
          break;
        case 3:
          return (
            <>
              <img src={loading3.src} alt="loading" />
              loading...
            </>
          );
          break;
        case 4:
          return (
            <>
              <img src={loading4.src} alt="loading" />
              loading...
            </>
          );
          break;
      }
    }

    if (!resultArray[3] || resultArray[3].length <= 3)
      return <>{loadingImage()}</>;
    // return <>(Thinking...)</>;
    return (
      <>
        {memeImage !== null && <img src={memeImage} alt="meme" />}
        <p>{resultArray[3]}</p>
      </>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <img src={mainpic.src} alt="meme talk" />
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap my-3">
              <span
                className="font-bold"
                style={{ color: m.role === "user" ? "blue" : "red" }}
              >
                {m.role === "user" ? "You: " : "Not You: "}
              </span>
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
          placeholder="Wussup bro?"
          onChange={handleInputChange}
          // minLength={12}
        />
      </form>
    </div>
  );
}
